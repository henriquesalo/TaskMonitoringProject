# 📋 Task Monitoring System — Kanban com Controle de Tempo

## 📌 Sobre o Projeto

Este projeto é um sistema web de gerenciamento de tarefas estilo **Kanban**, desenvolvido com **Python + Django**, que permite acompanhar atividades, registrar tempo de execução e gerar relatórios de produtividade.

O sistema foi criado para **resolver um problema real identificado no ambiente de trabalho**: a falta de controle sobre o tempo gasto em atividades operacionais e a dificuldade em gerar relatórios confiáveis de produtividade por usuário.

O projeto foi todo comentado linha por linha, devido a não utilização de IA no desenvolvimento, justamente por ser feito como forma de estudo para sanar um problema real.

A solução permite:

- organizar tarefas por status (Kanban)
- registrar horário de início e término das atividades
- calcular automaticamente horas trabalhadas
- controlar tarefas por usuário
- exportar relatórios em Excel
- monitorar produtividade individual

---

# 🎯 Problema Real Resolvido

No ambiente profissional existia dificuldade em:

- acompanhar tempo real gasto em tarefas
- registrar quando atividades iniciavam e terminavam
- gerar relatórios de horas trabalhadas
- medir produtividade da equipe
- exportar dados para análise gerencial

Este sistema foi desenvolvido como solução prática para esses desafios.

---

# 🚀 Funcionalidades

## 👤 Sistema de Usuários

- Cadastro de usuário
- Login e logout
- Isolamento de dados por usuário
- Controle de acesso com autenticação

---

## 📌 Kanban de Tarefas

- Criar tarefas
- Editar tarefas
- Excluir tarefas
- Organização por status:
  - A Fazer
  - Fazendo
  - Finalizado
- Drag and Drop entre colunas

---

## ⏱ Controle de Tempo

- Registro de horário de início da atividade
- Registro de horário de término da atividade
- Cálculo automático de horas trabalhadas
- Exibição formatada do tempo (`HH:MM`)

---

## 📊 Relatórios

- Exportação de tarefas para Excel
- Relatório contendo:
  - título
  - status
  - horário de início
  - horário de fim
  - horas trabalhadas

---

# 🛠 Tecnologias Utilizadas

- Python 3
- Django
- SQLite (banco padrão)
- HTML
- CSS
- JavaScript
- OpenPyXL (geração de Excel)

---

# 🧠 Conceitos Aplicados

Este projeto foi desenvolvido com foco em aprendizado e boas práticas de desenvolvimento:

- Arquitetura MVC (Model / View / Template)
- Autenticação e autorização de usuários
- CRUD completo
- Manipulação de datas e tempo
- Exportação de dados
- Drag and Drop
- Separação de responsabilidades
- Segurança com CSRF
- Decorators de autenticação
- Django ORM e QuerySets

---

# 📦 Instalação

## 1️⃣ Clonar repositório

```bash
git clone <repo-url>
cd project
```

---

## 2️⃣ Criar ambiente virtual

```bash
python -m venv venv
```

### Ativar ambiente virtual

#### Windows
```bash
venv\Scripts\activate
```

#### Mac/Linux
```bash
source venv/bin/activate
```

---

## 3️⃣ Instalar dependências

```bash
pip install django openpyxl
```

---

## 4️⃣ Rodar migrations

```bash
python manage.py migrate
```

---

## 5️⃣ Iniciar servidor

```bash
python manage.py runserver
```

Acesse:

```
http://127.0.0.1:8000
```

---

# 🧱 Estrutura do Projeto

```
project/
├── tasksMonitoring/
│   ├── settings.py
│   ├── urls.py
├── tasks/
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
├── static/
├── templates/
├── manage.py
```

---

# 🔐 Segurança

- Autenticação obrigatória para acesso ao sistema
- Isolamento de tarefas por usuário
- Proteção CSRF nos formulários

---

# 📈 Melhorias Futuras

- Sistema de times/equipes (em desenvolvimento)
- Dashboard de produtividade
- Relatórios por período
- Gráficos de desempenho
- Controle de tempo automático
- API REST
- Integração com ferramentas de BI

---

# 👨‍💻 Autor

Desenvolvido como projeto de aprendizado e solução prática para melhoria de processos operacionais no ambiente de trabalho.
