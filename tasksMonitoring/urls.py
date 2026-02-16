from django.contrib import admin
from django.urls import path, include
from tasks import views

urlpatterns = [
    path('', include('tasks.urls')), # Arquitetura modular. Incluindo todas urls do app tasks.
    path('admin/', admin.site.urls),
]
