from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages # importando messages para poder mostrar mensagens de erro no login/registro.
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required # decorators = funcao que envolve outra. Nesse caso se nao tiver logado bloqueia acesso.
from tasks.models import Task # importando o modelo de task para poder filtrar as tasks por usuario.
from tasks.forms import TaskForm, RegistrationForm # importando o form da task e o de registro.
from django.utils import timezone # importando timezone para poder usar no createTask e respeita o timezone do projeto.
from django.http import JsonResponse, HttpResponse # importando JsonResponse para poder retornar um json no updateTaskStatus e HttpResponse para poder enviar arquivos ao navegador.
from datetime import datetime 
from openpyxl import Workbook # importando o Workbook que representa um arquivo excel.
import json 

def userLogin(request):
    if request.method == 'POST':
        username = request.POST['username'] # pegando o username do formulario de login
        password = request.POST['password'] # pegando a senha do formulario de login
        user = authenticate(request, username=username, password=password) # autenticando o usuario com o username e senha
        if user is not None: # se o usuario for encontrado
            login(request, user) # loga o usuario no sistema
            return redirect('kanban') # redireciona para a pagina do kanban.
        else:
            messages.error(request, 'Erro ao fazer login. Usuário ou senha inválidos.') # caso haja um erro no login, mostra uma mensagem de erro.
    return render(request, 'users/login.html') # renderizando o template login.html
    
def userLogout(request):
    logout(request) # logout do usuario
    return redirect('/') # redireciona para a pagina de login.

def registro(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid(): # valida senha forte/ username unico e senhas iguais
            user = form.save() # salvando o form que e o proprio usuario no banco
            login(request, user) # faz com que se for valido ele ja logue automaticamente no sistema
            return redirect('kanban') # redireciona para a pagina do kanban.
        else:
            messages.error(request, 'Erro ao registrar usuário. Verifique se as senhas são iguais e se o nome de usuário é único.') # caso haja um erro no registro, mostra uma mensagem de erro.
    else:
        form = RegistrationForm()
    return render(request, 'users/registro.html', {'form': form}) # renderizando o template registro.html e passando o form como contexto.

@login_required
def kanban(request): # criando funcao kanban que envia uma requisicao com o usuario logado.
    tasks = Task.objects.filter(user=request.user) # Filtrando no banco para que cada usuario veja somente suas tasks.
    context = { # criando um dicionario HTML para filtrar as tasks por status
        'todo': tasks.filter(status='todo'),
        'doing': tasks.filter(status='doing'),
        'done': tasks.filter(status='done'),
    }
    return render(request, 'task/kanban.html', context) # carrega o template, injeta os dados, gera html e envia a resposta http.

def createTask(request):
    if request.method == 'POST': # se o metodo for post, cria uma task com os dados do formulario
        form = TaskForm(request.POST) # pegando os dados enviados e colocando na variavel form
        if form.is_valid(): # is.valid() faz o django verificar se os dados sao validos baseado no que foi definido na models.py
            task = form.save(commit=False) # .save() salva direto no banco, mas com o commit falso ele cria sem salvar, pois nesse caso falta atribuir o dono da task.
            task.user = request.user # aqui definimos quem criou a task. Sem isso a task seria criada sem dono.
            task.save() # apos definir o dono, salvamos de fato no banco.
            return redirect('kanban')
        else:
            form = TaskForm() # caso os dados sejam invalidos, cria um novo form vazio.
    return redirect('kanban') # redireciona para a pagina do kanban.

def updateTask(request, task_id): # funcao para conseguir editar uma tarefa
    task = get_object_or_404(Task, id=task_id, user=request.user) # pegando a task pelo id e restringindo para somente ao user que a criou.
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task) # se o metodo for post nao criar uma nova task mas sim atualizar essa existente
        if form.is_valid():
            form.save()
            return redirect('kanban') # redireciona para a pagina do kanban.
        else:
            form = TaskForm(instance=task) # caso os dados sejam invalidos, o form ja vem preenchido com os dados atuais.
    return redirect('kanban') # redireciona para a pagina do kanban.

def deleteTask(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    if request.method == 'POST':
        task.delete() # deletando a task do banco de dados.
    return redirect('kanban') # redireciona para a pagina do kanban.

def start_task(request, task_id): # a funcao recebe o usuario(request) e a task pelo id dela.
    task = Task.objects.get(id=task_id, user=request.user) # pegando a task pelo id e armazenando na variavel task e restringindo para somente ao user que a criou.
    task.start_time = timezone.now() # definindo o start time como a hora atual.
    task.save()
    return redirect('kanban') # redireciona para a pagina do kanban.

def finish_task(request, task_id):
    task = Task.objects.get(id=task_id, user=request.user)
    task.end_time = timezone.now() # definindo o end time como a hora atual.
    task.status = 'done' # definindo o status como done e movendo automaticamente para sua coluna.
    task.save()
    return redirect('kanban') # redireciona para a pagina do kanban.

@login_required
def updateTaskStatus(request, task_id):
    if request.method == 'POST':
        data = json.loads(request.body) # convertendo o corpo da req para python dict.
        newStatus = data.get('status') # pegando o status enviado.
        task = Task.objects.get(id=task_id, user=request.user) # pegando a task pelo id e restringindo para somente ao user que a criou.
        task.status = newStatus # atualizando o status da task.
        if newStatus == 'doing' and not task.start_time:
            task.start_time = timezone.now()
        if newStatus == 'done' and not task.end_time:
            task.end_time = timezone.now()
        task.save() # salvando a task com o novo status no banco.
        return JsonResponse({'success': True}) # retornando um json com sucesso.

@login_required
def exportTasksExcel(request):
    workbook = Workbook() # criando um novo arquivo excel vazio.
    worksheet = workbook.active # pegando a planilha ativa do arquivo excel.
    worksheet.title = 'Taferas do Usuário ' + request.user.username # definindo o nome da planilha.

    worksheet.append([
        "Título", "Descrição", "Status", "Data de Criação", "Data de Conclusão", "Horas Trabalhadas"
    ])

    tasks = Task.objects.filter(user=request.user) # Pegando apenas as tasks do usuario logado e salvando numa variavel.
    for task in tasks: # Para cada task do usuario logado, adiciona uma nova linha na planilha.
        
        hours = task.worked_hours_formated()
        
        worksheet.append([
            task.title,
            task.description,
            task.status,
            task.created_at.strftime("%d/%m/%Y %H:%M") if task.start_time else "", # se tiver start time, formata como dd/mm/yyyy HH:MM, senao, vazio.
            task.end_time.strftime("%d/%m/%Y %H:%M") if task.end_time else "", # se tiver end time, formata como dd/mm/yyyy HH:MM, senao, vazio.
            hours
        ])

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response['Content-Disposition'] = 'attachment; filename="tasks.xlsx"' # definindo o nome do arquivo excel que sera baixado.
    workbook.save(response) # salvando o arquivo excel na resposta http.
    return response # retornando a response http que é o arquivo excel para download.