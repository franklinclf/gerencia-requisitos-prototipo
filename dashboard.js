// ============================================================================
// ReqFlow - Melhorias e Correções v0.3
// Correção de bugs, implementação de funcionalidades faltantes
// e melhoria da experiência do usuário
// ============================================================================

// Extensão do state com mais dados e funcionalidades
const enhancedStateExtension = {
    comments: [],           // Comentários em requisitos
    teamMembers: [],        // Membros da equipe com status
    activityFeed: [],       // Feed de atividades em tempo real
    notifications: [],      // Notificações do sistema
    filters: {              // Filtros persistidos
        currentFilters: {}
    },
    projectStats: {},       // Estatísticas do projeto
    performanceMetrics: {}  // Métricas de performance
};

// ============================================================================
// MELHORIAS NA RENDERIZAÇÃO DO DASHBOARD
// ============================================================================

/**
 * Renderiza dashboard com análises avançadas e tempo real
 */
function renderDashboardEnhanced() {
    updateDashboardMetrics();
    renderChartsEnhanced();
    renderProjectHealth();
    renderTeamActivity();
    renderUpcomingMilestones();
}

/**
 * Gráficos melhorados com mais contexto
 */
function renderChartsEnhanced() {
    // Destruir gráficos anteriores
    if (window.chartTipos) { window.chartTipos.destroy(); window.chartTipos = null; }
    if (window.chartPrioridades) { window.chartPrioridades.destroy(); window.chartPrioridades = null; }
    if (window.chartStatus) { window.chartStatus.destroy(); window.chartStatus = null; }

    // Validar que Chart está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não carregado');
        return;
    }

    // Gráfico 1: Tipos com dados reais
    const tiposCtx = document.getElementById('chartTipos');
    if (tiposCtx && state.requisitos && state.requisitos.length > 0) {
        const tiposData = {
            'RF': state.requisitos.filter(r => r.tipo === 'RF').length,
            'RNF': state.requisitos.filter(r => r.tipo === 'RNF').length
        };

        try {
            window.chartTipos = new Chart(tiposCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Funcionais (RF)', 'Não-Funcionais (RNF)'],
                    datasets: [{
                        data: [tiposData.RF, tiposData.RNF],
                        backgroundColor: ['#3b82f6', '#8b5cf6'],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 15, font: { size: 12, weight: 'bold' } } },
                        tooltip: { callbacks: { label: function(c) { const t = c.dataset.data.reduce((a,b) => a+b, 0); const p = ((c.parsed/t)*100).toFixed(1); return `${c.label}: ${c.parsed} (${p}%)`; } } }
                    }
                }
            });
        } catch(e) { console.error('Erro gráfico tipos:', e); }
    }

    // Gráfico 2: Prioridades
    const prioridadesCtx = document.getElementById('chartPrioridades');
    if (prioridadesCtx && state.requisitos && state.requisitos.length > 0) {
        const prioridadesData = {
            'Alta': state.requisitos.filter(r => r.prioridade === 'Alta').length,
            'Média': state.requisitos.filter(r => r.prioridade === 'Média').length,
            'Baixa': state.requisitos.filter(r => r.prioridade === 'Baixa').length
        };

        try {
            window.chartPrioridades = new Chart(prioridadesCtx, {
                type: 'bar',
                data: {
                    labels: ['Alta', 'Média', 'Baixa'],
                    datasets: [{
                        label: 'Requisitos',
                        data: [prioridadesData.Alta, prioridadesData.Média, prioridadesData.Baixa],
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: function(c) { return `${c.parsed.x} requisitos`; } } }
                    },
                    scales: {
                        x: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } }
                    }
                }
            });
        } catch(e) { console.error('Erro gráfico prioridades:', e); }
    }

    // Gráfico 3: Status
    const statusCtx = document.getElementById('chartStatus');
    if (statusCtx && state.requisitos && state.requisitos.length > 0) {
        const statuses = ['Proposto', 'Aprovado', 'Em Desenvolvimento', 'Implementado', 'Validado'];
        const statusData = {};
        statuses.forEach(status => {
            statusData[status] = state.requisitos.filter(r => r.status === status).length;
        });

        try {
            window.chartStatus = new Chart(statusCtx, {
                type: 'line',
                data: {
                    labels: statuses,
                    datasets: [{
                        label: 'Requisitos',
                        data: Object.values(statusData),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { labels: { padding: 15, font: { size: 12, weight: 'bold' } } } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } }
                }
            });
        } catch(e) { console.error('Erro gráfico status:', e); }
    }
}

/**
 * Renderiza saúde do projeto com badges e indicadores
 */
