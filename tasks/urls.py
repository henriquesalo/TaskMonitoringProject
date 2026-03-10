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
    path('kanban/dashboard/', views.dashboard, name='dashboard'),
    path('kanban/admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('kanban/exportDashboard/', views.exportDashboardExcel, name='exportDashboardExcel'),
    path('kanban/exportTasks/', views.exportTasksExcel, name='exportTasksExcel'),
    # endpoints de admin
    path('kanban/deliverables/', views.deliverable_list, name='deliverable_list'),
    path('kanban/deliverable/<int:id>/', views.deliverable_detail, name='deliverable_detail'),
    path('kanban/planned/', views.planned_list, name='planned_list'),
    path('kanban/planned/<int:id>/', views.planned_detail, name='planned_detail'),
]
