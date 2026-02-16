from django import forms # lib que tras validacao, renderizacao e projetcao/segurança
from .models import Task # importando o modelo de task para poder criar um formulario baseado nesse modelo.
from django.contrib.auth.forms import UserCreationForm # importando o formulario de criacao de usuario do django.
from django.contrib.auth.models import User # importando o modelo de usuario para poder criar um formulario baseado nesse modelo.

class TaskForm(forms.ModelForm): # criando um formulario baseado no modelo de tasks
    class Meta: # classe de confifuracao interna do django.
        model = Task # especificando o modelo que o formulario vai se basear. Nesse caso so temos esse modelo.
        fields = ['title','description','status','start_time','end_time'] # definindo agora quais campos ele vai poder acessar.

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data.get('email')
        if commit:
            user.save()
        return user