function renderProjectHealth() {
    const healthContainer = document.getElementById('projectHealth');
    if (!healthContainer) return;

    const totalReqs = state.requisitos.length;
    const validados = state.requisitos.filter(r => r.status === 'Validado').length;
    const emDesenvolvimento = state.requisitos.filter(r => r.status === 'Em Desenvolvimento').length;
    const conDependencias = state.requisitos.filter(r => (r.dependencias || []).length > 0).length;

    const saudePercentual = totalReqs > 0 ? Math.round((validados / totalReqs) * 100) : 0;
    const risco = saudePercentual >= 80 ? '🟢 Baixo' : saudePercentual >= 50 ? '🟡 Médio' : '🔴 Alto';

    healthContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p class="text-sm text-blue-700 font-semibold">Saúde do Projeto</p>
                <p class="text-3xl font-bold text-blue-900 mt-2">${saudePercentual}%</p>
                <p class="text-xs text-blue-600 mt-1">${validados} de ${totalReqs} validados</p>
            </div>
            
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p class="text-sm text-green-700 font-semibold">Risco Geral</p>
                <p class="text-2xl font-bold text-green-900 mt-2">${risco}</p>
                <p class="text-xs text-green-600 mt-1">Baseado na cobertura</p>
            </div>
            
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <p class="text-sm text-orange-700 font-semibold">Em Andamento</p>
                <p class="text-3xl font-bold text-orange-900 mt-2">${emDesenvolvimento}</p>
                <p class="text-xs text-orange-600 mt-1">Requisitos em desenvolvimento</p>
            </div>
            
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p class="text-sm text-purple-700 font-semibold">Complexidade</p>
                <p class="text-3xl font-bold text-purple-900 mt-2">${conDependencias}</p>
                <p class="text-xs text-purple-600 mt-1">Com dependências</p>
            </div>
        </div>
    `;
}

/**
 * Renderiza atividades da equipe em tempo real
 */
function renderTeamActivity() {
    const activityContainer = document.getElementById('teamActivityFeed');
    if (!activityContainer) return;

    const recentActivity = state.auditoria.slice(-5).reverse();

    activityContainer.innerHTML = recentActivity.map(log => {
        const timeAgo = formatarDataRelativa(log.data);
        const icon = getActivityIcon(log.acao);
        const color = getActivityColor(log.acao);

        return `
            <div class="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                <div class="w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-bold text-sm">${icon}</span>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">${log.usuario}</p>
                    <p class="text-xs text-gray-600 mt-1">${log.acao} em <span class="font-medium">${log.entidade}</span></p>
                    <p class="text-xs text-gray-400 mt-1">${timeAgo}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Renderiza marcos próximos
 */
function renderUpcomingMilestones() {
    const milestonesContainer = document.getElementById('upcomingMilestones');
    if (!milestonesContainer) return;

    const milestones = (state.milestones || []).sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 3);

    milestonesContainer.innerHTML = milestones.map(milestone => {
        const dataMs = new Date(milestone.data);
        const agora = new Date();
        const diasRestantes = Math.ceil((dataMs - agora) / (1000 * 60 * 60 * 24));
        const atrasado = diasRestantes < 0;

        const statusColor = milestone.status === 'Concluído' ? 'bg-green-100' :
                           milestone.status === 'Em Progresso' ? 'bg-blue-100' : 'bg-gray-100';
        const statusBadgeColor = milestone.status === 'Concluído' ? 'bg-green-200 text-green-800' :
                                milestone.status === 'Em Progresso' ? 'bg-blue-200 text-blue-800' :
                                'bg-gray-200 text-gray-800';

        return `
            <div class="p-3 ${statusColor} rounded-lg border">
                <div class="flex items-center justify-between mb-2">
                    <p class="font-semibold text-gray-800 text-sm">${milestone.titulo}</p>
                    <span class="px-2 py-1 rounded text-xs font-medium ${statusBadgeColor}">
                        ${milestone.status}
                    </span>
                </div>
                <p class="text-xs text-gray-600 mb-2">${diasRestantes > 0 ? diasRestantes + ' dias' : 'Atrasado ' + Math.abs(diasRestantes) + ' dias'}</p>
                <div class="w-full bg-gray-300 rounded-full h-1.5">
                    <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${Math.min(100, Math.max(0, (milestone.requisitos?.length || 0) * 10))}%"></div>
                </div>
            </div>
        `;
    }).join('') || '<p class="text-sm text-gray-500">Nenhum marco próximo</p>';
}

// Helper functions
function getActivityIcon(acao) {
    if (acao.includes('Criado')) return '+';
    if (acao.includes('Editado') || acao.includes('Atualizado')) return '✎';
    if (acao.includes('Excluído')) return '✕';
    if (acao.includes('Movido')) return '→';
    return '•';
}

function getActivityColor(acao) {
    if (acao.includes('Criado')) return 'bg-green-500';
    if (acao.includes('Editado') || acao.includes('Atualizado')) return 'bg-blue-500';
    if (acao.includes('Excluído')) return 'bg-red-500';
    if (acao.includes('Movido')) return 'bg-yellow-500';
    return 'bg-gray-500';
}

console.log('✓ Melhorias de Dashboard carregadas');

