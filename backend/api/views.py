from urllib import request
from django.contrib.auth import get_user_model

from rest_framework import generics, viewsets, views, status
from rest_framework.response import Response


from rest_framework.permissions import AllowAny

from . import serializers
from . import models

User = get_user_model()


class UserAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer

    def get_object(self):
        user = models.User.objects.get(id=self.request.user.id)
        return user


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
