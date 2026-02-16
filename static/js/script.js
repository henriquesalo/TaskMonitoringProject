function openCreateTask() {
    document.getElementById('createTaskModal').classList.add('show');
    document.getElementById('title').focus();
}
function closeCreateTask() {
    document.getElementById('createTaskModal').classList.remove('show');
}

function openUpdateTask(el) {
    var modal = document.getElementById('updateTaskModal');
    var form = document.getElementById('updateTaskForm');
    var title = document.getElementById('utitle');
    var description = document.getElementById('udescription');
    var status = document.getElementById('ustatus');
    var startInput = document.getElementById('ustart_time');
    var endInput = document.getElementById('uend_time');
    var deleteBtn = document.getElementById('deleteBtn');

    form.setAttribute('action', el.dataset.updateUrl);
    title.value = el.dataset.title || '';
    description.value = el.dataset.description || '';
    status.value = el.dataset.status || 'todo';

    // Preencher inputs datetime-local (YYYY-MM-DDTHH:MM)
    startInput.value = el.dataset.startTime || '';
    endInput.value = el.dataset.endTime || '';

    // Configura endpoint de exclusão para a task clicada
    deleteBtn.setAttribute('formaction', '/kanban/deleteTask/' + el.dataset.id + '/');
    deleteBtn.setAttribute('formmethod', 'post');

    modal.classList.add('show');
    title.focus();
}

function closeUpdateTask() {
    document.getElementById('updateTaskModal').classList.remove('show');
}