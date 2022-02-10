import json
from datetime import datetime
from msilib.schema import Error
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.db.models import Q

import random
import string


from rest_framework import generics, viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

import requests

from . import serializers
from . import models


class UserAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


class UsersAPIView(generics.ListAPIView):
    serializer_class = serializers.UserSerializer
    queryset = models.User.objects.filter(
        is_superuser=False).order_by('is_department', 'first_name')


class LoginAPIView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        employee_id = request.data.get('employee_id')
        user = get_object_or_404(models.User, employee_id=employee_id)
        email = user.email

        res = requests.post('http://127.0.0.1:8000/auth/email/',
                            data={'email': email})
        if res.status_code == 200:
            return Response({"email": email}, status=status.HTTP_200_OK)

        return Response({"msg": "Invalid staff Id"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(views.APIView):
    def post(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class DepartmentAPIView(generics.ListAPIView):
    serializer_class = serializers.DepartmentSerializer
    queryset = models.Department.objects.exclude(
        name='Admin')


class IncomingAPIView(views.APIView):

    def get(self, request, format=None):
        user = models.User.objects.get(employee_id=request.user.employee_id)
        incoming = models.Trail.objects.filter(
            forwarded=True,
            receiver=user, status='P')
        serialized_data = serializers.IncomingSerializer(incoming, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class IncomingCountAPIView(views.APIView):

    def get(self, request, format=None):
        user = models.User.objects.get(employee_id=request.user.employee_id)
        incoming = models.Trail.objects.filter(
            forwarded=True,
            receiver=user, status='P')
        count = len(incoming)
        return Response({"data": count}, status=status.HTTP_200_OK)


class OutgoingAPIView(views.APIView):

    def get(self, request, format=None):
        user = models.User.objects.get(employee_id=request.user.employee_id)
        outgoing = models.Trail.objects.filter(
            send_id=user.employee_id,
            sender=user, status='P').order_by('-document__id').distinct('document__id')
        serialized_data = serializers.OutgoingSerializer(outgoing, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class OutgoingCountAPIView(views.APIView):

    def get(self, request, format=None):
        user = models.User.objects.get(employee_id=request.user.employee_id)
        outgoing = models.Trail.objects.filter(
            send_id=user.employee_id,
            sender=user, status='P').order_by('-document__id').distinct('document__id')
        count = len(outgoing)
        return Response({"data": count}, status=status.HTTP_200_OK)


class CreateDocument(views.APIView):

    def post(self, request, format=None):
        data = request.data
        data_lst = list(data)  # for attachments

        data_document_type = data.get('documentType')
        document = data.get('document')
        reference = data.get('reference')
        subject = data.get('subject')
        encrypt = json.loads(data.get('encrypt'))
        receiver = get_object_or_404(
            models.User, employee_id=data.get('receiver'))
        sender = get_object_or_404(
            models.User, employee_id=self.request.user.employee_id)

        if data_document_type == 'Custom':
            department = data.get('department')

            meta_info = f'Receipient : {receiver}'
            document_type = get_object_or_404(
                models.DocumentType, name=data_document_type)

            # sender_department_account = get_object_or_404(
            #     models.User, is_department=True, department__id=sender.department.id)
            receiver_department_account = get_object_or_404(
                models.User, is_department=True, department__id=receiver.department.id)

            if str(department) != str(receiver.department):
                return Response({'msg': 'User Department is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # creating documents and attachments
                document = models.Document.objects.create(
                    content=document, subject=subject, created_by=sender, ref=reference, document_type=document_type, encrypt=encrypt)
                if document:
                    count = 0
                    for item in data_lst:
                        if item == f'attachment_{count}':
                            doc = data[item]
                            if f'attachment_subject_{count}' in data_lst:
                                sub = data[f'attachment_subject_{count}']

                            related_document = models.RelatedDocument.objects.create(
                                subject=sub, content=doc, document=document)
                            count += 1

                # send to reciever department if sender and receiver not in the same department
                if sender.department != receiver.department:
                    trail = models.Trail.objects.create(
                        receiver=receiver_department_account, sender=sender, document=document, meta_info=meta_info)
                    trail.forwarded = True
                    trail.send_id = sender.employee_id
                    trail.save()
                    send_email(receiver=receiver_department_account,
                               sender=sender, document=document, create_code=encrypt)
                else:
                    # send to receiver
                    trail = models.Trail.objects.create(
                        receiver=receiver, sender=sender, document=document, meta_info=meta_info)
                    trail.forwarded = True
                    trail.send_id = sender.employee_id
                    trail.save()
                    send_email(receiver=receiver,
                               sender=sender, document=document, create_code=encrypt)
            except:
                return Response({'msg': 'Something went wrong!!'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                document_type = models.DocumentType.objects.get(
                    name=data_document_type)
                document = models.Document.objects.create(
                    content=document, subject=subject, created_by=sender, ref=reference, document_type=document_type)
                if document:
                    count = 0
                    for item in data_lst:
                        if item == f'attachment_{count}':
                            doc = data[item]
                            if f'attachment_subject_{count}' in data_lst:
                                sub = data[f'attachment_subject_{count}']

                            related_document = models.RelatedDocument.objects.create(
                                subject=sub, content=doc, document=document)
                            count += 1
                document_actions = models.DocumentAction.objects.filter(
                    document_type=document_type)
                document_action_receiver = [
                    path for path in document_actions if path.user == receiver]
                document_action_lst = [action for action in document_actions]

                if len(document_action_receiver) > 0:
                    document_action_receiver_index = document_action_lst.index(
                        document_action_receiver[0])
                    current_trail_position = document_action_receiver_index

                    trail = models.Trail.objects.create(
                        receiver=receiver, sender=sender, document=document, order=current_trail_position)
                    trail.forwarded = True
                    trail.send_id = sender.employee_id
                    trail.save()
                    send_email(receiver=receiver,
                               sender=sender, document=document, create_code=encrypt)
            except Exception as err:
                print(err)
            return Response({'working': 'yes'}, status=status.HTTP_201_CREATED)

        return Response({'msg': 'Document sent'}, status=status.HTTP_201_CREATED)


class DocumentAPIView(views.APIView):
    def get(self, request, id, format=None):
        document = get_object_or_404(models.Document, id=id)
        serialized_data = serializers.DocumentsSerializer(document)
        return Response(serialized_data.data)


class MinuteAPIView(views.APIView):

    def post(self, request, document_id, format=None):
        content = request.data
        document = get_object_or_404(models.Document, id=document_id)
        creator = get_object_or_404(models.User, id=request.user.id)
        minute = models.Minute.objects.create(
            content=content, created_by=creator, document=document)
        serialized_data = serializers.MinuteSerializer(minute)
        return Response(serialized_data.data, status=status.HTTP_201_CREATED)


class ArchiveAPIView(views.APIView):

    def get(self, request, user_id=None, format=None):
        # get archive of logged in user[department]
        if user_id:
            employee = models.User.objects.get(
                employee_id=user_id)

            data = [archive for archive in models.Archive.objects.all().order_by(
                'created_by') if archive.created_by.department == employee.department]
            serialized_data = serializers.ArchiveSerializer(data, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        # get all archives in the database
        archives = models.Archive.objects.all()
        serialized_data = serializers.ArchiveSerializer(archives, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)

    # mark item ass complete or create archive
    def post(self, request, user_id=None, format=None):
        pass


class MarkCompleteAPIView(views.APIView):
    def post(self, request, id, format=None):
        trails = models.Trail.objects.filter(document__id=id)
        document = models.Document.objects.get(id=id)

        for trail in trails:
            trail.status = 'C'
            trail.save()

        completed_documents = models.Trail.objects.filter(
            document__id=id, status='C').order_by('date')
        last_trail = completed_documents.last()

        create_archive = models.Archive.objects.create(
            created_by=document.created_by, closed_by=last_trail.receiver, document=document)

        return Response({'success': 'marked as complete'}, status=status.HTTP_200_OK)


class TrackingAPIView(views.APIView):
    def get(self, request, document_id, format=None):
        trackingStep = []
        try:
            trails = models.Trail.objects.filter(document_id=document_id)

            creator = trails.last()
            trackingStep.append(
                f'{creator.sender.first_name} {creator.sender.last_name}')

            for i in range(len(trails)-1, -1, -1):
                trail = trails[i]
                name = f'{trail.receiver.first_name} {trail.receiver.last_name}'
                trackingStep.append(name)
        except:
            return Response({'msg': f'Invalid Id. Document with Id:"{document_id}" cannot be tracked'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"data": trackingStep}, status=status.HTTP_200_OK)


class PreviewCodeAPIView(views.APIView):
    def post(self, request, user_id, document_id, format=None):
        data = request.data
        user_code = data.get('code')

        code = models.PreviewCode.objects.filter(
            user__employee_id=user_id, document__id=document_id).first()

        if user_code == code.code:
            code.used = True
            code.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'Error': 'Wrong Code'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, user_id, document_id, format=None):
        data = models.PreviewCode.objects.filter(
            document__id=document_id, user__employee_id=user_id)
        serialised_data = serializers.PreviewCodeSerializer(data, many=True)
        return Response(serialised_data.data, status=status.HTTP_200_OK)


class DocumentTypeAPIView(views.APIView):
    def get(self, request, format=None):
        document_types = models.DocumentType.objects.filter(
            Q(department=request.user.department) | Q(department=None))
        serialized_data = serializers.DocumentTypeSerializer(
            document_types, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)


class DocumentActionAPIView(views.APIView):

    def get(self, request, action_id, format=None):
        if action_id:
            try:
                # get document actions for the requested document type
                document_action = models.DocumentAction.objects.filter(
                    document_type__id=action_id)
                if len(document_action) > 0:
                    # check if the last user in the document action is the department account else create a department action
                    document_action_last_user = document_action.last()
                    department_account = models.User.objects.get(
                        department=request.user.department, is_department=True)
                    if document_action_last_user.user != department_account:
                        document_type = document_action[0].document_type
                        models.DocumentAction.objects.create(
                            user=department_account, action='F', document_type=document_type)
                    # Check if the request.user [creator of document] is in the document actions
                    document_sender = [
                        user for user in document_action if user.user == request.user]
                    if len(document_sender) > 0:
                        # if request.user is in the document action send document to next user after request.user
                        document_action_lst = [
                            action for action in models.DocumentAction.objects.filter(
                                document_type__id=action_id)]
                        document_action_sender_index = document_action_lst.index(
                            document_sender[0])
                        # check if there is a next user to send to then send
                        if document_action_sender_index + 1 <= len(document_action_lst):
                            document_action_next_receiveing_user = document_action_lst[
                                document_action_sender_index + 1]
                        data = document_action_next_receiveing_user
                        serialized_data = serializers.DocumentActionSerializer(
                            data)
                        return Response(serialized_data.data, status=status.HTTP_200_OK)
                    else:
                        document_action_next_receiveing_user = document_action[0]
                        data = document_action_next_receiveing_user
                        serialized_data = serializers.DocumentActionSerializer(
                            data)
                        return Response(serialized_data.data, status=status.HTTP_200_OK)
                else:
                    Response({'status': 'error'},
                             status=status.HTTP_404_NOT_FOUND)
            except Exception as err:
                print(err)
        return Response({'data': 'Custom'}, status=status.HTTP_200_OK)


class ForwardDocumentAPIView(views.APIView):

    def get(self, request, document_id, format=None):

        try:
            document = models.Document.objects.get(id=document_id)
            if document.document_type.name == 'Custom':
                return Response({'data': 'null'}, status=status.HTTP_200_OK)

            document_actions = models.DocumentAction.objects.filter(
                document_type=document.document_type)
            document_prev_trail = models.Trail.objects.filter(
                document=document)[0]
            next_receiving_user_index = document_prev_trail.order + 1
            if next_receiving_user_index <= len(document_actions)-1:
                next_receiving_user = document_actions[next_receiving_user_index].user
                serialized_receiver = serializers.UserSerializer(
                    next_receiving_user)
                data = {"receiver": serialized_receiver.data,
                        "last_receiver": False}
                return Response({'data': data}, status=status.HTTP_201_CREATED)
            else:
                data = {"receiver": None,
                        "last_receiver": True}
                return Response({'data': data}, status=status.HTTP_201_CREATED)
        except Exception as err:
            print(err, 'forward doc GET')

        return Response({'status': 'error'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        data = request.data

        receiver = models.User.objects.get(employee_id=data['receiver'])
        sender = models.User.objects.get(employee_id=request.user.employee_id)
        document = models.Document.objects.get(id=data['document'])

        if document.document_type.name.lower() == 'custom':
            try:
                prev_trail = models.Trail.objects.filter(
                    document=document).latest('document')
                prev_trail.forwarded = False
                prev_trail.save()

                # When a department is forwarding a document
                if sender.is_department:
                    # Department is same as that of receiver
                    if receiver.department == sender.department:
                        trail = models.Trail.objects.create(
                            receiver=receiver, sender=sender, document=document)
                        trail.send_id = sender.employee_id
                        trail.forwarded = True
                        trail.save()
                        send_email(receiver=receiver,
                                   sender=sender, document=document, create_code=document.encrypt)
                    # Department is different from that of receiver
                    else:
                        meta_info = f'Receipient : {receiver}'
                        receiver_department_account = models.User.objects.get(
                            department=receiver.department, is_department=True)
                        trail = models.Trail.objects.create(
                            receiver=receiver_department_account, sender=sender, document=document, meta_info=meta_info)
                        # department_trail = models.DepartmentTrail.objects.create(
                        #     trail=trail)
                        trail.send_id = sender.employee_id
                        trail.forwarded = True
                        trail.save()
                        send_email(receiver=receiver_department_account,
                                   sender=sender, document=document, create_code=document.encrypt)
                # When an employee is forwarding a document
                else:
                    # sending employee Department is same as receiver employee department
                    if receiver.department == sender.department:
                        trail = models.Trail.objects.create(
                            receiver=receiver, sender=sender, document=document)
                        trail.send_id = sender.employee_id
                        trail.forwarded = True
                        trail.save()
                        send_email(receiver=receiver,
                                   sender=sender, document=document, create_code=document.encrypt)
                    # sending employee department is different from receiver employee department
                    else:
                        meta_info = f'Receipient : {receiver}'
                        receiver_department_account = models.User.objects.get(
                            department=receiver.department, is_department=True)
                        trail = models.Trail.objects.create(
                            receiver=receiver_department_account, sender=sender, document=document, meta_info=meta_info)
                        trail.send_id = sender.employee_id
                        trail.forwarded = True
                        trail.save()
                        send_email(receiver=receiver_department_account,
                                   sender=sender, document=document, create_code=document.encrypt)
                        # department_trail = models.DepartmentTrail.objects.create(
                        #     trail=trail)
            except Exception as err:
                print(err)
                return Response({'error': 'Wrong Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                prev_trail = models.Trail.objects.filter(
                    document=document)[0]
                document_actions = models.DocumentAction.objects.filter(
                    document_type=document.document_type)
                prev_trail.forwarded = False
                prev_trail.save()

                # document_action_lst = [action for action in document_actions]

                document_action_receiver_index = prev_trail.order + 1
                trail = models.Trail.objects.create(
                    receiver=receiver, sender=sender, document=document, order=document_action_receiver_index)
                trail.send_id = sender.employee_id
                trail.forwarded = True
                trail.save()
                send_email(receiver=receiver,
                           sender=sender, document=document, create_code=document.encrypt)
            except Exception as err:
                print(err)

        return Response({'working': 'yes'}, status=status.HTTP_201_CREATED)


class SearchAPIView(views.APIView):
    def get(self, request, term, format=None):
        documents = []
        active_requested_document = models.RequestDocument.objects.filter(
            requested_by=request.user, active=True)
        active_requested_document_lst = [
            doc.document for doc in active_requested_document]
        incoming = models.Trail.objects.filter(
            forwarded=True,
            receiver=request.user, status='P')
        for item in incoming:
            document_serializer = serializers.DocumentsSerializer(
                item.document)
            incoming_data = {
                "document": document_serializer.data, "route": "incoming"}
            documents.append(incoming_data)

        outgoing = models.Trail.objects.filter(
            send_id=request.user.employee_id,
            sender=request.user, status='P').order_by('-document__id').distinct('document__id')
        for item in outgoing:
            document_serializer = serializers.DocumentsSerializer(
                item.document)
            outgoing_data = {
                "document": document_serializer.data, "route": "outgoing"}
            documents.append(outgoing_data)

        archive = [archive for archive in models.Archive.objects.all().order_by(
            'created_by') if archive.created_by.department == request.user.department]
        for item in archive:
            if item.document not in active_requested_document_lst:
                document_serializer = serializers.DocumentsSerializer(
                    item.document)
                archive_data = {
                    "document": document_serializer.data, "route": "archive"}
                documents.append(archive_data)

        data = [doc for doc in documents if term in doc['document']
                ['subject'].lower()]

        return Response(data, status=status.HTTP_200_OK)


class RequestDocumentAPIView(views.APIView):

    def post(self, request, format=None):
        data = request.data
        requested_by = models.User.objects.get(
            employee_id=request.user.employee_id)
        document = models.Document.objects.get(id=data['document_id'])
        archive_document = models.Archive.objects.get(document__id=document.id)
        requested_from = archive_document.closed_by

        existing_request = models.RequestDocument.objects.filter(
            document__id=document.id, requested_by=requested_by, active=True)

        sent_document = models.ActivateDocument.objects.filter(
            document__id=document.id, document_receiver=requested_by, expired=False)

        if len(existing_request) > 0:
            return Response({'msg': 'You already requested this document'}, status=status.HTTP_200_OK)

        if len(sent_document) > 0:
            return Response({'msg': 'Document has been sent to you'}, status=status.HTTP_200_OK)

        create_request = models.RequestDocument.objects.create(
            requested_by=requested_by, document=document, requested_from=requested_from)

        return Response({'working': 'yes'}, status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        employee = models.User.objects.get(
            employee_id=request.user.employee_id)
        active_requests = models.RequestDocument.objects.filter(
            active=True, requested_from=employee)
        serialized_data = serializers.RequestDocumentSerializer(
            active_requests, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)


class NotificationsCountAPIView(views.APIView):

    def get(self, request, format=None):
        pending_document_requests = models.RequestDocument.objects.filter(
            active=True, requested_from=request.user).count()
        activated_documents = models.ActivateDocument.objects.filter(
            document_receiver=request.user, expired=False).count()

        total = pending_document_requests + activated_documents

        return Response({"count": total}, status=status.HTTP_200_OK)


class ActivateDocument(views.APIView):
    def post(self, request, format=None):
        data = request.data

        receiver = models.User.objects.get(employee_id=data['receiver_id'])
        sender = models.User.objects.get(employee_id=request.user.employee_id)
        document = models.Document.objects.get(id=data['document_id'])
        date = data.get('expire_at')
        expire_at = datetime.fromisoformat(date[:-1])
        print(date)
        print(expire_at)

        requested_doc_instance = models.RequestDocument.objects.get(
            id=data['request_id'])

        activate_doc = models.ActivateDocument.objects.create(document=document, expire_at=expire_at, document_receiver=receiver,
                                                              document_sender=sender)

        send_email(receiver=receiver,
                   sender=sender, document=document, create_code=False)

        if activate_doc:
            requested_doc_instance.active = False
            requested_doc_instance.save()

        return Response({'msg': 'Document has been activated and sent'}, status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        employee = models.User.objects.get(
            employee_id=request.user.employee_id)
        activated_documents = models.ActivateDocument.objects.filter(
            expired=False, document_receiver=employee)
        serialized_data = serializers.ActivateDocumentSerializer(
            activated_documents, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)


def generate_code():
    code = random.sample(string.digits, 4)
    return ''.join(code)


def send_email(receiver, sender, document, create_code=False):

    code = None

    if create_code:
        code = generate_code()
        models.PreviewCode.objects.create(
            user=receiver, code=code, document=document)

    subject = 'New Document Received'

    body = f'''You Just Received a document
            {document.subject.capitalize()} from {sender.first_name} {sender.last_name}.'''

    info = {
        'sender': sender,
        'receiver': receiver
    }

    if code:
        info['code'] = code
        body = f'''You Just Received a document
            {document.subject.capitalize()} from {sender.first_name} {sender.last_name}
            with a one time token to view it. Your one time code is {code}'''

    # html_body = render_to_string('preview_code.html', info)

    send_mail(subject, body, sender.email, [
              receiver.email], fail_silently=False)
    # send_mail(subject, None, sender.user.email, [
    #           receiver.user.email], fail_silently=False, html_message=html_body)
