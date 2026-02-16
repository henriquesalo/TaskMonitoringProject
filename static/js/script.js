function openCreateTask() {
    document.getElementById('createTaskModal').classList.add('show');
    document.getElementById('title').focus();
}
function closeCreateTask() {
    document.getElementById('createTaskModal').classList.remove('show');
}

function openUpdateTask(el) {
    const modal = document.getElementById('updateTaskModal');
    const form = document.getElementById('updateTaskForm');
    const title = document.getElementById('utitle');
    const description = document.getElementById('udescription');
    const status = document.getElementById('ustatus');
    const startInput = document.getElementById('ustart_time');
    const endInput = document.getElementById('uend_time');
    const deleteBtn = document.getElementById('deleteBtn');

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