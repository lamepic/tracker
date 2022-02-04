from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model


from . import models

User = get_user_model()


@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'first_name',
                    'last_name', 'email',  'department']
    list_filter = ('is_department', 'department')


@admin.register(models.Department)
class DepartmentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'ref',
                    'filename', 'created_by', 'document_type']

    def filename(self, obj):
        return obj.content.name[10:]


@admin.register(models.RelatedDocument)
class RelatedDocumentAdmin(admin.ModelAdmin):
    list_display = ['subject', 'filename', 'document']

    def filename(self, obj):
        return obj.content.name[18:]

    def document(self, obj):
        return obj.document.name


@admin.register(models.Trail)
class TrailAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'date',
                    'document', 'document_type', 'status']
    search_fields = (
        "document__subject",
    )
    list_filter = ('status',)
    # actions = [mark_as_complete, ]

    def document_type(self, obj):
        return obj.document.document_type


@admin.register(models.Minute)
class MinuteAdmin(admin.ModelAdmin):
    list_display = ['content', 'created_by', 'date']


@admin.register(models.DepartmentTrail)
class DepartmentTrailAdmin(admin.ModelAdmin):
    list_display = ['sender_department', 'reciever_department', 'document']

    def sender_department(self, obj):
        return obj.sender_department.name

    def reciever_department(self, obj):
        return obj.receiver_department.name

    def document(self, obj):
        return obj.document.name


@admin.register(models.PreviewCode)
class PreviewCodeAdmin(admin.ModelAdmin):
    list_display = ['user', 'document', 'code', 'used', 'created_at']
    list_filter = ('used',)


@admin.register(models.RequestDocument)
class RequestDocumentAdmin(admin.ModelAdmin):
    list_display = ['requested_by', 'document', 'requested_from', 'created_at']


@admin.register(models.Archive)
class ArchiveAdmin(admin.ModelAdmin):
    list_display = ['created_by', 'closed_by',
                    'document', 'close_date', 'requested']
    search_fields = (
        "document__subject",
    )

    def document(self, obj):
        return obj.document.name


@admin.register(models.ActivateDocument)
class ActivateDocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'document', 'document_receiver',
                    'document_sender', 'expire_at', 'date_activated', 'expired']


@admin.register(models.DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'department']


@admin.register(models.DocumentAction)
class DocumentActionAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'document_type']


@admin.register(models.DocumentFlowPosition)
class DocumentFlowAdmin(admin.ModelAdmin):
    list_display = ['order']
