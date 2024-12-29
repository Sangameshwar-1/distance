# random_number/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.generate_random_number, name='generate_random_number'),
]
