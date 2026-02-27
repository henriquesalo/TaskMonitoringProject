function openCreateTask() {
    const modal = document.getElementById('createTaskModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.getElementById('c-title').focus(), 50);
}

function closeCreateTask() {
    const modal = document.getElementById('createTaskModal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

function openUpdateTask(el) {
    const modal = document.getElementById('updateTaskModal');
    const form  = document.getElementById('updateTaskForm');

    form.setAttribute('action', el.dataset.updateUrl);
    document.getElementById('u-title').value       = el.dataset.title       || '';
    document.getElementById('u-description').value = el.dataset.description || '';
    document.getElementById('u-status').value      = el.dataset.status      || 'todo';
    document.getElementById('u-start').value       = el.dataset.startTime   || '';
    document.getElementById('u-end').value         = el.dataset.endTime     || '';

    modal.dataset.taskId = el.dataset.id;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.getElementById('u-title').focus(), 50);
}

function closeUpdateTask() {
    const modal = document.getElementById('updateTaskModal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

function confirmDelete() {
    const updateModal = document.getElementById('updateTaskModal');
    const taskId      = updateModal.dataset.taskId;
    const deleteForm  = document.getElementById('deleteForm');

    deleteForm.setAttribute('action', '/kanban/deleteTask/' + taskId + '/');

    closeUpdateTask();
    const deleteModal = document.getElementById('deleteConfirmModal');
    deleteModal.classList.add('show');
    deleteModal.setAttribute('aria-hidden', 'false');
}

function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
}

(function () {
    let pointerDownX = 0;
    let pointerDownY = 0;
    const DRAG_THRESHOLD = 5; // px

    document.addEventListener('pointerdown', function (e) {
        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
    });

    document.addEventListener('click', function (e) {
        // Se o mouse se moveu mais do que o threshold, consideramos que foi um drag, não um click
        const dx = Math.abs(e.clientX - pointerDownX);
        const dy = Math.abs(e.clientY - pointerDownY);
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) return;

        // Ignorar cliques em elementos com data-drag="true" para evitar conflito com drag and drop
        if (e.target.closest('[data-drag="true"]')) return;

        // Encontrar o card mais próximo do clique
        const card = e.target.closest('.card');
        if (!card) return;

        // Ignorar cliques dentro de modais para evitar abrir outro modal por cima
        if (e.target.closest('.modal')) return;

        openUpdateTask(card);
    });
})();


document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.getElementById('deleteConfirmModal').classList.contains('show')) {
        closeDeleteConfirm();
    } else if (document.getElementById('updateTaskModal').classList.contains('show')) {
        closeUpdateTask();
    } else if (document.getElementById('createTaskModal').classList.contains('show')) {
        closeCreateTask();
    }
});

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className   = 'toast' + (type ? ' toast-' + type : '');
    void toast.offsetWidth; // Reflow para reiniciar animação
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}