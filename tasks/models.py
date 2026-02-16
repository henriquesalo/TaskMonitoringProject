from django.db import models
from django.contrib.auth.models import User # Importando o modelo de usuário padrão do Django.

class Task(models.Model): # models.Model indicia a classe base que sabe salvar algo no banco de dados. Sem isso é só python normal.
    STATUS_CHOICES = [
        ('todo', 'A Fazer'),
        ('doing', 'Fazendo'),
        ('done', 'Finalizado'),
    ]

    title = models.CharField(max_length=200) # Criando coluna de titulo com maximo de 200 caracteres.and
    description = models.TextField(null=True, blank=True) # Criando coluna de descricao que armazena texto longo 
    user = models.ForeignKey(User, on_delete=models.CASCADE) # Criando relacao para indicar que a task pertence a um usuario. onDelete diz que caso o user seja deletado as tarefas dele tambem sejam.
    status = models.CharField( 
        # Criando coluna de status que limita o valor a um dos valores criados na variavel STATUS_CHOICES.
        max_length=10,
        choices=STATUS_CHOICES,
        default='todo'
    )
    email = models.EmailField(max_length=200, null=True) # Criando coluna de email com maximo de 200 caracteres.
    start_time = models.DateTimeField(null=True, blank=True) # Criando coluna de data e hora de inicio onde o banco e o formulario aceitam nulo/vazio.
    end_time = models.DateTimeField(null=True, blank=True) # mesmo conceito de start_time.
    created_at = models.DateTimeField(auto_now_add=True) # Criando coluna de data e hora que o django automaticamente salva quando a task é criada.

    def __str__(self):
        return self.title # Retorna o titulo da task quando chamada. Caso contrario retornaria Task object (1) no admin por exemplo.
