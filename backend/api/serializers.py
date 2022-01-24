from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import models


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Department
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()

    class Meta:
        model = get_user_model()
        fields = ['first_name', 'last_name', 'email',
                  'is_department', 'employee_id', 'department']


class MinuteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Minute
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = f'{instance.created_by.first_name} {instance.created_by.last_name}'
        return representation


class RelatedDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RelatedDocument
        fields = ['id', 'subject', 'content']


class PreviewCodeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = models.PreviewCode
        fields = ['code', 'used', 'user']


class DocumentsSerializer(serializers.ModelSerializer):
    minute = serializers.SerializerMethodField()
    related_document = serializers.SerializerMethodField()
    preview_code = serializers.SerializerMethodField()

    class Meta:
        model = models.Document
        fields = ['id', 'content', 'subject', 'minute',
                  'related_document', 'preview_code', 'ref']

    def get_related_document(self, obj):
        related_document = obj.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data

    def get_minute(self, obj):
        minute = models.Minute.objects.filter(document=obj)
        serialized_data = MinuteSerializer(minute, many=True)
        return serialized_data.data

    def get_preview_code(self, obj):
        code = models.PreviewCode.objects.filter(document=obj)
        serialized_data = PreviewCodeSerializer(code, many=True)
        return serialized_data.data


class IncomingSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    document = DocumentsSerializer()
    related_document = serializers.SerializerMethodField()

    class Meta:
        model = models.Trail
        fields = ['id', 'sender', 'document',
                  'date', 'related_document', 'meta_info']

    def get_related_document(self, obj):
        related_document = obj.document.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data


class OutgoingSerializer(serializers.ModelSerializer):
    receiver = UserSerializer()
    document = DocumentsSerializer()
    related_document = serializers.SerializerMethodField()

    class Meta:
        model = models.Trail
        fields = ['id', 'receiver', 'document',
                  'date', 'related_document', 'meta_info']

    def get_related_document(self, obj):
        related_document = obj.document.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data


class TrailSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()
    document = DocumentsSerializer(required=False)
    related_document = serializers.SerializerMethodField()

    class Meta:
        model = models.Trail
        fields = ['sender', 'receiver', 'document',
                  'related_document', 'meta_info']

    def get_related_document(self, obj):
        related_document = obj.document.relateddocument_set
        serialized_related_document = RelatedDocumentSerializer(
            related_document, many=True)
        return serialized_related_document.data


class ArchiveSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    closed_by = UserSerializer()
    document = DocumentsSerializer(required=False)

    class Meta:
        model = models.Archive
        fields = ['created_by', 'closed_by', 'document']


class DepartmentTrailSerializer(serializers.ModelSerializer):
    sender_department = DepartmentSerializer()
    receiver_department = DepartmentSerializer()

    class Meta:
        model = models.DepartmentTrail
        fields = ['sender_department',
                  'receiver_department', 'document', 'trail']


class RequestDocumentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    requested_from = UserSerializer()
    document = DocumentsSerializer()

    class Meta:
        model = models.RequestDocument
        fields = ['id', 'requested_by', 'requested_from',
                  'document', 'active', 'created_at']


class ActivateDocumentSerializer(serializers.ModelSerializer):
    document = DocumentsSerializer()
    document_receiver = UserSerializer()
    document_sender = UserSerializer()

    class Meta:
        model = models.ActivateDocument
        fields = ['id', 'document', 'expire_at', 'document_receiver',
                  'document_sender', 'date_activated', 'expired']
