function getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Dados do Dashboard
const dashboardData = JSON.parse(document.getElementById('dashboard-data').textContent);

// Função para converter HH:MM para decimal
function parseHHMMToFloat(hhmm) {
    if (!hhmm || hhmm.trim() === '') return 0;
    const parts = hhmm.split(':');
    if (parts.length !== 2) return 0;
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    return hours + minutes / 60;
}

// Função para converter horas (float) para HH:MM
function hoursToHHMM(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

// Configurações base para gráficos
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: { 
            ticks: { color: '#8a9ab8' }, 
            grid: { color: 'rgba(30, 40, 56, 0.5)' } 
        },
        y: { 
            ticks: { color: '#8a9ab8' }, 
            grid: { color: 'rgba(30, 40, 56, 0.5)' } 
        }
    }
};

// Função para renderizar gráficos de linha
function renderLine(id, labels, values, color) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: values,
                borderColor: color,
                backgroundColor: color.replace('1)', '0.1)'),
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: color,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: baseOptions
    });
}

// Função para renderizar gráficos de barras
function renderBar(id, labels, values, color) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: color.replace('1)', '0.3)'),
                borderColor: color,
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: baseOptions
    });
}

// Função para renderizar gráficos de donut/pizza
function renderDoughnut(id, labels, values) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    
    const colors = [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(14, 165, 233, 1)',
        'rgba(251, 146, 60, 1)',
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#1e2838',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#8a9ab8',
                        usePointStyle: true,
                        padding: 15
                    }
                }
            }
        }
    });
}

// ===== VARIÁVEIS E FUNÇÕES DOS MODAIS (ESCOPO GLOBAL) =====
let currentDeliverableId = null;
let currentPlannedId = null;
let deliverablesData = [];
let plannedData = [];

function openDeliverableModal(id = null) {
    currentDeliverableId = id;
    const modal = document.getElementById('deliverable-modal');
    const deleteBtn = document.getElementById('del-delete-btn');
    document.getElementById('del-title').value = '';
    document.getElementById('del-description').value = '';
    document.getElementById('del-hours').value = '';
    document.getElementById('del-status').value = 'ongoing';
    document.getElementById('del-start').value = '';
    document.getElementById('del-end').value = '';
    deleteBtn.style.display = 'none';
    if (id) {
        const rec = deliverablesData.find(d => d.id === id);
        if (rec) {
            document.getElementById('del-title').value = rec.title;
            document.getElementById('del-description').value = rec.description || '';
            document.getElementById('del-hours').value = rec.hours_hhmm;
            document.getElementById('del-status').value = rec.status;
            document.getElementById('del-start').value = rec.start_date || '';
            document.getElementById('del-end').value = rec.end_date || '';
            deleteBtn.style.display = 'block';
        }
    }
    modal.classList.add('show');
}

function closeDeliverableModal() {
    document.getElementById('deliverable-modal').classList.remove('show');
}

function saveDeliverable() {
    const payload = {
        title: document.getElementById('del-title').value,
        description: document.getElementById('del-description').value,
        hours: parseHHMMToFloat(document.getElementById('del-hours').value),
        status: document.getElementById('del-status').value,
        start_date: document.getElementById('del-start').value || null,
        end_date: document.getElementById('del-end').value || null
    };
    let url = '/kanban/deliverables/';
    let method = 'POST';
    if (currentDeliverableId) { url = '/kanban/deliverable/' + currentDeliverableId + '/'; method = 'PUT'; }
    fetch(url, { method: method, headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() }, body: JSON.stringify(payload) })
        .then(r => r.json()).then(() => location.reload());
}

function deleteCurrentDeliverable() {
    if (!currentDeliverableId) return;
    fetch('/kanban/deliverable/' + currentDeliverableId + '/', { method: 'DELETE', headers: { 'X-CSRFToken': getCSRFToken() } })
        .then(() => location.reload());
}

function openPlannedModal(id = null) {
    currentPlannedId = id;
    const modal = document.getElementById('planned-modal');
    const deleteBtn = document.getElementById('plan-delete-btn');
    document.getElementById('plan-title').value = '';
    document.getElementById('plan-description').value = '';
    document.getElementById('plan-hours').value = '';
    document.getElementById('plan-priority').value = 'medium';
    document.getElementById('plan-due').value = '';
    deleteBtn.style.display = 'none';
    if (id) {
        const rec = plannedData.find(p => p.id === id);
        if (rec) {
            document.getElementById('plan-title').value = rec.title;
            document.getElementById('plan-description').value = rec.description || '';
            document.getElementById('plan-hours').value = rec.hours_hhmm;
            document.getElementById('plan-priority').value = rec.priority;
            document.getElementById('plan-due').value = rec.due_date || '';
            deleteBtn.style.display = 'block';
        }
    }
    modal.classList.add('show');
}

function closePlannedModal() {
    document.getElementById('planned-modal').classList.remove('show');
}

