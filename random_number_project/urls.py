# random_number_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('random_number.urls')),  # Include the random_number app's URLs
]
