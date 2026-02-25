from django.db import models
from django.contrib.auth.models import User # Importando o modelo de usuário padrão do Django.
from datetime import timedelta 
from django.utils import timezone

class Task(models.Model): # models.Model indicia a classe base que sabe salvar algo no banco de dados. Sem isso é só python normal.
    STATUS_CHOICES = [
        ('todo', 'A Fazer'),
        ('doing', 'Fazendo'),
        ('done', 'Finalizado'),
        ('blocked', 'Bloqueado'),
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
    blocked_at = models.DateTimeField(null=True, blank=True) # Criando coluna para rastrear quando a task foi bloqueada.
    created_at = models.DateTimeField(auto_now_add=True) # Criando coluna de data e hora que o django automaticamente salva quando a task é criada.
    worked_hours = models.FloatField(null=True, blank=True, default=0.0) # Criando coluna de horas trabalhadas que armazena a hora em float.
    total_blocked_hours = models.FloatField(null=True, blank=True, default=0.0) # Criando coluna de horas bloqueadas que armazena a hora total em float.

    def calculate_worked_hours(self):
        if not self.start_time or not self.end_time: # tratativa de erros, para caso nao tenha hora, ele nao calcule
            return 0

        start = timezone.localtime(self.start_time) # criando variavel local para trabalhar com a hora de inicio da task.
        end = timezone.localtime(self.end_time) # criando variavel local para trabalhar com a hora de fim da task.

        total_seconds = 0 # variavel que acumulará o tempo útil em segundos
        current = start # variavel que vou iterar do inicio ao fim da task, verificando os dias úteis.

        while current < end: # loop que vai percorrer dia por dia
            next_day = (current + timedelta(days=1)).replace(  # pegando o proximo dia e zerando a hora para facilitar a comparacao
                hour=0, minute=0, second=0, microsecond=0
            )
            period_end = min(next_day, end) # definindo o fim do periodo como o proximo dia ou o fim da task, o que vier primeiro.

            if current.weekday() < 5:  # Verifica se é um dia útil (0-4 correspondem a segunda a sexta)
                day = current.date() # pegando a data do dia atual da iteracao
                work_start = current.replace(year=day.year, month=day.month, day=day.day, hour=9, minute=0, second=0, microsecond=0) # criando variavel para receber o inicio do periodo de trabalho
                work_end = current.replace(year=day.year, month=day.month, day=day.day, hour=18, minute=0, second=0, microsecond=0) # criando variavel para receber o fim do periodo de trabalho
                
                lunch_start = current.replace(year=day.year, month=day.month, day=day.day, hour=12, minute=0, second=0, microsecond=0) # criando variavel para receber o inicio do almoço
                lunch_end = current.replace(year=day.year, month=day.month, day=day.day, hour=13, minute=0, second=0, microsecond=0) # criando variavel para receber o fim do almoço

                maxStart = max(current, work_start) # definindo o inicio do periodo de trabalho como o maior valor entre a hora atual e o inicio do periodo de trabalho
                minEnd = min(period_end, work_end) # definindo o fim do periodo de trabalho como o menor valor entre o fim do periodo e o fim do periodo de trabalho

                if maxStart < minEnd:
                    worked_period = (minEnd - maxStart).total_seconds()
                    verify_start = max(maxStart, lunch_start) # verificando se o inicio do periodo de trabalho é maior que o inicio do almoço, se for, ele define o inicio do periodo util como o inicio do almoço, caso contrario ele continua com o inicio do periodo de trabalho.
                    verify_end = min(minEnd, lunch_end) # verificando se o fim do periodo de trabalho é menor que o fim do almoço, se for, ele define o fim do periodo util como o fim do almoço, caso contrario ele continua com o fim do periodo de trabalho.
                    if verify_start < verify_end: # se o periodo de trabalho util tiver intersecao com o periodo de almoço, ele subtrai o periodo de almoço do periodo de trabalho util.
                        worked_period -= (verify_end - verify_start).total_seconds()
                    total_seconds += worked_period # acumulando o periodo util em segundos no total de segundos.
            
            current = next_day # avançando para o próximo dia, repetindo o processo até chegar no fim da task.
        
        total_seconds -= (self.total_blocked_hours * 3600) if self.total_blocked_hours else 0 # subtraindo as horas bloqueadas do total de segundos. Se total_blocked_hours for None, ele subtrai 0.
        return max(total_seconds / 3600, 0) # retornando as horas trabalhadas em float (nunca menor que 0).

    def worked_hours_formated(self):
        FloatHours = self.calculate_worked_hours() # obtendo as horas trabalhadas que foram calculadas em float.

        hours = int(FloatHours) # convertendo as horas em inteiro.
        minutes = int((FloatHours - hours) * 60) # convertendo os minutos em inteiro.
        return f"{hours:02d}:{minutes:02d}" # retornando as horas em HH:MM formatados.

    def calculate_blocked_duration(self):
        if not self.blocked_at: # se nao houver data de bloqueio, retorna 0.
            return 0
        now = timezone.now() # pegando a hora atual para calcular o tempo bloqueado até agora.
        duration_seconds = (now - self.blocked_at).total_seconds() # calculando a duracao do bloqueio em segundos.
        return duration_seconds / 3600  # retornar em horas

    def blocked_hours_formated(self):
        FloatHours = self.calculate_blocked_duration() # obtendo as horas bloqueadas que foram calculadas em float.

        hours = int(FloatHours) # convertendo as horas em inteiro.
        minutes = int((FloatHours - hours) * 60) # convertendo os minutos em inteiro.
        return f"{hours:02d}:{minutes:02d}" # retornando as horas em HH:MM formatados.

    def __str__(self):
        return self.title # Retorna o titulo da task quando chamada. Caso contrario retornaria Task object (1) no admin por exemplo.
