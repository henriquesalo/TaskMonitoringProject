let draggedCard = null;

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', function() {
        draggedCard = this;
    });
});

document.querySelectorAll('.list').forEach(list => {
    list.addEventListener('dragover', function(e) {
        e.preventDefault(); // o metodo preventDefault que permite o drop, sem isso o browser nao aceita.
    });
    list.addEventListener('drop', function() {
        const newStatus = this.dataset.status;
        const taskId = draggedCard.dataset.id;

        this.appendChild(draggedCard);
        updateTaskStatus(taskId, newStatus);
        location.reload();
    });
});

function updateTaskStatus(taskId, newStatus) {
    fetch('/kanban/updateTaskStatus/' + taskId + '/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
            status: newStatus,
        }),
    });
}

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}
