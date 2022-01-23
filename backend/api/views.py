from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.template.loader import render_to_string

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
    queryset = models.User.objects.all()


class LoginAPIView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        employee_id = request.data.get('employee_id')
        user = get_object_or_404(models.User, employee_id=employee_id)
        email = user.email

        res = requests.post('http://localhost:8000/auth/email/',
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
    queryset = models.Department.objects.all()


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
        data_lst = list(data)

        department = data.get('department')
        document = data.get('document')
        reference = data.get('reference')
        subject = data.get('subject')

        receiver = get_object_or_404(
            models.User, employee_id=data.get('receiver'))
        sender = get_object_or_404(
            models.User, employee_id=self.request.user.employee_id)
        meta_info = f'Receipient : {receiver}'

        # sender_department_account = get_object_or_404(
        #     models.User, is_department=True, department__id=sender.department.id)
        receiver_department_account = get_object_or_404(
            models.User, is_department=True, department__id=receiver.department.id)

        print(receiver_department_account)

        if str(department) != str(receiver.department):
            return Response({'msg': 'User Department is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # creating documents and attachments
            document = models.Document.objects.create(
                content=document, subject=subject, created_by=sender, ref=reference)
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
                           sender=sender, document=document, create_code=True)
            else:
                # send to receiver
                trail = models.Trail.objects.create(
                    receiver=receiver, sender=sender, document=document, meta_info=meta_info)
                trail.forwarded = True
                trail.send_id = sender.employee_id
                trail.save()
                send_email(receiver=receiver,
                           sender=sender, document=document, create_code=True)
        except:
            return Response({'msg': 'Something went wrong!!'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'msg': 'Document sent'}, status=status.HTTP_201_CREATED)


class ArchiveAPIView(views.APIView):

    def get(self, request, employee_id=None, format=None):
        # get archive of logged in user
        if employee_id:
            employee = models.User.objects.get(
                employee_id=request.user.employee_id)

            data = [archive for archive in models.Archive.objects.filter(requested=False).order_by(
                'created_by', 'close_date') if archive.created_by == employee or archive.closed_by == employee]
            serialized_data = serializers.ArchiveSerializer(data, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        # get all archives in the database
        archives = models.Archive.objects.all()
        serialized_data = serializers.ArchiveSerializer(archives, many=True)

        return Response(serialized_data.data, status=status.HTTP_200_OK)

    # mark item ass complete or create archive
    def post(self, request, employee_id=None, format=None):
        pass


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
