from urllib import request
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import generics, viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

import requests

from . import serializers
from . import models

User = get_user_model()


class UserAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


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
        user = models.User.objects.get(id=request.user.id)
        incoming = models.Trail.objects.filter(
            forwarded=True,
            receiver=user, status='P')
        serialized_data = serializers.IncomingSerializer(incoming, many=True)
        return Response(serialized_data.data)


class OutgoingAPIView(views.APIView):

    def get(self, request, format=None):
        user = models.User.objects.get(id=request.user.id)
        outgoing = models.Trail.objects.filter(
            send_id=user.employee_id,
            sender=user, status='P').order_by('-document__id').distinct('document__id')
        serialized_data = serializers.OutgoingSerializer(outgoing, many=True)
        return Response(serialized_data.data)
