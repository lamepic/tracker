from unicodedata import name
from django.urls import path

from . import views

urlpatterns = [
    path('auth/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('user/', views.UserAPIView.as_view(), name='user'),
    path('users/', views.UsersAPIView.as_view(), name='users'),
    path('departments/', views.DepartmentAPIView.as_view(), name='departments'),
    path('minutes/<int:document_id>/',
         views.MinuteAPIView.as_view(), name='minute'),
    path('create-document/', views.CreateDocument.as_view(), name='create_document'),
    path('preview-code/<user_id>/<document_id>/',
         views.PreviewCodeAPIView.as_view(), name='preview_code'),
    path('document/<int:id>/', views.DocumentAPIView.as_view(), name='document'),
    path('mark-complete/<int:id>/',
         views.MarkCompleteAPIView.as_view(), name='mark_complete'),
    path('incoming-count/', views.IncomingCountAPIView.as_view(),
         name='incoming-count'),
    path('outgoing-count/', views.OutgoingCountAPIView.as_view(),
         name='outgoing-count'),
    path('incoming/', views.IncomingAPIView.as_view(),
         name='incoming'),
    path('outgoing/', views.OutgoingAPIView.as_view(),
         name='outgoing'),
    path('archive/', views.ArchiveAPIView.as_view(),
         name='archive'),
    path('archive/<user_id>/', views.ArchiveAPIView.as_view(),
         name='archive'),
    path('tracking/<document_id>/',
         views.TrackingAPIView.as_view(), name='tracking'),
    path('document-type/', views.DocumentTypeAPIView.as_view(), name='document_type'),
    path('document-action/<action_id>/',
         views.DocumentActionAPIView.as_view(), name='document-action'),
    path('forward-document/', views.ForwardDocumentAPIView.as_view(),
         name='forward-document'),
]
