from unicodedata import name
from django.urls import path

from . import views

urlpatterns = [
    path('auth/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('user/', views.UserAPIView.as_view(), name='user'),
    path('users/', views.UsersAPIView.as_view(), name='users'),
    path('departments/', views.DepartmentAPIView.as_view(), name='departments'),
    path('minute/', views.MinuteAPIView.as_view(), name='minute'),
    path('create-document/', views.CreateDocument.as_view(), name='create_document'),
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
    path('archive/<employee_id>/', views.ArchiveAPIView.as_view(),
         name='archive'),
    path('tracking/<document_id>/',
         views.TrackingAPIView.as_view(), name='tracking')
]
