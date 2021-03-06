from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver

from django_celery_beat.models import PeriodicTask, CrontabSchedule
from django.db.models.signals import post_save
import json
import random


class User(AbstractUser):
    employee_id = models.CharField(max_length=7, unique=True)
    is_department = models.BooleanField(default=False)
    department = models.ForeignKey('Department', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Department(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.capitalize()
        super(Department, self).save(*args, **kwargs)


class DocumentAction(models.Model):
    ACTION_OPTIONS = (
        ('F', 'Forward'),
        ('CC', 'Carbon Copy')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=2, choices=ACTION_OPTIONS)
    document_type = models.ForeignKey(
        'DocumentType', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name} - {self.action}'


class DocumentType(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='flow_department', blank=True, null=True)

    def __str__(self):
        if self.department:
            return f'{self.name} [{self.department.name}]'
        return f'{self.name}'


class Document(models.Model):
    content = models.FileField(upload_to='documents/', blank=True, null=False)
    subject = models.CharField(max_length=100)
    ref = models.CharField(max_length=60, blank=True, null=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='document_creator')
    document_type = models.ForeignKey(
        DocumentType, on_delete=models.CASCADE, null=True, blank=True)
    encrypt = models.BooleanField(default=False)

    def __str__(self):
        return self.subject

    def save(self, *args, **kwargs):
        path = self.content.path
        self.doc_content_url = path
        super(Document, self).save(*args, **kwargs)


class RelatedDocument(models.Model):
    subject = models.CharField(max_length=100)
    content = models.FileField(upload_to='related_documents/')
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject

    def save(self, *args, **kwargs):
        self.document.related_document = True
        self.subject = self.subject.capitalize()

        super(RelatedDocument, self).save(*args, **kwargs)


class Minute(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-date',)

    def __str__(self):
        return self.content


class Trail(models.Model):
    STATUS_OPTIONS = (
        ('P', 'Pending'),
        ('C', 'Completed')
    )

    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='receiver')
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=1, choices=STATUS_OPTIONS, default='P')
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    meta_info = models.CharField(max_length=100, blank=True, null=True)
    send_id = models.CharField(max_length=50)
    forwarded = models.BooleanField(default=False)
    order = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ('-date', 'status')

    def __str__(self):
        return f'{self.sender} ==> {self.receiver}'


class DepartmentTrail(models.Model):
    sender_department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='sender_dpt')
    receiver_department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='receiver_dpt')
    trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.sender_department} ==> {self.receiver_department}'

    def save(self, *args, **kwargs):
        self.receiver_department = self.trail.receiver.department
        self.sender_department = self.trail.sender.department
        self.document = self.trail.document
        super(DepartmentTrail, self).save(*args, **kwargs)


class PreviewCode(models.Model):
    code = models.CharField(max_length=4)
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='document_code')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='employee_code')
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.document.subject} - {self.code}'

    class Meta:
        ordering = ('-created_at',)


class Archive(models.Model):
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_by_employee')
    closed_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='closed_by_employee')
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='archive_document')
    close_date = models.DateTimeField(auto_now_add=True)
    requested = models.BooleanField(default=False)

    def __str__(self):
        return self.document.subject


class RequestDocument(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='request_creator')
    requested_from = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='request_receiver')
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.document.subject}'


class ActivateDocument(models.Model):
    document_receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='activate_document_sender')
    document_sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='activate_document_receiver')
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    date_activated = models.DateTimeField(auto_now_add=True)
    expire_at = models.DateTimeField()
    expired = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.document.subject} - {self.expire_at}'


@receiver(post_save, sender=ActivateDocument)
def expire_date_handler(sender, instance, created, **kwargs):
    secret_id = random.randint(1, 9999)
    if created:
        schedule, created = CrontabSchedule.objects.get_or_create(
            minute=0, hour=0,
            day_of_month=instance.expire_at.day, month_of_year=instance.expire_at.month)

        task = PeriodicTask.objects.create(crontab=schedule, name='document_'+str(
            secret_id), task='api.tasks.expire_document', args=json.dumps((instance.id,)))