function savePlanned() {
    const payload = {
        title: document.getElementById('plan-title').value,
        description: document.getElementById('plan-description').value,
        hours: parseHHMMToFloat(document.getElementById('plan-hours').value),
        priority: document.getElementById('plan-priority').value,
        due_date: document.getElementById('plan-due').value || null
    };
    let url = '/kanban/planned/'; let method = 'POST';
    if (currentPlannedId) { url = '/kanban/planned/' + currentPlannedId + '/'; method = 'PUT'; }
    fetch(url, { method: method, headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() }, body: JSON.stringify(payload) })
        .then(r => r.json()).then(() => location.reload());
}

function deleteCurrentPlanned() {
    if (!currentPlannedId) return;
    fetch('/kanban/planned/' + currentPlannedId + '/', { method: 'DELETE', headers: { 'X-CSRFToken': getCSRFToken() } })
        .then(() => location.reload());
}

// Função para alternar abas
function switchTab(tabName, button) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById('tab-' + tabName).style.display = 'block';

    if (button) {
        button.classList.add('active');
    }

    setTimeout(() => {
        Chart.helpers.each(Chart.instances, instance => {
            instance.resize();
        });
    }, 100);
}

// Aguardar o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados dos modais
    deliverablesData = JSON.parse(document.getElementById('deliverables-data')?.textContent || '[]');
    plannedData = JSON.parse(document.getElementById('planned-data')?.textContent || '[]');
    
    // Carregar dados de perfis
    const profileData = JSON.parse(document.getElementById('profile-data')?.textContent || '{}');
    const teamActivitiesData = JSON.parse(document.getElementById('team-activities-data')?.textContent || '[]');

    // Renderizando gráfico de horas por perfil ou por atividade
    const profileOrActivity = profileData.activity || profileData.profile;
    if (profileOrActivity && profileOrActivity.labels && profileOrActivity.labels.length > 0) {
        renderDoughnut('hoursProfile', profileOrActivity.labels, profileOrActivity.values);
    }
    // Renderizando gráfico de dias da semana (últimos 14 dias)
    if (profileData.weekday && profileData.weekday.labels) {
        renderBar('hoursWeekday', profileData.weekday.labels, profileData.weekday.values, 'rgba(59, 130, 246, 1)');
    }

    // Renderizando gráficos existentes
    renderLine('hoursDaily', dashboardData.hours.daily.labels, dashboardData.hours.daily.values, 'rgba(59, 130, 246, 1)');
    renderLine('hoursWeekly', dashboardData.hours.weekly.labels, dashboardData.hours.weekly.values, 'rgba(59, 130, 246, 1)');
    renderLine('hoursMonthly', dashboardData.hours.monthly.labels, dashboardData.hours.monthly.values, 'rgba(59, 130, 246, 1)');

    renderBar('doneDaily', dashboardData.done.daily.labels, dashboardData.done.daily.values, 'rgba(34, 197, 94, 1)');
    renderBar('doneWeekly', dashboardData.done.weekly.labels, dashboardData.done.weekly.values, 'rgba(34, 197, 94, 1)');
    renderBar('doneMonthly', dashboardData.done.monthly.labels, dashboardData.done.monthly.values, 'rgba(34, 197, 94, 1)');

    // Preparar filtro por perfil
    const profileFilter = document.getElementById('profileFilter');
    if (profileFilter && profileData.profile && profileData.profile.labels) {
        profileData.profile.labels.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = p;
            profileFilter.appendChild(opt);
        });
    }

    // Função que renderiza a tabela de atividades levando em conta o filtro
    const teamTable = document.querySelector('#teamActivitiesTable tbody');
    function renderTeamTable() {
        if (!teamTable) return;
        teamTable.innerHTML = '';
        const selected = profileFilter ? profileFilter.value : '';

        let hasRows = false;
        if (teamActivitiesData && teamActivitiesData.length > 0) {
            teamActivitiesData.forEach(activity => {
                // se filtrado, ignore atividades sem o usuário selecionado
                const users = Object.keys(activity.by_user);
                if (selected && !users.includes(selected)) return;

                const row = document.createElement('tr');
                const filteredEntries = Object.entries(activity.by_user)
                    .filter(([user]) => !selected || user === selected);
                const userHours = filteredEntries
                    .map(([user, hours]) => `${user}: ${hoursToHHMM(hours)}`)
                    .join(', ');

                row.innerHTML = `
                    <td><strong>${activity.title}</strong></td>
                    <td>${hoursToHHMM(activity.total)}</td>
                    <td style="font-size: 12px; color: var(--text2);">${userHours}</td>
                `;
                teamTable.appendChild(row);
                hasRows = true;
            });
        }
        if (!hasRows) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3" class="empty-cell">Nenhuma atividade encontrada</td>';
            teamTable.appendChild(row);
        }
    }

    if (profileFilter) {
        profileFilter.addEventListener('change', renderTeamTable);
    }
    // inicializa tabela com ou sem filtro
    renderTeamTable();

    // The metrics table has been removed; details tab now uses team activities.
    // No additional initialization required here.
});
