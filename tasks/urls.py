from django.urls import path
from . import views

urlpatterns = [
    path('', views.userLogin, name='login'),
    path('registro/', views.registro, name='registro'),
    path('logout/', views.userLogout, name='logout'),
    path('kanban/', views.kanban, name='kanban'),
    path('kanban/createTask/', views.createTask, name='createTask'),
    path('kanban/updateTask/<int:task_id>/', views.updateTask, name='updateTask'),
    path('kanban/deleteTask/<int:task_id>/', views.deleteTask, name='deleteTask'),
    path('kanban/updateTaskStatus/<int:task_id>/', views.updateTaskStatus, name='updateTaskStatus'),
]