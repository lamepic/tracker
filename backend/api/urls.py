from django.urls import path

from . import views

urlpatterns = [
    path('user/', views.UserAPIView.as_view(), name='user'),
    path('departments/', views.DepartmentAPIView.as_view(), name='departments'),
]
