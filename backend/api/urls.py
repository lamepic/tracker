from django.urls import path

from . import views

urlpatterns = [
    path('auth/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('user/', views.UserAPIView.as_view(), name='user'),
    path('departments/', views.DepartmentAPIView.as_view(), name='departments'),
]
