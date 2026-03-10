from django.contrib import admin
from .models import Task, Deliverable, PlannedActivity # importar novos modelos para admin

admin.site.register(Task) # registrando o modelo criado no admin.
admin.site.register(Deliverable)
admin.site.register(PlannedActivity)