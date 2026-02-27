import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tasksMonitoring.settings')
django.setup()

from django.db import connection
cursor = connection.cursor()
cursor.execute('DROP SCHEMA public CASCADE;')
cursor.execute('CREATE SCHEMA public;')
print('Schema resetado com sucesso!')