from django.db import models
from django.contrib.auth.models import User # Importando o modelo de usuário padrão do Django.
from datetime import timedelta 
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
    worked_hours = models.FloatField(null=True, blank=True, default=0.0) # Criando coluna de horas trabalhadas que armazena a hora em float.

    def worked_hours(self):
        """
        if self.start_time and self.end_time:
            duration = self.end_time - self.start_time
            return duration.total_seconds() / 3600 # retornando as horas trabalhadas em float.
        return 0
        """
        if not self.start_time or not self.end_time: # tratativa de erros, para caso nao tenha hora, ele nao calcule
            return 0

        start = self.start_time # criando variavel local para trabalhar com a hora de inicio da task.
        end = self.end_time # criando variavel local para trabalhar com a hora de fim da task.

        total_seconds = 0 # variavel que acumulará o tempo útil em segundos

        current = start # variavel que vou iterar do inicio ao fim da task, verificando os dias úteis.

        while current < end: # loop que vai percorrer dia por dia
            next_day = (current + timedelta(days=1)).replace(  # pegando o proximo dia e zerando a hora para facilitar a comparacao
                hour=0, 
                minute=0, 
                second=0, 
                microsecond=0
            )
            period_end = min(next_day, end) # definindo o fim do periodo como o proximo dia ou o fim da task, o que vier primeiro.

            if current.weekday() < 5:  # Verifica se é um dia útil (0-4 correspondem a segunda a sexta)
                total_seconds += (period_end - current).total_seconds() # calculando as horas daquele dia e salvando numa variavel.

            current = next_day # avançando para o próximo dia, repetindo o processo até chegar no fim da task.
        return total_seconds / 3600 # retornando as horas trabalhadas em float.

    def worked_hours_formated(self):
        FloatHours = self.worked_hours() # obtendo as horas trabalhadas que foram calculadas em float.

        hours = int(FloatHours) # convertendo as horas em inteiro.
        minutes = int((FloatHours - hours) * 60) # convertendo os minutos em inteiro.
        return f"{hours:02d}:{minutes:02d}" # retornando as horas em HH:MM formatados.

    def __str__(self):
        return self.title # Retorna o titulo da task quando chamada. Caso contrario retornaria Task object (1) no admin por exemplo.
