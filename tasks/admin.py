from django.contrib import admin
from .models import Task # importando o modelo Task para registrar no admin.

admin.site.register(Task) # registrando o modelo criado no admin.