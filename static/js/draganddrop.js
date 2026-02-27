let draggedCard = null;
let placeholder = null;

function initCards() {
    document.querySelectorAll('.card').forEach(card => {
        card.removeEventListener('dragstart', onDragStart);
        card.removeEventListener('dragend',   onDragEnd);
        card.addEventListener('dragstart', onDragStart);
        card.addEventListener('dragend',   onDragEnd);
    });
}

function onDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');

    placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';

    e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd() {
    this.classList.remove('dragging');
    draggedCard = null;
    removePlaceholder();
    document.querySelectorAll('.col.drag-over').forEach(c => c.classList.remove('drag-over'));
}

function removePlaceholder() {
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    placeholder = null;
}

document.querySelectorAll('.list').forEach(list => {

    list.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!draggedCard) return;

        const col = this.closest('.col');
        document.querySelectorAll('.col').forEach(c => c.classList.remove('drag-over'));
        if (col) col.classList.add('drag-over');

        const after = getDragAfterElement(this, e.clientY);
        if (placeholder) {
            after == null ? this.appendChild(placeholder) : this.insertBefore(placeholder, after);
        }
    });

    list.addEventListener('dragleave', function (e) {
        if (!this.contains(e.relatedTarget)) {
            const col = this.closest('.col');
            if (col) col.classList.remove('drag-over');
        }
    });

    list.addEventListener('drop', async function (e) {
        e.preventDefault();
        if (!draggedCard) return;

        const newStatus = this.dataset.status;
        const taskId    = draggedCard.dataset.id;
        const oldStatus = draggedCard.dataset.status;

        removePlaceholder();
        document.querySelectorAll('.col.drag-over').forEach(c => c.classList.remove('drag-over'));

        // Se o status não mudou, apenas reposicione o card visualmente e saia sem chamar o servidor
        if (newStatus === oldStatus) {
            draggedCard.classList.remove('dragging');
            draggedCard = null;
            return;
        }

        // Melhorando o UX: mover o card imediatamente e depois chamar o servidor, ao invés de esperar o fetch retornar
        const after = getDragAfterElement(this, e.clientY);
        after == null ? this.appendChild(draggedCard) : this.insertBefore(draggedCard, after);
        draggedCard.dataset.status = newStatus;
        draggedCard.classList.remove('dragging');
        draggedCard = null;

        try {
            const res = await updateTaskStatus(taskId, newStatus);
            if (res && res.success) {
                showToast('Status atualizado', 'success');
                setTimeout(() => location.reload(), 700);
            } else {
                showToast('Erro ao atualizar status', 'error');
                setTimeout(() => location.reload(), 900);
            }
        } catch (err) {
            console.error('Drag update failed:', err);
            showToast('Erro de conexão', 'error');
            setTimeout(() => location.reload(), 1200);
        }
    });
});

function getDragAfterElement(container, y) {
    const draggable = [...container.querySelectorAll('.card:not(.dragging)')];
    return draggable.reduce((closest, child) => {
        const box    = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

async function updateTaskStatus(taskId, newStatus) {
    const res = await fetch('/kanban/updateTaskStatus/' + taskId + '/', {
        method:  'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':  getCSRFToken(),
        },
        body: JSON.stringify({ status: newStatus }),
    });
    return res.json();
}

function getCSRFToken() {
    const el = document.querySelector('[name=csrfmiddlewaretoken]');
    return el ? el.value : '';
}

initCards();