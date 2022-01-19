from django.contrib import admin

from . import models


@admin.register(models.Department)
class DepartmentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'filename', 'created_by']

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
    list_display = ['sender', 'receiver', 'date', 'document', 'status']
    search_fields = (
        "document__subject",
    )
    list_filter = ('status',)


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
