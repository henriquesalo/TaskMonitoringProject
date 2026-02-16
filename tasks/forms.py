from django import forms # lib que tras validacao, renderizacao e projetcao/segurança
from .models import Task # importando o modelo de task para poder criar um formulario baseado nesse modelo.

class TaskForm(forms.ModelForm): # criando um formulario baseado no modelo de tasks
    class Meta: # classe de confifuracao interna do django.
        model = Task # especificando o modelo que o formulario vai se basear. Nesse caso so temos esse modelo.
        fields = ['title','description','status','start_time','end_time'] # definindo agora quais campos ele vai poder acessar.
