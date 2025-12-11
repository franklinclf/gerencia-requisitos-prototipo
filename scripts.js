// ============================================================================
// ReqFlow - Sistema de Gerenciamento de Requisitos
// ============================================================================

// Estado Global da Aplicação
const state = {
    requisitos: [],
    tarefas: [],
    documentos: [],
    usuarios: [],
    auditoria: [],
    templates: [],
    currentSection: 'dashboard',
    currentUser: { id: 1, nome: 'Usuário Admin', papel: 'Gerente' }
};

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando ReqFlow...');
    
    // Carregar dados do localStorage ou inicializar com dados de exemplo
    loadFromStorage();
    
    if (state.requisitos.length === 0) {
        initializeSampleData();
    }
    
    // Configurar event listeners
    setupEventListeners();
    
    // Renderizar seção inicial
    renderDashboard();
    updateDashboardMetrics();
    
    console.log('ReqFlow inicializado com sucesso!');
}

function setupEventListeners() {
    // Busca global
    document.getElementById('globalSearch').addEventListener('input', handleGlobalSearch);
    
    // Formulário de requisito
    document.getElementById('formRequisito').addEventListener('submit', handleRequisitoSubmit);
    
    // Formulário de tarefa
    document.getElementById('formTarefa').addEventListener('submit', handleTarefaSubmit);
    
    // Formulário de documento
    document.getElementById('formDocumento').addEventListener('submit', handleDocumentoSubmit);
    
    // Filtros de requisitos
    document.getElementById('filtroTitulo').addEventListener('input', aplicarFiltros);
    document.getElementById('filtroTipo').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroPrioridade').addEventListener('change', aplicarFiltros);
}

// ============================================================================
// DADOS DE EXEMPLO
// ============================================================================

function initializeSampleData() {
    console.log('Inicializando dados do sistema...');

    // Usar dados do init-data.js se disponível
    if (typeof INITIAL_REQUIREMENTS !== 'undefined' && INITIAL_REQUIREMENTS.length > 0) {
        // Converter datas de string para Date objects
        state.requisitos = INITIAL_REQUIREMENTS.map(req => ({
            ...req,
            data: new Date(req.data || Date.now()),
            historico: (req.historico || []).map(h => ({
                ...h,
                data: new Date(h.data || Date.now())
            }))
        }));

        state.tarefas = INITIAL_TASKS || [];
        state.milestones = INITIAL_MILESTONES || [];
        state.discussoes = INITIAL_DISCUSSIONS || [];

        console.log('✓ Dados do entrega3.md carregados com sucesso');
        console.log(`  - ${state.requisitos.length} requisitos`);
        console.log(`  - ${state.tarefas.length} tarefas`);
        console.log(`  - ${state.milestones.length} marcos`);
    } else {
        // Fallback para dados de exemplo simplificados
        console.log('Iniciando com dados de exemplo padrão...');
        state.requisitos = [
            {
                id: 'RF001',
                titulo: 'Manter Requisitos (CRUD)',
                descricao: 'O sistema deve permitir criar, visualizar, editar e excluir requisitos.',
                tipo: 'RF',
                prioridade: 'Alta',
                status: 'Implementado',
                versao: 1,
                historico: [],
                dependencias: [],
                autor: 'Usuário Admin',
                data: new Date(),
                tags: ['gestão', 'básico']
            }
        ];
    }

    // Documentos padrão
    state.documentos = [
        {
            id: 1,
            titulo: 'Guia de Início Rápido',
            conteudo: `# Guia de Início Rápido - ReqFlow

## Bem-vindo ao ReqFlow!

Sistema de gerenciamento de requisitos integrado e colaborativo.

### Principais Funcionalidades

1. **Dashboard**: Métricas e progresso do projeto
2. **Requisitos**: CRUD com versionamento e rastreabilidade
3. **Kanban**: Gestão visual de tarefas
4. **Análise**: Gráficos e matrizes de dependências
5. **Documentação**: Wiki e repositório de documentos

### Como Começar

1. Acesse "Requisitos" para criar seus primeiros requisitos
2. Use "Kanban" para gerenciar tarefas
3. Exporte seus dados com "Exportar"

Mais informações em [GitHub](https://github.com)`,
            tipo: 'guia',
            data: new Date('2024-12-01'),
            autor: 'Usuário Admin',
            versao: 1
        },
        {
            id: 2,
            titulo: 'Especificação ReqFlow v0.2',
            conteudo: `# Especificação do Sistema ReqFlow

## Visão Geral

ReqFlow é uma ferramenta integrada para gerenciamento de requisitos em projetos de software.

## Módulos Principais

### 1. Gerenciamento de Requisitos
- CRUD completo (RF001)
- Versionamento (RF004)
- Validação automática (RF009)
- Templates (RF010)

### 2. Análise e Visualização
- Dashboard (RF007)
- Matriz de Rastreabilidade (RF011)
- Grafo de Dependências (RF008)

### 3. Colaboração
- Discussões (RF013)
- Documentação (RF018)
- Log de Auditoria (RF012)

### 4. Importação/Exportação
- Múltiplos formatos (RF006)
- Projeto completo serializado (JSON)

## Requisitos Técnicos

- HTML5 + CSS3 + JavaScript puro
- Tailwind CSS via CDN
- localStorage para persistência
- vis.js para grafos
- Chart.js para gráficos`,
            tipo: 'especificacao',
            data: new Date('2024-12-05'),
            autor: 'Usuário Admin',
            versao: 1
        }
    ];
    
    // Templates padrão
    state.templates = [
        {
            id: 1,
            nome: 'Requisito Funcional Padrão',
            descricao: 'Template para requisitos funcionais',
            tipo: 'RF',
            estrutura: '## Objetivo\n\n## Descrição\n\n## Critérios de Aceitação\n- Critério 1\n- Critério 2\n\n## Notas',
            campos: {
                titulo: '',
                descricao: 'O sistema deve...',
                prioridade: 'Média',
                status: 'Proposto',
                tipo: 'RF'
            }
        },
        {
            id: 2,
            nome: 'Caso de Uso',
            descricao: 'Template para documentar casos de uso',
            tipo: 'RF',
            estrutura: '## Ator Principal\n\n## Pré-condições\n\n## Fluxo Principal\n1. \n2. \n\n## Fluxos Alternativos\n\n## Pós-condições',
            campos: {
                titulo: '',
                descricao: '',
                prioridade: 'Média',
                status: 'Proposto'
            }
        },
        {
            id: 3,
            nome: 'Requisito Não-Funcional',
            descricao: 'Template para requisitos não-funcionais',
            tipo: 'RNF',
            estrutura: '## Atributo\n\n## Métrica\n\n## Restrição\n\n## Justificativa',
            campos: {
                titulo: '',
                descricao: 'O sistema deve garantir...',
                prioridade: 'Alta',
                status: 'Proposto',
                tipo: 'RNF'
            }
        }
    ];
    
    // Usuários do projeto
    state.usuarios = [
        { id: 1, nome: 'Usuário Admin', papel: 'Gerente de Requisitos', avatar: 'UA' },
        { id: 2, nome: 'João Silva', papel: 'Desenvolvedor', avatar: 'JS' },
        { id: 3, nome: 'Maria Santos', papel: 'Analista QA', avatar: 'MS' },
        { id: 4, nome: 'Pedro Costa', papel: 'Testador', avatar: 'PC' },
        { id: 5, nome: 'Ana Oliveira', papel: 'Arquiteta de Software', avatar: 'AO' }
    ];
    
    // Log de auditoria inicial
    addAuditLog('Sistema Inicializado', 'Sistema', `Sistema iniciado com ${state.requisitos.length} requisitos`);

    saveToStorage();

    console.log(`✓ Inicialização concluída: ${state.requisitos.length} requisitos carregados`);
}

// ============================================================================
// NAVEGAÇÃO
// ============================================================================

function navigateTo(section) {
    // Atualizar estado
    state.currentSection = section;
    
    // Atualizar navegação visual
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Esconder todas as seções
    document.querySelectorAll('.section-content').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    // Mostrar seção selecionada
    document.getElementById(`section-${section}`).classList.remove('hidden');
    
    // Renderizar conteúdo da seção
    switch(section) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'requisitos':
            renderRequisitos();
            break;
        case 'kanban':
            renderKanban();
            break;
        case 'matriz':
            renderMatriz();
            break;
        case 'dependencias':
            renderDependencias();
            break;
        case 'documentacao':
            renderDocumentacao();
            break;
        case 'auditoria':
            renderAuditoria();
            break;
        case 'configuracoes':
            renderConfiguracoes();
            break;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================================================
// DASHBOARD
// ============================================================================

function renderDashboard() {
    console.log('Renderizando Dashboard...');

    updateDashboardMetrics();

    // Aguardar um momento para garantir que o DOM está pronto
    setTimeout(() => {
        renderCharts();
    }, 100);

    // Renderizar outras seções se disponível
    if (typeof renderProjectHealth === 'function') renderProjectHealth();
    if (typeof renderTeamActivity === 'function') renderTeamActivity();
    if (typeof renderUpcomingMilestones === 'function') renderUpcomingMilestones();
}

function updateDashboardMetrics() {
    // Total de requisitos
    document.getElementById('totalRequisitos').textContent = state.requisitos.length;
    
    // Requisitos de alta prioridade
    const altaPrioridade = state.requisitos.filter(r => r.prioridade === 'Alta').length;
    document.getElementById('altaPrioridade').textContent = altaPrioridade;
    
    // Total de tarefas
    document.getElementById('totalTarefas').textContent = state.tarefas.length;
    
    // Cobertura de testes (simulada)
    const cobertura = Math.floor((state.requisitos.filter(r => r.status === 'Validado').length / state.requisitos.length) * 100);
    document.getElementById('coberturaTestes').textContent = cobertura + '%';
}

function renderCharts() {
    // Destruir gráficos anteriores se existirem
    if (window.chartTipos) {
        window.chartTipos.destroy();
    }
    if (window.chartPrioridades) {
        window.chartPrioridades.destroy();
    }

    // Gráfico de tipos
    const tiposCtx = document.getElementById('chartTipos');
    if (tiposCtx) {
        const tiposData = {
            'RF': state.requisitos.filter(r => r.tipo === 'RF').length,
            'RNF': state.requisitos.filter(r => r.tipo === 'RNF').length
        };
        
        window.chartTipos = new Chart(tiposCtx, {
            type: 'doughnut',
            data: {
                labels: ['Funcionais (RF)', 'Não-Funcionais (RNF)'],
                datasets: [{
                    data: [tiposData.RF, tiposData.RNF],
                    backgroundColor: ['#3b82f6', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de prioridades
    const prioridadesCtx = document.getElementById('chartPrioridades');
    if (prioridadesCtx) {
        const prioridadesData = {
            'Alta': state.requisitos.filter(r => r.prioridade === 'Alta').length,
            'Média': state.requisitos.filter(r => r.prioridade === 'Média').length,
            'Baixa': state.requisitos.filter(r => r.prioridade === 'Baixa').length
        };
        
        window.chartPrioridades = new Chart(prioridadesCtx, {
            type: 'bar',
            data: {
                labels: ['Alta', 'Média', 'Baixa'],
                datasets: [{
                    label: 'Requisitos',
                    data: [prioridadesData.Alta, prioridadesData.Média, prioridadesData.Baixa],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Requisitos: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    }
                }
            }
        });
    }
}

// ============================================================================
// REQUISITOS
// ============================================================================

function renderRequisitos() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const filtroTitulo = document.getElementById('filtroTitulo').value.toLowerCase();
    const filtroTipo = document.getElementById('filtroTipo').value;
    const filtroPrioridade = document.getElementById('filtroPrioridade').value;
    
    let requisitosFiltrados = state.requisitos.filter(req => {
        const matchTitulo = !filtroTitulo || req.titulo.toLowerCase().includes(filtroTitulo) || 
                           req.id.toLowerCase().includes(filtroTitulo);
        const matchTipo = !filtroTipo || req.tipo === filtroTipo;
        const matchPrioridade = !filtroPrioridade || req.prioridade === filtroPrioridade;
        
        return matchTitulo && matchTipo && matchPrioridade;
    });
    
    renderRequisitosList(requisitosFiltrados);
}

function renderRequisitosList(requisitos) {
    const container = document.getElementById('listaRequisitos');
    
    if (requisitos.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                <span class="iconify text-6xl text-gray-300 mb-4" data-icon="mdi:file-document-outline"></span>
                <p class="text-gray-500">Nenhum requisito encontrado</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = requisitos.map(req => `
        <div class="requisito-card bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="text-sm font-bold text-blue-600">${req.id}</span>
                        <span class="badge-${req.prioridade.toLowerCase().replace('é', 'e')} px-3 py-1 rounded-full text-xs font-medium">
                            ${req.prioridade}
                        </span>
                        <span class="text-xs text-gray-500 flex items-center gap-1">
                            <span class="status-dot status-${req.status.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}"></span>
                            ${req.status}
                        </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${req.titulo}</h3>
                    <p class="text-gray-600 text-sm mb-3">${req.descricao.substring(0, 150)}${req.descricao.length > 150 ? '...' : ''}</p>
                    
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                            <span class="iconify" data-icon="mdi:account"></span>
                            ${req.autor}
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="iconify" data-icon="mdi:calendar"></span>
                            ${formatDate(req.data)}
                        </span>
                        <span class="flex items-center gap-1">
                            <span class="iconify" data-icon="mdi:history"></span>
                            v${req.versao}
                        </span>
                        ${req.dependencias.length > 0 ? `
                        <span class="flex items-center gap-1">
                            <span class="iconify" data-icon="mdi:link-variant"></span>
                            ${req.dependencias.length} dependência(s)
                        </span>
                        ` : ''}
                    </div>
                    
                    ${req.tags && req.tags.length > 0 ? `
                    <div class="flex flex-wrap gap-2 mt-3">
                        ${req.tags.map(tag => `<span class="tag tag-blue">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <div class="flex items-center gap-2 ml-4">
                    <button onclick="editarRequisito('${req.id}')" 
                            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar">
                        <span class="iconify" data-icon="mdi:pencil"></span>
                    </button>
                    <button onclick="viewRequisitoHistory('${req.id}')" 
                            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Histórico">
                        <span class="iconify" data-icon="mdi:history"></span>
                    </button>
                    <button onclick="duplicarRequisito('${req.id}')" 
                            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Duplicar">
                        <span class="iconify" data-icon="mdi:content-copy"></span>
                    </button>
                    <button onclick="excluirRequisito('${req.id}')" 
                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir">
                        <span class="iconify" data-icon="mdi:delete"></span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showRequisitoModal(requisitoId = null) {
    const modal = document.getElementById('modalRequisito');
    const form = document.getElementById('formRequisito');
    const title = document.getElementById('modalRequisitoTitle');
    const justificativaContainer = document.getElementById('justificativaContainer');
    
    // Limpar formulário
    form.reset();
    document.getElementById('requisitoId').value = '';
    justificativaContainer.classList.add('hidden');
    
    if (requisitoId) {
        // Modo edição
        const req = state.requisitos.find(r => r.id === requisitoId);
        if (req) {
            title.textContent = 'Editar Requisito';
            document.getElementById('requisitoId').value = req.id;
            document.getElementById('requisitoIdCustom').value = req.id;
            document.getElementById('requisitoTitulo').value = req.titulo;
            document.getElementById('requisitoDescricao').value = req.descricao;
            document.getElementById('requisitoTipo').value = req.tipo;
            document.getElementById('requisitoPrioridade').value = req.prioridade;
            document.getElementById('requisitoStatus').value = req.status;
            document.getElementById('requisitoDependencias').value = req.dependencias.join(', ');
            document.getElementById('requisitoTags').value = req.tags ? req.tags.join(', ') : '';
            
            justificativaContainer.classList.remove('hidden');
            document.getElementById('requisitoJustificativa').required = true;
        }
    } else {
        // Modo criação
        title.textContent = 'Novo Requisito';
        
        // Sugerir próximo ID
        const ultimoRF = state.requisitos.filter(r => r.id.startsWith('RF')).length;
        const proximoId = 'RF' + String(ultimoRF + 1).padStart(3, '0');
        document.getElementById('requisitoIdCustom').value = proximoId;
    }
    
    modal.classList.remove('hidden');
}

function handleRequisitoSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('requisitoIdCustom').value.trim().toUpperCase();
    const existingId = document.getElementById('requisitoId').value;
    
    // Validar ID único
    if (!existingId && state.requisitos.some(r => r.id === id)) {
        showToast('ID já existe! Escolha outro.', 'error');
        return;
    }
    
    // Validar formato do ID
    if (!/^(RF|RNF)\d{3,}$/i.test(id)) {
        showToast('ID deve seguir o formato: RF001 ou RNF001', 'warning');
    }

    const dependencias = document.getElementById('requisitoDependencias').value
        .split(',')
        .map(d => d.trim())
        .filter(d => d);

    // Validar dependências existentes
    const depInvalidas = dependencias.filter(depId =>
        !state.requisitos.some(r => r.id === depId) && depId !== id
    );
    if (depInvalidas.length > 0) {
        showToast(`Dependências não encontradas: ${depInvalidas.join(', ')}`, 'error');
        return;
    }

    // Validar dependências circulares
    if (dependencias.includes(id)) {
        showToast('Um requisito não pode depender de si mesmo!', 'error');
        return;
    }

    // Verificar dependências circulares recursivamente
    function temDependenciaCircular(reqId, dependenciaId, visitados = new Set()) {
        if (visitados.has(dependenciaId)) return true;
        if (dependenciaId === reqId) return true;

        visitados.add(dependenciaId);

        const req = state.requisitos.find(r => r.id === dependenciaId);
        if (req && req.dependencias) {
            for (let dep of req.dependencias) {
                if (temDependenciaCircular(reqId, dep, new Set(visitados))) {
                    return true;
                }
            }
        }
        return false;
    }

    for (let dep of dependencias) {
        if (temDependenciaCircular(id, dep)) {
            showToast(`Dependência circular detectada com ${dep}!`, 'error');
            return;
        }
    }

    const requisito = {
        id: id,
        titulo: document.getElementById('requisitoTitulo').value.trim(),
        descricao: document.getElementById('requisitoDescricao').value.trim(),
        tipo: document.getElementById('requisitoTipo').value,
        prioridade: document.getElementById('requisitoPrioridade').value,
        status: document.getElementById('requisitoStatus').value,
        dependencias: dependencias,
        tags: document.getElementById('requisitoTags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
        autor: state.currentUser.nome,
        data: new Date()
    };
    
    if (existingId) {
        // Editar requisito existente
        const index = state.requisitos.findIndex(r => r.id === existingId);
        if (index !== -1) {
            const justificativa = document.getElementById('requisitoJustificativa').value.trim();
            if (!justificativa) {
                showToast('Justificativa obrigatória para alterações!', 'error');
                return;
            }
            
            const oldReq = state.requisitos[index];
            
            // Criar entrada no histórico
            if (!oldReq.historico) oldReq.historico = [];
            oldReq.historico.push({
                versao: oldReq.versao || 1,
                data: oldReq.data,
                autor: oldReq.autor,
                justificativa: justificativa,
                alteracoes: {
                    titulo: oldReq.titulo,
                    descricao: oldReq.descricao,
                    tipo: oldReq.tipo,
                    prioridade: oldReq.prioridade,
                    status: oldReq.status,
                    dependencias: oldReq.dependencias,
                    tags: oldReq.tags
                }
            });
            
            // Atualizar requisito
            requisito.versao = (oldReq.versao || 1) + 1;
            requisito.historico = oldReq.historico;
            state.requisitos[index] = requisito;
            
            addAuditLog('Requisito Editado', 'Requisito', `${requisito.id} - ${requisito.titulo}`, requisito.id);
            showToast('Requisito atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo requisito
        requisito.versao = 1;
        requisito.historico = [];
        state.requisitos.push(requisito);
        
        addAuditLog('Requisito Criado', 'Requisito', `${requisito.id} - ${requisito.titulo}`, requisito.id);
        showToast('Requisito criado com sucesso!', 'success');
    }
    
    // Validar dependências
    const validacao = validarDependencias(requisito.id);
    if (!validacao.valido) {
        showToast('Aviso: ' + validacao.erro, 'warning');
    }
    
    saveToStorage();
    closeModal('modalRequisito');
    renderRequisitos();
    updateDashboardMetrics();
}

function editarRequisito(id) {
    showRequisitoModal(id);
}

function duplicarRequisito(id) {
    const req = state.requisitos.find(r => r.id === id);
    if (!req) return;
    
    // Gerar novo ID
    const tipo = req.tipo;
    const ultimoNum = state.requisitos
        .filter(r => r.id.startsWith(tipo))
        .map(r => parseInt(r.id.substring(tipo.length)))
        .reduce((max, num) => Math.max(max, num), 0);
    const novoId = tipo + String(ultimoNum + 1).padStart(3, '0');
    
    const novoReq = {
        ...req,
        id: novoId,
        titulo: req.titulo + ' (Cópia)',
        versao: 1,
        historico: [],
        data: new Date(),
        autor: state.currentUser.nome
    };
    
    state.requisitos.push(novoReq);
    addAuditLog('Requisito Duplicado', 'Requisito', `${novoId} duplicado de ${id}`);
    
    saveToStorage();
    renderRequisitos();
    showToast('Requisito duplicado com sucesso!', 'success');
}

function excluirRequisito(id) {
    if (!confirm(`Tem certeza que deseja excluir o requisito ${id}?`)) return;
    
    const index = state.requisitos.findIndex(r => r.id === id);
    if (index !== -1) {
        const req = state.requisitos[index];
        state.requisitos.splice(index, 1);
        
        addAuditLog('Requisito Excluído', 'Requisito', `${id} - ${req.titulo}`);
        saveToStorage();
        renderRequisitos();
        updateDashboardMetrics();
        showToast('Requisito excluído com sucesso!', 'success');
    }
}

function viewRequisitoHistory(id) {
    const req = state.requisitos.find(r => r.id === id);
    if (!req || !req.historico || req.historico.length === 0) {
        showToast('Este requisito não possui histórico de versões.', 'info');
        return;
    }
    
    let html = `
        <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Histórico de Versões - ${req.id}</h3>
            <div class="space-y-4">
    `;
    
    // Versão atual
    html += `
        <div class="timeline-item bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-blue-600">Versão ${req.versao} (Atual)</span>
                <span class="text-sm text-gray-500">${formatDate(req.data)}</span>
            </div>
            <p class="text-sm text-gray-700"><strong>Por:</strong> ${req.autor}</p>
            <p class="text-sm text-gray-700 mt-2"><strong>Título:</strong> ${req.titulo}</p>
        </div>
    `;
    
    // Versões anteriores
    req.historico.slice().reverse().forEach(h => {
        html += `
            <div class="timeline-item bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-gray-700">Versão ${h.versao}</span>
                    <span class="text-sm text-gray-500">${formatDate(h.data)}</span>
                </div>
                <p class="text-sm text-gray-700"><strong>Por:</strong> ${h.autor}</p>
                <p class="text-sm text-gray-600 mt-2"><strong>Justificativa:</strong> ${h.justificativa}</p>
                <p class="text-sm text-gray-700 mt-1"><strong>Título:</strong> ${h.alteracoes.titulo}</p>
            </div>
        `;
    });
    
    html += `
            </div>
            <button onclick="closeHistoryPopup()" class="mt-6 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                Fechar
            </button>
        </div>
    `;
    
    // Criar popup
    const popup = document.createElement('div');
    popup.id = 'historyPopup';
    popup.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    popup.innerHTML = `<div class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">${html}</div>`;
    document.body.appendChild(popup);
}

function closeHistoryPopup() {
    const popup = document.getElementById('historyPopup');
    if (popup) popup.remove();
}

// ============================================================================
// KANBAN
// ============================================================================

function renderKanban() {
    const colunas = ['backlog', 'progresso', 'revisao', 'concluido'];
    
    colunas.forEach(coluna => {
        const tarefasColuna = state.tarefas.filter(t => t.coluna === coluna);
        const container = document.getElementById(`column${capitalize(coluna)}`);
        document.getElementById(`count${capitalize(coluna)}`).textContent = tarefasColuna.length;
        
        container.innerHTML = tarefasColuna.map(tarefa => `
            <div class="kanban-card" draggable="true" data-tarefa-id="${tarefa.id}">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-semibold text-gray-800 text-sm">${tarefa.titulo}</h4>
                    <span class="badge-${tarefa.prioridade.toLowerCase().replace('é', 'e')} px-2 py-1 rounded text-xs font-medium">
                        ${tarefa.prioridade}
                    </span>
                </div>
                ${tarefa.descricao ? `<p class="text-xs text-gray-600 mb-2">${tarefa.descricao}</p>` : ''}
                ${tarefa.responsavel ? `
                <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span class="iconify" data-icon="mdi:account"></span>
                    ${tarefa.responsavel}
                </div>
                ` : ''}
                ${tarefa.requisitosVinculados && tarefa.requisitosVinculados.length > 0 ? `
                <div class="flex flex-wrap gap-1 mt-2">
                    ${tarefa.requisitosVinculados.map(r => `<span class="tag-blue text-xs">${r}</span>`).join('')}
                </div>
                ` : ''}
                <div class="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-200">
                    <button onclick="editarTarefa(${tarefa.id})" class="text-gray-600 hover:text-blue-600">
                        <span class="iconify text-sm" data-icon="mdi:pencil"></span>
                    </button>
                    <button onclick="excluirTarefa(${tarefa.id})" class="text-gray-600 hover:text-red-600">
                        <span class="iconify text-sm" data-icon="mdi:delete"></span>
                    </button>
                </div>
            </div>
        `).join('');
    });
    
    setupKanbanDragDrop();
}

function setupKanbanDragDrop() {
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', e => {
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.dataset.tarefaId);
        });
        
        card.addEventListener('dragend', e => {
            card.classList.remove('dragging');
        });
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', e => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', e => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const tarefaId = parseInt(e.dataTransfer.getData('text/plain'));
            const novaColuna = column.dataset.column;
            
            const tarefa = state.tarefas.find(t => t.id === tarefaId);
            if (tarefa && tarefa.coluna !== novaColuna) {
                tarefa.coluna = novaColuna;
                
                addAuditLog('Tarefa Movida', 'Kanban', `Tarefa "${tarefa.titulo}" movida para ${novaColuna}`);
                saveToStorage();
                renderKanban();
                showToast('Tarefa movida com sucesso!', 'success');
            }
        });
    });
}

function showTarefaModal(coluna = 'backlog', tarefaId = null) {
    const modal = document.getElementById('modalTarefa');
    const form = document.getElementById('formTarefa');
    
    form.reset();
    document.getElementById('tarefaColuna').value = coluna;
    
    if (tarefaId) {
        const tarefa = state.tarefas.find(t => t.id === tarefaId);
        if (tarefa) {
            document.getElementById('tarefaTitulo').value = tarefa.titulo;
            document.getElementById('tarefaDescricao').value = tarefa.descricao || '';
            document.getElementById('tarefaPrioridade').value = tarefa.prioridade;
            document.getElementById('tarefaResponsavel').value = tarefa.responsavel || '';
            document.getElementById('tarefaRequisitos').value = tarefa.requisitosVinculados ? tarefa.requisitosVinculados.join(', ') : '';
        }
    }
    
    modal.classList.remove('hidden');
}

function handleTarefaSubmit(e) {
    e.preventDefault();
    
    const tarefa = {
        id: Date.now(),
        titulo: document.getElementById('tarefaTitulo').value.trim(),
        descricao: document.getElementById('tarefaDescricao').value.trim(),
        coluna: document.getElementById('tarefaColuna').value,
        prioridade: document.getElementById('tarefaPrioridade').value,
        responsavel: document.getElementById('tarefaResponsavel').value.trim(),
        data: new Date(),
        requisitosVinculados: document.getElementById('tarefaRequisitos').value
            .split(',')
            .map(r => r.trim())
            .filter(r => r)
    };
    
    state.tarefas.push(tarefa);
    
    addAuditLog('Tarefa Criada', 'Kanban', `${tarefa.titulo}`);
    saveToStorage();
    closeModal('modalTarefa');
    renderKanban();
    updateDashboardMetrics();
    showToast('Tarefa criada com sucesso!', 'success');
}

function editarTarefa(id) {
    const tarefa = state.tarefas.find(t => t.id === id);
    if (tarefa) {
        showTarefaModal(tarefa.coluna, id);
    }
}

function excluirTarefa(id) {
    if (!confirm('Deseja excluir esta tarefa?')) return;
    
    const index = state.tarefas.findIndex(t => t.id === id);
    if (index !== -1) {
        const tarefa = state.tarefas[index];
        state.tarefas.splice(index, 1);
        
        addAuditLog('Tarefa Excluída', 'Kanban', `${tarefa.titulo}`);
        saveToStorage();
        renderKanban();
        updateDashboardMetrics();
        showToast('Tarefa excluída com sucesso!', 'success');
    }
}

// ============================================================================
// MATRIZ DE RASTREABILIDADE
// ============================================================================

function renderMatriz() {
    // Usar versão avançada se disponível
    if (typeof renderMatrizAvancada === 'function') {
        renderMatrizAvancada();
    } else {
        // Fallback para versão simples
        const requisitos = state.requisitos;
        const testes = ['Teste Unitário', 'Teste Integração', 'Teste Sistema', 'Teste Aceitação'];

        let html = '<thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requisito</th>';

        testes.forEach(teste => {
            html += `<th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">${teste}</th>`;
        });

        html += '</tr></thead><tbody class="divide-y divide-gray-200">';

        requisitos.forEach(req => {
            html += `<tr><td class="px-4 py-3 font-medium text-sm text-gray-800">${req.id}<br><span class="text-xs text-gray-500">${req.titulo.substring(0, 40)}...</span></td>`;

            testes.forEach((teste, idx) => {
                const isLinked = req.prioridade === 'Alta' || (req.prioridade === 'Média' && idx < 2) || Math.random() > 0.7;
                html += `<td class="matriz-cell ${isLinked ? 'linked' : ''}" onclick="toggleMatrizCell(this, '${req.id}', '${teste}')">
                    ${isLinked ? '<span class="iconify text-green-600" data-icon="mdi:check-circle"></span>' : '-'}
                </td>`;
            });

            html += '</tr>';
        });

        html += '</tbody>';

        document.getElementById('matrizRastreabilidade').innerHTML = html;
    }
}

function toggleMatrizCell(cell, reqId, teste) {
    if (cell.classList.contains('linked')) {
        cell.classList.remove('linked');
        cell.innerHTML = '-';
        showToast(`Vínculo removido: ${reqId} ↔ ${teste}`, 'info');
    } else {
        cell.classList.add('linked');
        cell.innerHTML = '<span class="iconify text-green-600" data-icon="mdi:check-circle"></span>';
        showToast(`Vínculo criado: ${reqId} ↔ ${teste}`, 'success');
    }
    
    addAuditLog('Matriz Atualizada', 'Matriz', `${reqId} - ${teste}`);
}

// ============================================================================
// GRAFO DE DEPENDÊNCIAS
// ============================================================================

function renderDependencias() {
    // Usar versão avançada se disponível
    if (typeof renderDependenciasAvancadas === 'function') {
        renderDependenciasAvancadas();
    } else {
        // Fallback
        const container = document.getElementById('network');

        // Preparar dados para o grafo
        const nodes = state.requisitos.map(req => ({
            id: req.id,
            label: req.id,
            title: `${req.id}: ${req.titulo}`,
            color: req.prioridade === 'Alta' ? '#ef4444' :
                   req.prioridade === 'Média' ? '#f59e0b' : '#10b981',
            shape: 'box',
            font: { color: '#ffffff' }
        }));

        const edges = [];
        state.requisitos.forEach(req => {
            if (req.dependencias && req.dependencias.length > 0) {
                req.dependencias.forEach(depId => {
                    if (state.requisitos.some(r => r.id === depId)) {
                        edges.push({
                            from: depId,
                            to: req.id,
                            arrows: 'to',
                            color: { color: '#94a3b8' }
                        });
                    }
                });
            }
        });

        const data = { nodes, edges };

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 150,
                    nodeSpacing: 200
                }
            },
            physics: {
                enabled: false
            },
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true
            },
            edges: {
                smooth: {
                    type: 'cubicBezier',
                    forceDirection: 'vertical'
                }
            }
        };

        try {
            const network = new vis.Network(container, data, options);

            network.on('click', function(params) {
                if (params.nodes.length > 0) {
                    const reqId = params.nodes[0];
                    editarRequisito(reqId);
                }
            });
        } catch (error) {
            console.error('Erro ao renderizar grafo:', error);
            container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Erro ao carregar o grafo de dependências</div>';
        }
    }
}

// ============================================================================
// DOCUMENTAÇÃO
// ============================================================================

function renderDocumentacao() {
    renderDocumentosList();
}

function renderDocumentosList() {
    const container = document.getElementById('listaDocumentos');
    
    if (state.documentos.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500">Nenhum documento</p>';
        return;
    }
    
    container.innerHTML = state.documentos.map(doc => `
        <button onclick="viewDocumento(${doc.id})" 
                class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <div class="flex items-center gap-2">
                <span class="iconify text-blue-600" data-icon="mdi:file-document"></span>
                <span class="text-sm font-medium text-gray-800">${doc.titulo}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">${formatDate(doc.data)}</p>
        </button>
    `).join('');
}

function viewDocumento(id) {
    const doc = state.documentos.find(d => d.id === id);
    if (!doc) return;
    
    const viewer = document.getElementById('documentoViewer');
    const htmlContent = marked.parse(doc.conteudo);
    
    viewer.innerHTML = `
        <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-2xl font-bold text-gray-800">${doc.titulo}</h2>
            <div class="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span class="flex items-center gap-1">
                    <span class="iconify" data-icon="mdi:account"></span>
                    ${doc.autor}
                </span>
                <span class="flex items-center gap-1">
                    <span class="iconify" data-icon="mdi:calendar"></span>
                    ${formatDate(doc.data)}
                </span>
                <span class="flex items-center gap-1">
                    <span class="iconify" data-icon="mdi:history"></span>
                    Versão ${doc.versao}
                </span>
            </div>
            <div class="flex gap-2 mt-3">
                <button onclick="editarDocumento(${doc.id})" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Editar
                </button>
                <button onclick="excluirDocumento(${doc.id})" class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                    Excluir
                </button>
            </div>
        </div>
        <div class="markdown-content prose max-w-none">
            ${htmlContent}
        </div>
    `;
}

function showDocumentoModal(documentoId = null) {
    const modal = document.getElementById('modalDocumento');
    const form = document.getElementById('formDocumento');
    
    form.reset();
    
    if (documentoId) {
        const doc = state.documentos.find(d => d.id === documentoId);
        if (doc) {
            document.getElementById('documentoTitulo').value = doc.titulo;
            document.getElementById('documentoConteudo').value = doc.conteudo;
        }
    }
    
    modal.classList.remove('hidden');
}

function handleDocumentoSubmit(e) {
    e.preventDefault();
    
    const documento = {
        id: Date.now(),
        titulo: document.getElementById('documentoTitulo').value.trim(),
        conteudo: document.getElementById('documentoConteudo').value.trim(),
        tipo: 'manual',
        data: new Date(),
        autor: state.currentUser.nome,
        versao: 1
    };
    
    state.documentos.push(documento);
    
    addAuditLog('Documento Criado', 'Documentação', documento.titulo);
    saveToStorage();
    closeModal('modalDocumento');
    renderDocumentacao();
    showToast('Documento criado com sucesso!', 'success');
}

function editarDocumento(id) {
    showDocumentoModal(id);
}

function excluirDocumento(id) {
    if (!confirm('Deseja excluir este documento?')) return;
    
    const index = state.documentos.findIndex(d => d.id === id);
    if (index !== -1) {
        const doc = state.documentos[index];
        state.documentos.splice(index, 1);
        
        addAuditLog('Documento Excluído', 'Documentação', doc.titulo);
        saveToStorage();
        renderDocumentacao();
        document.getElementById('documentoViewer').innerHTML = `
            <div class="text-center text-gray-400 py-12">
                <span class="iconify text-6xl mb-4" data-icon="mdi:file-document-outline"></span>
                <p>Selecione um documento para visualizar</p>
            </div>
        `;
        showToast('Documento excluído com sucesso!', 'success');
    }
}

// ============================================================================
// AUDITORIA
// ============================================================================

function renderAuditoria() {
    const tbody = document.getElementById('auditoriaTableBody');
    
    if (state.auditoria.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Nenhum registro de auditoria</td></tr>';
        return;
    }
    
    tbody.innerHTML = state.auditoria.slice().reverse().map(log => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${formatDateTime(log.data)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${log.usuario}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAcaoBadgeColor(log.acao)}">
                    ${log.acao}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${log.entidade}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
                ${log.detalhes}
            </td>
        </tr>
    `).join('');
}

function addAuditLog(acao, entidade, detalhes, entidadeId = null) {
    const log = {
        id: Date.now(),
        data: new Date(),
        usuario: state.currentUser.nome,
        acao: acao,
        entidade: entidade,
        detalhes: detalhes,
        entidadeId: entidadeId
    };
    
    state.auditoria.push(log);
    saveToStorage();
}

function getAcaoBadgeColor(acao) {
    if (acao.includes('Criado') || acao.includes('Inicializado')) return 'bg-green-100 text-green-800';
    if (acao.includes('Editado') || acao.includes('Atualizado')) return 'bg-blue-100 text-blue-800';
    if (acao.includes('Excluído')) return 'bg-red-100 text-red-800';
    if (acao.includes('Movido')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
}

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

function renderConfiguracoes() {
    renderTemplatesList();
    renderUsuariosList();
}

function renderTemplatesList() {
    const container = document.getElementById('listaTemplates');
    
    if (state.templates.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500">Nenhum template cadastrado</p>';
        return;
    }
    
    container.innerHTML = state.templates.map(template => `
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-semibold text-gray-800">${template.nome}</h4>
                    <p class="text-xs text-gray-500 mt-1">Tipo: ${template.tipo}</p>
                </div>
                <button onclick="usarTemplate(${template.id})" 
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Usar
                </button>
            </div>
        </div>
    `).join('');
}

function renderUsuariosList() {
    const container = document.getElementById('listaUsuarios');
    
    container.innerHTML = state.usuarios.map(usuario => `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                ${usuario.avatar}
            </div>
            <div class="flex-1">
                <p class="font-medium text-gray-800">${usuario.nome}</p>
                <p class="text-xs text-gray-500">${usuario.papel}</p>
            </div>
        </div>
    `).join('');
}

function showTemplateModal() {
    showToast('Funcionalidade de criação de template em desenvolvimento', 'info');
}

function usarTemplate(id) {
    const template = state.templates.find(t => t.id === id);
    if (!template) return;
    
    showRequisitoModal();
    
    // Preencher formulário com dados do template
    setTimeout(() => {
        document.getElementById('requisitoTipo').value = template.tipo;
        if (template.campos.descricao) {
            document.getElementById('requisitoDescricao').value = template.campos.descricao;
        }
        if (template.campos.prioridade) {
            document.getElementById('requisitoPrioridade').value = template.campos.prioridade;
        }
        if (template.campos.status) {
            document.getElementById('requisitoStatus').value = template.campos.status;
        }
        if (template.campos.tags) {
            document.getElementById('requisitoTags').value = template.campos.tags.join(', ');
        }
    }, 100);
    
    showToast(`Template "${template.nome}" aplicado`, 'success');
}

// ============================================================================
// EXPORTAÇÃO
// ============================================================================

function showExportModal() {
    document.getElementById('modalExportar').classList.remove('hidden');
}

function exportarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(20);
        doc.text('ReqFlow - Relatório de Requisitos', 20, 20);
        
        doc.setFontSize(10);
        doc.text(`Gerado em: ${formatDateTime(new Date())}`, 20, 30);
        
        let y = 45;
        
        state.requisitos.forEach((req, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${req.id} - ${req.titulo}`, 20, y);
            
            y += 7;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Tipo: ${req.tipo} | Prioridade: ${req.prioridade} | Status: ${req.status}`, 20, y);
            
            y += 7;
            const descricaoLines = doc.splitTextToSize(req.descricao, 170);
            doc.text(descricaoLines, 20, y);
            
            y += (descricaoLines.length * 5) + 10;
        });
        
        doc.save('requisitos_' + Date.now() + '.pdf');
        
        closeModal('modalExportar');
        showToast('PDF exportado com sucesso!', 'success');
        addAuditLog('Exportação PDF', 'Sistema', 'Requisitos exportados para PDF');
    } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        showToast('Erro ao exportar PDF', 'error');
    }
}

function exportarExcel() {
    try {
        const dados = state.requisitos.map(req => ({
            'ID': req.id,
            'Título': req.titulo,
            'Descrição': req.descricao,
            'Tipo': req.tipo,
            'Prioridade': req.prioridade,
            'Status': req.status,
            'Autor': req.autor,
            'Data': formatDate(req.data),
            'Versão': req.versao,
            'Dependências': req.dependencias.join(', '),
            'Tags': req.tags ? req.tags.join(', ') : ''
        }));
        
        const ws = XLSX.utils.json_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Requisitos');
        
        XLSX.writeFile(wb, 'requisitos_' + Date.now() + '.xlsx');
        
        closeModal('modalExportar');
        showToast('Excel exportado com sucesso!', 'success');
        addAuditLog('Exportação Excel', 'Sistema', 'Requisitos exportados para Excel');
    } catch (error) {
        console.error('Erro ao exportar Excel:', error);
        showToast('Erro ao exportar Excel', 'error');
    }
}

function exportarCSV() {
    try {
        let csv = 'ID,Título,Descrição,Tipo,Prioridade,Status,Autor,Data,Versão,Dependências,Tags\n';
        
        state.requisitos.forEach(req => {
            csv += `"${req.id}","${req.titulo}","${req.descricao.replace(/"/g, '""')}","${req.tipo}","${req.prioridade}","${req.status}","${req.autor}","${formatDate(req.data)}","${req.versao}","${req.dependencias.join(', ')}","${req.tags ? req.tags.join(', ') : ''}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'requisitos_' + Date.now() + '.csv';
        link.click();
        
        closeModal('modalExportar');
        showToast('CSV exportado com sucesso!', 'success');
        addAuditLog('Exportação CSV', 'Sistema', 'Requisitos exportados para CSV');
    } catch (error) {
        console.error('Erro ao exportar CSV:', error);
        showToast('Erro ao exportar CSV', 'error');
    }
}

function exportarJSON() {
    try {
        // Exportação apenas de requisitos para compatibilidade
        const dados = {
            requisitos: state.requisitos,
            tarefas: state.tarefas,
            documentos: state.documentos,
            auditoria: state.auditoria,
            exportadoEm: new Date()
        };

        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'requisitos_' + Date.now() + '.json';
        link.click();

        closeModal('modalExportar');
        showToast('Requisitos exportados em JSON!', 'success');
        addAuditLog('Exportação JSON', 'Sistema', 'Requisitos exportados em JSON');
    } catch (error) {
        console.error('Erro ao exportar JSON:', error);
        showToast('Erro ao exportar JSON: ' + error.message, 'error');
    }
}

function exportarProjetoCompleto() {
    try {
        const dados = {
            projeto: {
                nome: 'ReqFlow Project',
                versao: '1.0',
                dataExportacao: new Date().toISOString(),
                descricao: 'Projeto completo de gerenciamento de requisitos'
            },
            requisitos: state.requisitos,
            tarefas: state.tarefas,
            documentos: state.documentos,
            templates: state.templates || [],
            usuarios: state.usuarios || [],
            milestones: state.milestones || [],
            discussoes: state.discussoes || [],
            atividades: state.atividades || [],
            notificacoes: state.notificacoes || [],
            auditoria: state.auditoria,
            configuracoes: {
                currentUser: state.currentUser,
                currentSection: state.currentSection
            }
        };
        
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reqflow_projeto_completo_' + Date.now() + '.json';
        link.click();
        
        closeModal('modalExportar');
        showToast('Projeto completo exportado com sucesso!', 'success');
        addAuditLog('Exportação Projeto Completo', 'Sistema', 'Todos os dados do projeto exportados');
    } catch (error) {
        console.error('Erro ao exportar projeto:', error);
        showToast('Erro ao exportar projeto: ' + error.message, 'error');
    }
}

// ============================================================================
// IMPORTAÇÃO
// ============================================================================

function showImportModal() {
    document.getElementById('modalImportar').classList.remove('hidden');
    document.getElementById('importPreview').classList.add('hidden');
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('fileName').textContent = file.name;
    document.getElementById('importPreview').classList.remove('hidden');

    // Armazenar o arquivo para processamento
    window.selectedFile = file;
}

function processImport() {
    const file = window.selectedFile;
    if (!file) {
        showToast('Nenhum arquivo selecionado', 'warning');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const extension = file.name.split('.').pop().toLowerCase();
            let importados = 0;

            if (extension === 'json') {
                const data = JSON.parse(e.target.result);

                // Verificar se é um projeto completo
                if (data.projeto && data.projeto.nome) {
                    // Desserialização completa do projeto
                    if (confirm(`Deseja importar o projeto completo "${data.projeto.nome}"?\n\nIsso irá SUBSTITUIR todos os dados atuais!`)) {
                        // Restaurar todos os dados
                        if (data.requisitos) {
                            state.requisitos = data.requisitos.map(req => ({
                                ...req,
                                data: new Date(req.data)
                            }));
                        }

                        if (data.tarefas) state.tarefas = data.tarefas;
                        if (data.documentos) state.documentos = data.documentos;
                        if (data.templates) state.templates = data.templates;
                        if (data.usuarios) state.usuarios = data.usuarios;
                        if (data.milestones) state.milestones = data.milestones;
                        if (data.discussoes) state.discussoes = data.discussoes;
                        if (data.atividades) state.atividades = data.atividades;
                        if (data.notificacoes) state.notificacoes = data.notificacoes;
                        if (data.auditoria) state.auditoria = data.auditoria;

                        if (data.configuracoes) {
                            state.currentUser = data.configuracoes.currentUser || state.currentUser;
                        }

                        showToast(`Projeto "${data.projeto.nome}" importado com sucesso!`, 'success');
                        importados = state.requisitos.length;
                    } else {
                        return;
                    }
                } else if (data.requisitos) {
                    // Importação apenas de requisitos
                    data.requisitos.forEach(req => {
                        const reqConvertido = {
                            ...req,
                            data: new Date(req.data || Date.now())
                        };
                        state.requisitos.push(reqConvertido);
                    });
                    importados = data.requisitos.length;
                    showToast(`${importados} requisitos importados!`, 'success');
                }

            } else if (extension === 'csv') {
                const lines = e.target.result.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;

                    // Parser CSV melhorado para lidar com vírgulas dentro de aspas
                    const values = [];
                    let current = '';
                    let insideQuotes = false;

                    for (let char of lines[i]) {
                        if (char === '"') {
                            insideQuotes = !insideQuotes;
                        } else if (char === ',' && !insideQuotes) {
                            values.push(current.trim().replace(/^"|"$/g, ''));
                            current = '';
                        } else {
                            current += char;
                        }
                    }
                    values.push(current.trim().replace(/^"|"$/g, ''));

                    const req = {
                        id: values[0] || `REQ${Date.now()}_${i}`,
                        titulo: values[1] || 'Sem título',
                        descricao: values[2] || '',
                        tipo: values[3] || 'RF',
                        prioridade: values[4] || 'Média',
                        status: values[5] || 'Proposto',
                        autor: values[6] || state.currentUser.nome,
                        data: new Date(),
                        versao: parseInt(values[8]) || 1,
                        dependencias: values[9] ? values[9].split(',').map(d => d.trim()) : [],
                        tags: values[10] ? values[10].split(',').map(t => t.trim()) : [],
                        historico: []
                    };

                    // Verificar se ID já existe
                    if (!state.requisitos.find(r => r.id === req.id)) {
                        state.requisitos.push(req);
                        importados++;
                    }
                }

                showToast(`${importados} requisitos importados do CSV!`, 'success');

            } else if (extension === 'xlsx' || extension === 'xls') {
                // Usar SheetJS para processar Excel
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(firstSheet);

                data.forEach(row => {
                    const req = {
                        id: row.ID || row.id || `REQ${Date.now()}_${importados}`,
                        titulo: row.Título || row.titulo || row.Title || 'Sem título',
                        descricao: row.Descrição || row.descricao || row.Description || '',
                        tipo: row.Tipo || row.tipo || row.Type || 'RF',
                        prioridade: row.Prioridade || row.prioridade || row.Priority || 'Média',
                        status: row.Status || row.status || 'Proposto',
                        autor: row.Autor || row.autor || row.Author || state.currentUser.nome,
                        data: new Date(),
                        versao: parseInt(row.Versão || row.versao || row.Version) || 1,
                        dependencias: row.Dependências || row.dependencias || row.Dependencies ?
                            String(row.Dependências || row.dependencias || row.Dependencies).split(',').map(d => d.trim()) : [],
                        tags: row.Tags || row.tags ?
                            String(row.Tags || row.tags).split(',').map(t => t.trim()) : [],
                        historico: []
                    };

                    // Verificar se ID já existe
                    if (!state.requisitos.find(r => r.id === req.id)) {
                        state.requisitos.push(req);
                        importados++;
                    }
                });

                showToast(`${importados} requisitos importados do Excel!`, 'success');
            }

            if (importados > 0) {
                saveToStorage();
                addAuditLog('Importação', 'Sistema', `${importados} items importados de ${file.name}`);
                closeModal('modalImportar');

                // Atualizar visualização se estiver na seção de requisitos
                if (state.currentSection === 'requisitos') {
                    renderRequisitos();
                } else if (state.currentSection === 'dashboard') {
                    updateDashboardMetrics();
                    renderCharts();
                }
            }

        } catch (error) {
            console.error('Erro ao importar:', error);
            showToast('Erro ao importar arquivo: ' + error.message, 'error');
        }
    };

    reader.onerror = function() {
        showToast('Erro ao ler arquivo', 'error');
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
}

// ============================================================================
// COLABORAÇÃO
// ============================================================================

function renderColaboracao() {
    // Inicializar dados de colaboração se não existirem
    if (!state.discussoes) {
        state.discussoes = [
            {
                id: 1,
                titulo: 'Revisão de Prioridades',
                autor: 'Usuário Admin',
                mensagem: 'Precisamos revisar as prioridades dos requisitos de alta complexidade.',
                requisito: 'RF001',
                respostas: [
                    { autor: 'Maria Santos', mensagem: 'Concordo, podemos agendar uma reunião?', data: new Date() }
                ],
                data: new Date(Date.now() - 3600000),
                lida: false
            },
            {
                id: 2,
                titulo: 'Dúvida sobre RF008',
                autor: 'João Silva',
                mensagem: 'Alguém pode esclarecer os critérios de aceitação do RF008?',
                requisito: 'RF008',
                respostas: [],
                data: new Date(Date.now() - 7200000),
                lida: true
            }
        ];
    }

    if (!state.atividades) {
        state.atividades = [
            {
                tipo: 'create',
                usuario: 'Usuário Admin',
                acao: 'criou o requisito',
                entidade: 'RF001',
                data: new Date(Date.now() - 3600000)
            },
            {
                tipo: 'update',
                usuario: 'Maria Santos',
                acao: 'atualizou o status de',
                entidade: 'RF005',
                data: new Date(Date.now() - 7200000)
            },
            {
                tipo: 'create',
                usuario: 'João Silva',
                acao: 'adicionou comentário em',
                entidade: 'RF008',
                data: new Date(Date.now() - 10800000)
            }
        ];
    }

    // Render Feed de Atividades
    renderFeedAtividades();

    // Render Discussões
    renderDiscussoes();

    // Render Equipe Online
    renderEquipeOnline();
}

function renderFeedAtividades() {
    const container = document.getElementById('feedAtividades');
    if (!container) return;

    if (!state.atividades || state.atividades.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">Nenhuma atividade recente</p>';
        return;
    }

    container.innerHTML = state.atividades.slice(0, 20).map(ativ => `
        <div class="activity-item ${ativ.tipo} bg-white rounded-lg p-4">
            <div class="flex items-start gap-3">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(ativ.usuario)}&background=3b82f6&color=fff"
                     class="w-10 h-10 rounded-full">
                <div class="flex-1">
                    <p class="text-sm">
                        <span class="font-semibold text-gray-800">${ativ.usuario}</span>
                        <span class="text-gray-600"> ${ativ.acao} </span>
                        <span class="font-semibold text-blue-600">${ativ.entidade}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">${formatarDataRelativa(ativ.data)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDiscussoes() {
    const container = document.getElementById('listaDiscussoes');
    if (!container) return;

    if (!state.discussoes || state.discussoes.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhuma discussão ativa</p>';
        return;
    }

    container.innerHTML = state.discussoes.map(disc => `
        <div class="discussion-card ${!disc.lida ? 'unread' : ''} bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
             onclick="verDiscussao(${disc.id})">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${disc.titulo}</h4>
                    <p class="text-sm text-gray-600 mt-1">${disc.mensagem.substring(0, 60)}...</p>
                    <div class="flex items-center gap-4 mt-2">
                        <span class="text-xs text-gray-500">${disc.autor}</span>
                        <span class="text-xs text-gray-500">${formatarDataRelativa(disc.data)}</span>
                        ${disc.respostas && disc.respostas.length > 0 ? 
                            `<span class="text-xs text-blue-600">${disc.respostas.length} respostas</span>` : 
                            ''}
                    </div>
                </div>
                ${!disc.lida ? '<span class="w-2 h-2 bg-blue-600 rounded-full"></span>' : ''}
            </div>
        </div>
    `).join('');
}

function renderEquipeOnline() {
    const container = document.getElementById('equipeOnline');
    if (!container) return;

    const usuariosOnline = state.usuarios.filter((_, i) => i < 3); // Simular 3 usuários online

    container.innerHTML = usuariosOnline.map(user => `
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="relative">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=3b82f6&color=fff"
                     class="w-10 h-10 rounded-full">
                <span class="online-dot"></span>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">${user.nome}</p>
                <p class="text-xs text-gray-500">${user.papel}</p>
            </div>
        </div>
    `).join('');
}

function showDiscussaoModal() {
    // Preencher select de requisitos
    const select = document.getElementById('discussaoRequisito');
    select.innerHTML = '<option value="">Nenhum</option>' +
        state.requisitos.map(req =>
            `<option value="${req.id}">${req.id} - ${req.titulo}</option>`
        ).join('');

    document.getElementById('modalDiscussao').classList.remove('hidden');
}

document.getElementById('formDiscussao').addEventListener('submit', function(e) {
    e.preventDefault();

    const discussao = {
        id: (state.discussoes || []).length + 1,
        titulo: document.getElementById('discussaoTitulo').value,
        mensagem: document.getElementById('discussaoMensagem').value,
        requisito: document.getElementById('discussaoRequisito').value,
        autor: state.currentUser.nome,
        respostas: [],
        data: new Date(),
        lida: false
    };

    if (!state.discussoes) state.discussoes = [];
    state.discussoes.unshift(discussao);

    if (!state.atividades) state.atividades = [];
    state.atividades.unshift({
        tipo: 'create',
        usuario: state.currentUser.nome,
        acao: 'iniciou discussão sobre',
        entidade: discussao.requisito || 'o projeto',
        data: new Date()
    });

    saveToStorage();
    addAuditLog('Nova Discussão', 'Discussão', discussao.titulo);

    closeModal('modalDiscussao');
    showToast('Discussão criada com sucesso!', 'success');

    if (state.currentSection === 'colaboracao') {
        renderColaboracao();
    }

    e.target.reset();
});

function verDiscussao(id) {
    const disc = state.discussoes.find(d => d.id === id);
    if (disc) {
        disc.lida = true;
        saveToStorage();
        showToast(`Visualizando: ${disc.titulo}`, 'info');
        renderDiscussoes();
    }
}

function formatarDataRelativa(data) {
    const agora = new Date();
    const diff = agora - new Date(data);
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'agora';
    if (minutos < 60) return `${minutos}min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;
    return new Date(data).toLocaleDateString('pt-BR');
}

// ============================================================================
// TIMELINE / ROADMAP
// ============================================================================

function renderTimeline(periodo = 'mes') {
    if (!state.milestones) {
        state.milestones = [
            {
                id: 1,
                titulo: 'MVP - Versão 1.0',
                descricao: 'Lançamento da primeira versão com funcionalidades básicas',
                data: new Date('2024-12-15'),
                status: 'Em Progresso',
                requisitos: ['RF001', 'RF002', 'RF005', 'RF007']
            },
            {
                id: 2,
                titulo: 'Versão 1.1 - Colaboração',
                descricao: 'Adicionar recursos de colaboração em tempo real',
                data: new Date('2025-01-30'),
                status: 'Pendente',
                requisitos: ['RF013', 'RF015']
            },
            {
                id: 3,
                titulo: 'Versão 2.0 - Integração',
                descricao: 'Integração com ferramentas externas',
                data: new Date('2025-03-15'),
                status: 'Pendente',
                requisitos: ['RF031']
            }
        ];
    }

    // Atualizar botões
    ['mes', 'trimestre', 'ano'].forEach(p => {
        const btn = document.getElementById(`btnTimeline${p.charAt(0).toUpperCase() + p.slice(1)}`);
        if (btn) {
            if (p === periodo) {
                btn.classList.remove('bg-gray-200', 'text-gray-700');
                btn.classList.add('bg-blue-600', 'text-white');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        }
    });

    const container = document.getElementById('timelineContainer');
    if (!container) return;

    const milestonesSorted = state.milestones.sort((a, b) => new Date(a.data) - new Date(b.data));

    container.innerHTML = `
        <div class="space-y-1">
            ${milestonesSorted.map(milestone => `
                <div class="timeline-item">
                    <div class="timeline-dot ${milestone.status === 'Concluído' ? 'completed' : milestone.status === 'Em Progresso' ? '' : 'pending'}"></div>
                    <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <h3 class="text-lg font-semibold text-gray-800">${milestone.titulo}</h3>
                                    <span class="badge ${
                                        milestone.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                        milestone.status === 'Em Progresso' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }">${milestone.status}</span>
                                </div>
                                <p class="text-gray-600 text-sm mb-3">${milestone.descricao}</p>
                                <div class="flex items-center gap-4 text-sm">
                                    <span class="text-gray-500">
                                        <span class="iconify" data-icon="mdi:calendar"></span>
                                        ${new Date(milestone.data).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span class="text-gray-500">
                                        <span class="iconify" data-icon="mdi:file-document"></span>
                                        ${milestone.requisitos.length} requisitos
                                    </span>
                                </div>
                                ${milestone.requisitos.length > 0 ? `
                                    <div class="mt-3 flex flex-wrap gap-2">
                                        ${milestone.requisitos.map(reqId => `
                                            <span class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">${reqId}</span>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showMilestoneModal() {
    document.getElementById('modalMilestone').classList.remove('hidden');
}

document.getElementById('formMilestone').addEventListener('submit', function(e) {
    e.preventDefault();

    const milestone = {
        id: (state.milestones || []).length + 1,
        titulo: document.getElementById('milestoneTitulo').value,
        descricao: document.getElementById('milestoneDescricao').value,
        data: new Date(document.getElementById('milestoneData').value),
        status: document.getElementById('milestoneStatus').value,
        requisitos: document.getElementById('milestoneRequisitos').value
            .split(',')
            .map(r => r.trim())
            .filter(r => r)
    };

    if (!state.milestones) state.milestones = [];
    state.milestones.push(milestone);

    saveToStorage();
    addAuditLog('Novo Marco', 'Timeline', milestone.titulo);

    closeModal('modalMilestone');
    showToast('Marco criado com sucesso!', 'success');

    if (state.currentSection === 'timeline') {
        renderTimeline();
    }

    e.target.reset();
});

// ============================================================================
// TEMPLATES
// ============================================================================

function renderTemplates() {
    const container = document.getElementById('gridTemplates');
    if (!container) return;

    if (!state.templates || state.templates.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-8">Nenhum template cadastrado</p>';
        return;
    }

    container.innerHTML = state.templates.map(template => `
        <div class="template-card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="iconify text-2xl text-blue-600" data-icon="mdi:file-document-edit"></span>
                </div>
                <button onclick="aplicarTemplate(${template.id})" 
                        class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Usar
                </button>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">${template.nome}</h3>
            <p class="text-sm text-gray-600 mb-3">${template.descricao || 'Sem descrição'}</p>
            <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded ${
                    template.tipo === 'RF' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }">${template.tipo}</span>
            </div>
        </div>
    `).join('');
}

function showTemplateModal() {
    document.getElementById('modalTemplate').classList.remove('hidden');
}

document.getElementById('formTemplate').addEventListener('submit', function(e) {
    e.preventDefault();

    const template = {
        id: (state.templates || []).length + 1,
        nome: document.getElementById('templateNome').value,
        descricao: document.getElementById('templateDescricao').value,
        tipo: document.getElementById('templateTipo').value,
        estrutura: document.getElementById('templateEstrutura').value,
        campos: {
            titulo: '',
            descricao: document.getElementById('templateEstrutura').value,
            tipo: document.getElementById('templateTipo').value,
            prioridade: 'Média',
            status: 'Proposto'
        }
    };

    if (!state.templates) state.templates = [];
    state.templates.push(template);

    saveToStorage();
    addAuditLog('Novo Template', 'Template', template.nome);

    closeModal('modalTemplate');
    showToast('Template criado com sucesso!', 'success');

    if (state.currentSection === 'templates') {
        renderTemplates();
    }

    e.target.reset();
});

function aplicarTemplate(templateId) {
    const template = state.templates.find(t => t.id === templateId);
    if (!template) return;

    // Preencher o modal de requisito com os dados do template
    document.getElementById('requisitoTipo').value = template.tipo;
    document.getElementById('requisitoDescricao').value = template.estrutura || template.campos.descricao || '';
    document.getElementById('requisitoPrioridade').value = template.campos.prioridade || 'Média';
    document.getElementById('requisitoStatus').value = template.campos.status || 'Proposto';

    if (template.campos.tags) {
        document.getElementById('requisitoTags').value = template.campos.tags.join(', ');
    }

    showRequisitoModal();
    showToast(`Template "${template.nome}" aplicado!`, 'info');
}

// ============================================================================
// NOTIFICAÇÕES
// ============================================================================

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('show');

    if (panel.classList.contains('show')) {
        renderNotifications();
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    if (!container) return;

    if (!state.notificacoes) {
        state.notificacoes = [
            {
                id: 1,
                tipo: 'info',
                titulo: 'Novo requisito adicionado',
                mensagem: 'RF015 foi criado por Maria Santos',
                data: new Date(Date.now() - 1800000),
                lida: false
            },
            {
                id: 2,
                tipo: 'warning',
                titulo: 'Requisito com alta prioridade',
                mensagem: 'RF001 precisa de atenção urgente',
                data: new Date(Date.now() - 3600000),
                lida: false
            },
            {
                id: 3,
                tipo: 'success',
                titulo: 'Marco concluído',
                mensagem: 'MVP - Versão 1.0 foi finalizado',
                data: new Date(Date.now() - 7200000),
                lida: true
            }
        ];
    }

    const naoLidas = state.notificacoes.filter(n => !n.lida).length;
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.style.display = naoLidas > 0 ? 'block' : 'none';
    }

    container.innerHTML = state.notificacoes.length === 0 ?
        '<p class="text-gray-500 text-center py-8">Nenhuma notificação</p>' :
        state.notificacoes.map(notif => `
            <div class="notification-item p-4 rounded-lg ${notif.lida ? 'bg-gray-50' : 'bg-blue-50'} cursor-pointer hover:shadow-sm transition-all"
                 onclick="marcarNotificacaoLida(${notif.id})">
                <div class="flex items-start gap-3">
                    <span class="iconify text-xl ${
                        notif.tipo === 'success' ? 'text-green-600' :
                        notif.tipo === 'warning' ? 'text-yellow-600' :
                        notif.tipo === 'error' ? 'text-red-600' :
                        'text-blue-600'
                    }" data-icon="${
                        notif.tipo === 'success' ? 'mdi:check-circle' :
                        notif.tipo === 'warning' ? 'mdi:alert' :
                        notif.tipo === 'error' ? 'mdi:close-circle' :
                        'mdi:information'
                    }"></span>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 text-sm">${notif.titulo}</h4>
                        <p class="text-sm text-gray-600 mt-1">${notif.mensagem}</p>
                        <p class="text-xs text-gray-500 mt-2">${formatarDataRelativa(notif.data)}</p>
                    </div>
                    ${!notif.lida ? '<span class="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>' : ''}
                </div>
            </div>
        `).join('');
}

function marcarNotificacaoLida(id) {
    const notif = state.notificacoes.find(n => n.id === id);
    if (notif) {
        notif.lida = true;
        saveToStorage();
        renderNotifications();
    }
}

// ============================================================================
// USUÁRIOS
// ============================================================================

function showUsuarioModal() {
    document.getElementById('modalUsuario').classList.remove('hidden');
}

document.getElementById('formUsuario').addEventListener('submit', function(e) {
    e.preventDefault();

    const usuario = {
        id: (state.usuarios || []).length + 1,
        nome: document.getElementById('usuarioNome').value,
        email: document.getElementById('usuarioEmail').value,
        papel: document.getElementById('usuarioPapel').value,
        avatar: document.getElementById('usuarioNome').value.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    if (!state.usuarios) state.usuarios = [];
    state.usuarios.push(usuario);

    saveToStorage();
    addAuditLog('Novo Usuário', 'Sistema', usuario.nome);

    closeModal('modalUsuario');
    showToast('Usuário adicionado com sucesso!', 'success');

    if (state.currentSection === 'configuracoes') {
        renderConfiguracoes();
    }

    e.target.reset();
});

// ============================================================================
// ATUALIZAR NAVEGAÇÃO PARA NOVAS SEÇÕES
// ============================================================================

// Modificar função navigateTo existente para incluir novas seções
const originalNavigateTo = navigateTo;
navigateTo = function(section) {
    originalNavigateTo(section);

    // Adicionar renderização para novas seções
    switch(section) {
        case 'colaboracao':
            renderColaboracao();
            break;
        case 'timeline':
            renderTimeline();
            break;
        case 'templates':
            renderTemplates();
            break;
    }
};

// Adicionar atividade ao realizar ações
function adicionarAtividade(tipo, acao, entidade) {
    if (!state.atividades) state.atividades = [];

    state.atividades.unshift({
        tipo,
        usuario: state.currentUser.nome,
        acao,
        entidade,
        data: new Date()
    });

    // Manter apenas as últimas 100 atividades
    if (state.atividades.length > 100) {
        state.atividades = state.atividades.slice(0, 100);
    }

    saveToStorage();
}

// Modificar funções existentes para adicionar atividades
const originalAddAuditLog = addAuditLog;
addAuditLog = function(acao, entidade, detalhes) {
    originalAddAuditLog(acao, entidade, detalhes);

    // Adicionar à lista de atividades também
    const tipoMap = {
        'Criação': 'create',
        'Atualização': 'update',
        'Exclusão': 'delete',
        'Novo': 'create',
        'Edição': 'update'
    };

    const tipo = Object.keys(tipoMap).find(key => acao.includes(key)) || 'create';
    adicionarAtividade(tipoMap[tipo] || 'update', acao.toLowerCase(), entidade);
};

// ============================================================================
// FUNÇÕES AUXILIARES GERAIS
// ============================================================================

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('.iconify');

    toastMessage.textContent = message;

    // Definir cor e ícone
    toast.classList.remove('bg-gray-800', 'bg-green-600', 'bg-red-600', 'bg-blue-600', 'bg-yellow-600');

    if (type === 'success') {
        toast.classList.add('bg-green-600');
        icon.setAttribute('data-icon', 'mdi:check-circle');
    } else if (type === 'error') {
        toast.classList.add('bg-red-600');
        icon.setAttribute('data-icon', 'mdi:close-circle');
    } else if (type === 'warning') {
        toast.classList.add('bg-yellow-600');
        icon.setAttribute('data-icon', 'mdi:alert');
    } else if (type === 'info') {
        toast.classList.add('bg-blue-600');
        icon.setAttribute('data-icon', 'mdi:information');
    } else {
        toast.classList.add('bg-gray-800');
    }

    toast.classList.remove('translate-y-32');
    toast.classList.add('translate-y-0');

    setTimeout(() => {
        toast.classList.remove('translate-y-0');
        toast.classList.add('translate-y-32');
    }, 3000);
}

// ============================================================================
// ARMAZENAMENTO LOCAL
// ============================================================================

function saveToStorage() {
    try {
        // Serializar dados complexos
        const dataToSave = {
            requisitos: state.requisitos,
            tarefas: state.tarefas,
            documentos: state.documentos,
            usuarios: state.usuarios,
            auditoria: state.auditoria,
            templates: state.templates,
            milestones: state.milestones || [],
            discussoes: state.discussoes || [],
            atividades: state.atividades || [],
            notificacoes: state.notificacoes || [],
            currentUser: state.currentUser,
            currentSection: state.currentSection
        };

        localStorage.setItem('reqflow_data', JSON.stringify(dataToSave));
        console.log('Dados salvos com sucesso');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        showToast('Erro ao salvar dados no localStorage', 'error');
    }
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem('reqflow_data');
        if (saved) {
            const data = JSON.parse(saved);

            // Restaurar dados com tratamento de datas
            state.requisitos = (data.requisitos || []).map(req => ({
                ...req,
                data: new Date(req.data),
                historico: (req.historico || []).map(h => ({
                    ...h,
                    data: new Date(h.data)
                }))
            }));

            state.tarefas = data.tarefas || [];
            state.documentos = data.documentos || [];
            state.usuarios = data.usuarios || [];
            state.auditoria = (data.auditoria || []).map(log => ({
                ...log,
                data: new Date(log.data)
            }));
            state.templates = data.templates || [];
            state.milestones = (data.milestones || []).map(m => ({
                ...m,
                data: new Date(m.data)
            }));
            state.discussoes = (data.discussoes || []).map(d => ({
                ...d,
                data: new Date(d.data),
                respostas: (d.respostas || []).map(r => ({
                    ...r,
                    data: new Date(r.data)
                }))
            }));
            state.atividades = (data.atividades || []).map(a => ({
                ...a,
                data: new Date(a.data)
            }));
            state.notificacoes = data.notificacoes || [];
            state.currentUser = data.currentUser || state.currentUser;
            state.currentSection = data.currentSection || 'dashboard';

            console.log('Dados carregados com sucesso');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// ============================================================================
// VALIDAÇÃO
// ============================================================================

function validarDependencias(requisitoId) {
    const req = state.requisitos.find(r => r.id === requisitoId);
    if (!req) return { valido: false, erro: 'Requisito não encontrado' };

    // Verificar dependências que não existem
    const depInvalidas = req.dependencias.filter(depId =>
        !state.requisitos.some(r => r.id === depId)
    );

    if (depInvalidas.length > 0) {
        return {
            valido: false,
            erro: `Dependências não encontradas: ${depInvalidas.join(', ')}`
        };
    }

    // Verificar dependências circulares
    function temDependenciaCircular(id, visitados = new Set()) {
        if (visitados.has(id)) return true;
        visitados.add(id);

        const r = state.requisitos.find(x => x.id === id);
        if (r && r.dependencias) {
            for (let dep of r.dependencias) {
                if (dep === requisitoId || temDependenciaCircular(dep, new Set(visitados))) {
                    return true;
                }
            }
        }
        return false;
    }

    if (temDependenciaCircular(requisitoId)) {
        return {
            valido: false,
            erro: 'Dependência circular detectada'
        };
    }

    return { valido: true };
}

// ============================================================================
// BUSCA GLOBAL
// ============================================================================

function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        return;
    }

    // Buscar em requisitos
    const requisitosFindos = state.requisitos.filter(r =>
        r.id.toLowerCase().includes(query) ||
        r.titulo.toLowerCase().includes(query) ||
        r.descricao.toLowerCase().includes(query)
    );

    // Buscar em documentos
    const documentosFindos = state.documentos.filter(d =>
        d.titulo.toLowerCase().includes(query) ||
        d.conteudo.toLowerCase().includes(query)
    );

    // Buscar em tarefas
    const tarefasFindas = state.tarefas.filter(t =>
        t.titulo.toLowerCase().includes(query) ||
        t.descricao.toLowerCase().includes(query)
    );

    console.log('Resultados da busca:', {
        requisitos: requisitosFindos,
        documentos: documentosFindos,
        tarefas: tarefasFindas
    });

    showToast(`Encontrados: ${requisitosFindos.length} requisitos, ${documentosFindos.length} documentos, ${tarefasFindas.length} tarefas`, 'info');
}

// Função de gráficos - versão funcional
function renderCharts() {
    console.log('Renderizando gráficos...');

    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está carregado!');
        return;
    }

    // Verificar se há requisitos
    if (!state || !state.requisitos || state.requisitos.length === 0) {
        console.warn('Nenhum requisito disponível para gráficos');
        return;
    }

    console.log(`Renderizando gráficos com ${state.requisitos.length} requisitos`);

    // Limpar gráficos anteriores
    if (window.chartTipos) {
        window.chartTipos.destroy();
        window.chartTipos = null;
    }
    if (window.chartPrioridades) {
        window.chartPrioridades.destroy();
        window.chartPrioridades = null;
    }
    if (window.chartStatus) {
        window.chartStatus.destroy();
        window.chartStatus = null;
    }

    // Gráfico 1: Tipos (Donut)
    const tiposCtx = document.getElementById('chartTipos');
    if (tiposCtx) {
        const ctx = tiposCtx.getContext('2d');
        if (ctx) {
            const rfCount = state.requisitos.filter(r => r.tipo === 'RF').length;
            const rnfCount = state.requisitos.filter(r => r.tipo === 'RNF').length;

            console.log(`Gráfico Tipos - RF: ${rfCount}, RNF: ${rnfCount}`);

            try {
                window.chartTipos = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Funcionais (RF)', 'Não-Funcionais (RNF)'],
                        datasets: [{
                            data: [rfCount, rnfCount],
                            backgroundColor: ['#3b82f6', '#8b5cf6'],
                            borderColor: '#ffffff',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 15,
                                    font: { size: 12 }
                                }
                            }
                        }
                    }
                });
                console.log('✓ Gráfico de Tipos criado');
            } catch(e) {
                console.error('Erro ao criar gráfico de tipos:', e);
            }
        }
    } else {
        console.error('Canvas chartTipos não encontrado!');
    }

    // Gráfico 2: Prioridades (Bar Horizontal)
    const prioridadesCtx = document.getElementById('chartPrioridades');
    if (prioridadesCtx) {
        const ctx = prioridadesCtx.getContext('2d');
        if (ctx) {
            const altaCount = state.requisitos.filter(r => r.prioridade === 'Alta').length;
            const mediaCount = state.requisitos.filter(r => r.prioridade === 'Média').length;
            const baixaCount = state.requisitos.filter(r => r.prioridade === 'Baixa').length;

            console.log(`Gráfico Prioridades - Alta: ${altaCount}, Média: ${mediaCount}, Baixa: ${baixaCount}`);

            try {
                window.chartPrioridades = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Alta', 'Média', 'Baixa'],
                        datasets: [{
                            label: 'Requisitos',
                            data: [altaCount, mediaCount, baixaCount],
                            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: { stepSize: 1, precision: 0 }
                            }
                        }
                    }
                });
                console.log('✓ Gráfico de Prioridades criado');
            } catch(e) {
                console.error('Erro ao criar gráfico de prioridades:', e);
            }
        }
    } else {
        console.error('Canvas chartPrioridades não encontrado!');
    }

    // Gráfico 3: Status (Line)
    const statusCtx = document.getElementById('chartStatus');
    if (statusCtx) {
        const ctx = statusCtx.getContext('2d');
        if (ctx) {
            const statuses = ['Proposto', 'Aprovado', 'Em Desenvolvimento', 'Implementado', 'Validado'];
            const statusCounts = statuses.map(s => state.requisitos.filter(r => r.status === s).length);

            console.log('Gráfico Status - Dados:', statusCounts);

            try {
                window.chartStatus = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: statuses,
                        datasets: [{
                            label: 'Requisitos',
                            data: statusCounts,
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
                        plugins: {
                            legend: {
                                labels: { padding: 15, font: { size: 12 } }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1, precision: 0 }
                            }
                        }
                    }
                });
                console.log('✓ Gráfico de Status criado');
            } catch(e) {
                console.error('Erro ao criar gráfico de status:', e);
            }
        }
    } else {
        console.error('Canvas chartStatus não encontrado!');
    }

    console.log('Renderização de gráficos concluída');
}

console.log('ReqFlow - Funcionalidades avançadas carregadas!');

// Inicialização do sistema quando tudo estiver carregado
window.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando ReqFlow...');

    // Carregar dados do localStorage ou inicializar
    const savedData = localStorage.getItem('reqflow_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            Object.assign(state, parsed);

            // Converter strings de data em objetos Date
            state.requisitos.forEach(req => {
                req.data = new Date(req.data);
                if (req.historico) {
                    req.historico.forEach(h => h.data = new Date(h.data));
                }
            });

            state.tarefas.forEach(t => t.data = new Date(t.data));
            state.auditoria.forEach(a => a.data = new Date(a.data));

            console.log('Dados carregados do localStorage');
        } catch(e) {
            console.error('Erro ao carregar dados:', e);
            initializeSampleData();
        }
    } else {
        initializeSampleData();
    }

    // Renderizar dashboard (seção inicial)
    navigateTo('dashboard');

    console.log('ReqFlow inicializado com sucesso!');
});

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
    if (window.chartTipos) {
        window.chartTipos.destroy();
        window.chartTipos = null;
    }
    if (window.chartPrioridades) {
        window.chartPrioridades.destroy();
        window.chartPrioridades = null;
    }
    if (window.chartStatus) {
        window.chartStatus.destroy();
        window.chartStatus = null;
    }

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
                        legend: {position: 'bottom', labels: {padding: 15, font: {size: 12, weight: 'bold'}}},
                        tooltip: {
                            callbacks: {
                                label: function (c) {
                                    const t = c.dataset.data.reduce((a, b) => a + b, 0);
                                    const p = ((c.parsed / t) * 100).toFixed(1);
                                    return `${c.label}: ${c.parsed} (${p}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Erro gráfico tipos:', e);
        }
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
                        legend: {display: false},
                        tooltip: {
                            callbacks: {
                                label: function (c) {
                                    return `${c.parsed.x} requisitos`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {beginAtZero: true, ticks: {stepSize: 1, precision: 0}}
                    }
                }
            });
        } catch (e) {
            console.error('Erro gráfico prioridades:', e);
        }
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
                    plugins: {legend: {labels: {padding: 15, font: {size: 12, weight: 'bold'}}}},
                    scales: {y: {beginAtZero: true, ticks: {stepSize: 1, precision: 0}}}
                }
            });
        } catch (e) {
            console.error('Erro gráfico status:', e);
        }
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

// ============================================================================
// ReqFlow - Funcionalidades Avançadas v0.3
// Colaboração em tempo real, comentários, análises profundas
// ============================================================================

// ============================================================================
// SISTEMA DE COMENTÁRIOS E COLABORAÇÃO
// ============================================================================

/**
 * Adiciona comentário a um requisito
 */
function adicionarComentarioRequisito(requisitoId, texto, autor) {
    if (!state.comments) state.comments = [];

    const comentario = {
        id: Date.now(),
        requisitoId: requisitoId,
        autor: autor || state.currentUser.nome,
        texto: texto,
        data: new Date(),
        respostas: [],
        likes: 0,
        mencoes: extrairMencoes(texto)
    };

    state.comments.push(comentario);

    // Registrar na auditoria
    addAuditLog('Comentário Adicionado', 'Requisito', `Comentário em ${requisitoId}`, requisitoId);

    // Notificar usuários mencionados
    comentario.mencoes.forEach(usuario => {
        criarNotificacao('mention', `${autor} mencionou você em ${requisitoId}`, usuario);
    });

    saveToStorage();
    return comentario;
}

/**
 * Renderiza comentários de um requisito
 */
function renderComentariosRequisito(requisitoId) {
    const comentarios = (state.comments || []).filter(c => c.requisitoId === requisitoId);

    return `
        <div class="bg-gray-50 rounded-lg p-4 mt-4">
            <h4 class="font-semibold text-gray-800 mb-3">Comentários (${comentarios.length})</h4>
            
            ${comentarios.length === 0 ?
        '<p class="text-sm text-gray-500">Nenhum comentário ainda. Seja o primeiro!</p>' :
        comentarios.map(c => `
                <div class="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.autor)}&background=3b82f6&color=fff" 
                                 alt="${c.autor}" class="w-8 h-8 rounded-full">
                            <div>
                                <p class="font-semibold text-sm text-gray-800">${c.autor}</p>
                                <p class="text-xs text-gray-500">${formatarDataRelativa(c.data)}</p>
                            </div>
                        </div>
                        <button class="text-red-500 hover:text-red-700 text-sm" onclick="deletarComentario(${c.id})">
                            ✕
                        </button>
                    </div>
                    <p class="text-sm text-gray-700">${highlightMencoes(c.texto)}</p>
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <button onclick="likeComentario(${c.id})" class="hover:text-blue-600">
                            👍 ${c.likes > 0 ? c.likes : ''}
                        </button>
                        <button onclick="responderComentario(${c.id})" class="hover:text-blue-600">
                            💬 Responder
                        </button>
                    </div>
                </div>
            `).join('')
    }
            
            <div class="mt-3">
                <textarea id="novoComentario_${requisitoId}" 
                         placeholder="Deixe um comentário... (use @ para mencionar)"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                         rows="2"></textarea>
                <button onclick="salvarComentario('${requisitoId}')" 
                       class="mt-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Comentar
                </button>
            </div>
        </div>
    `;
}

/**
 * Extrai menções (@usuario) do texto
 */
function extrairMencoes(texto) {
    const regex = /@(\w+)/g;
    const mencoes = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
        mencoes.push(match[1]);
    }
    return mencoes;
}

/**
 * Destaca menções no texto
 */
function highlightMencoes(texto) {
    return texto.replace(/@(\w+)/g, '<span class="bg-yellow-200 font-semibold">@$1</span>');
}

/**
 * Salva novo comentário
 */
function salvarComentario(requisitoId) {
    const textarea = document.getElementById(`novoComentario_${requisitoId}`);
    if (!textarea || !textarea.value.trim()) {
        showToast('Digite um comentário', 'warning');
        return;
    }

    adicionarComentarioRequisito(requisitoId, textarea.value.trim());
    textarea.value = '';
    showToast('Comentário adicionado!', 'success');

    // Recarregar visualização (se necessário)
    if (state.currentSection === 'requisitos') {
        renderRequisitos();
    }
}

/**
 * Deleta comentário
 */
function deletarComentario(comentarioId) {
    if (!confirm('Deletar este comentário?')) return;

    const index = (state.comments || []).findIndex(c => c.id === comentarioId);
    if (index !== -1) {
        state.comments.splice(index, 1);
        saveToStorage();
        showToast('Comentário removido', 'success');
    }
}

/**
 * Gera relatório executivo do projeto
 */
function gerarRelatorioExecutivo() {
    const stats = {
        dataGeracao: new Date(),
        projeto: {
            totalRequisitos: state.requisitos.length,
            porTipo: {
                RF: state.requisitos.filter(r => r.tipo === 'RF').length,
                RNF: state.requisitos.filter(r => r.tipo === 'RNF').length
            },
            porStatus: {},
            porPrioridade: {},
            porAutor: {}
        },
        qualidade: {
            requisitoValidados: state.requisitos.filter(r => r.status === 'Validado').length,
            percentualValidacao: 0,
            versaoMedia: 0,
            comentariosPorRequisito: 0
        },
        progresso: {
            tarefasTotal: state.tarefas.length,
            tarefasConcluidas: state.tarefas.filter(t => t.coluna === 'concluido').length,
            percentualProgresso: 0
        },
        colaboracao: {
            totalComentarios: (state.comments || []).length,
            totalDiscussoes: (state.discussoes || []).length,
            membrosAtivos: state.usuarios.length,
            ultimaAtividade: state.auditoria.length > 0 ? state.auditoria[state.auditoria.length - 1].data : null
        },
        dependencias: {
            totalLinhas: state.requisitos.reduce((sum, r) => sum + (r.dependencias || []).length, 0),
            requisitoComDependencias: state.requisitos.filter(r => (r.dependencias || []).length > 0).length,
            requisitoSemDependencias: state.requisitos.filter(r => !(r.dependencias || []).length).length
        }
    };

    // Calcular status
    ['Proposto', 'Aprovado', 'Em Desenvolvimento', 'Implementado', 'Validado'].forEach(status => {
        stats.projeto.porStatus[status] = state.requisitos.filter(r => r.status === status).length;
    });

    // Calcular prioridade
    ['Alta', 'Média', 'Baixa'].forEach(prio => {
        stats.projeto.porPrioridade[prio] = state.requisitos.filter(r => r.prioridade === prio).length;
    });

    // Calcular por autor
    state.requisitos.forEach(r => {
        stats.projeto.porAutor[r.autor] = (stats.projeto.porAutor[r.autor] || 0) + 1;
    });

    // Cálculos de qualidade
    const validados = stats.qualidade.requisitoValidados;
    stats.qualidade.percentualValidacao = state.requisitos.length > 0 ?
        Math.round((validados / state.requisitos.length) * 100) : 0;

    const versoes = state.requisitos.map(r => r.versao || 1);
    stats.qualidade.versaoMedia = versoes.length > 0 ?
        (versoes.reduce((a, b) => a + b, 0) / versoes.length).toFixed(2) : 0;

    stats.qualidade.comentariosPorRequisito = state.requisitos.length > 0 ?
        ((state.comments || []).length / state.requisitos.length).toFixed(2) : 0;

    // Progresso
    stats.progresso.percentualProgresso = state.tarefas.length > 0 ?
        Math.round((stats.progresso.tarefasConcluidas / state.tarefas.length) * 100) : 0;

    return stats;
}

/**
 * Exporta relatório completo em PDF profissional
 */
function exportarRelatorioPDF() {
    try {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let y = margin;

        // Função helper para adicionar nova página se necessário
        const checkNewPage = (minHeight) => {
            if (y + minHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // CAPA
        doc.setFont(undefined, 'bold');
        doc.setFontSize(28);
        doc.text('RELATÓRIO DE REQUISITOS', margin, y);
        y += 15;

        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text('ReqFlow - Sistema de Gerenciamento', margin, y);
        y += 20;

        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);

        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString('pt-BR', {year: 'numeric', month: 'long', day: 'numeric'});

        doc.text([
            `Data de Geração: ${dataFormatada}`,
            `Hora: ${agora.toLocaleTimeString('pt-BR')}`,
            `Total de Requisitos: ${state.requisitos.length}`,
            `Requisitos Funcionais: ${state.requisitos.filter(r => r.tipo === 'RF').length}`,
            `Requisitos Não-Funcionais: ${state.requisitos.filter(r => r.tipo === 'RNF').length}`
        ], margin, y + 10);

        doc.addPage();
        y = margin;

        // SEÇÃO 1: RESUMO EXECUTIVO
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(31, 78, 121);
        doc.text('1. RESUMO EXECUTIVO', margin, y);
        doc.setDrawColor(31, 78, 121);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        const validados = state.requisitos.filter(r => r.status === 'Validado').length;
        const percentualValidacao = state.requisitos.length > 0 ? Math.round((validados / state.requisitos.length) * 100) : 0;

        const resumo = [
            `Total de Requisitos Cadastrados: ${state.requisitos.length}`,
            `Requisitos Validados: ${validados} (${percentualValidacao}%)`,
            `Requisitos em Desenvolvimento: ${state.requisitos.filter(r => r.status === 'Em Desenvolvimento').length}`,
            `Requisitos Implementados: ${state.requisitos.filter(r => r.status === 'Implementado').length}`,
            `Requisitos Aprovados: ${state.requisitos.filter(r => r.status === 'Aprovado').length}`,
            `Requisitos Propostos: ${state.requisitos.filter(r => r.status === 'Proposto').length}`
        ];

        resumo.forEach(linha => {
            doc.text(linha, margin + 5, y);
            y += 6;
        });

        y += 5;

        // SEÇÃO 2: DISTRIBUIÇÃO POR PRIORIDADE
        checkNewPage(50);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(31, 78, 121);
        doc.text('2. DISTRIBUIÇÃO POR PRIORIDADE', margin, y);
        doc.setDrawColor(31, 78, 121);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        const alta = state.requisitos.filter(r => r.prioridade === 'Alta').length;
        const media = state.requisitos.filter(r => r.prioridade === 'Média').length;
        const baixa = state.requisitos.filter(r => r.prioridade === 'Baixa').length;

        const prioridades = [
            `Alta Prioridade: ${alta} requisitos`,
            `Média Prioridade: ${media} requisitos`,
            `Baixa Prioridade: ${baixa} requisitos`
        ];

        prioridades.forEach(linha => {
            doc.text(linha, margin + 5, y);
            y += 6;
        });

        y += 5;

        // SEÇÃO 3: LISTA DE REQUISITOS
        checkNewPage(50);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(31, 78, 121);
        doc.text('3. LISTA DE REQUISITOS', margin, y);
        doc.setDrawColor(31, 78, 121);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);

        state.requisitos.forEach((req, idx) => {
            checkNewPage(25);

            doc.setFont(undefined, 'bold');
            doc.text(`${idx + 1}. ${req.id} - ${req.titulo}`, margin + 5, y);
            y += 5;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(8.5);

            const detalhes = [
                `Tipo: ${req.tipo}`,
                `Prioridade: ${req.prioridade}`,
                `Status: ${req.status}`,
                `Versão: ${req.versao}`,
                `Autor: ${req.autor}`,
                `Data: ${new Date(req.data).toLocaleDateString('pt-BR')}`
            ];

            detalhes.forEach(linha => {
                doc.text(linha, margin + 10, y);
                y += 4;
            });

            // Descrição resumida
            const descricaoResumida = req.descricao.substring(0, 100);
            doc.setFont(undefined, 'italic');
            doc.setFontSize(8);
            const descricaoLinhas = doc.splitTextToSize(descricaoResumida, pageWidth - 2 * margin - 10);
            doc.text(descricaoLinhas, margin + 10, y);
            y += descricaoLinhas.length * 3 + 2;

            if (req.dependencias && req.dependencias.length > 0) {
                doc.setFont(undefined, 'normal');
                doc.setFontSize(8);
                doc.text(`Dependências: ${req.dependencias.join(', ')}`, margin + 10, y);
                y += 4;
            }

            y += 3;
        });

        y += 5;

        // SEÇÃO 4: ESTATÍSTICAS
        checkNewPage(50);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.setTextColor(31, 78, 121);
        doc.text('4. ESTATÍSTICAS', margin, y);
        doc.setDrawColor(31, 78, 121);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        const versoes = state.requisitos.map(r => r.versao || 1);
        const versaoMedia = versoes.length > 0 ? (versoes.reduce((a, b) => a + b, 0) / versoes.length).toFixed(2) : 0;
        const reqComDep = state.requisitos.filter(r => (r.dependencias || []).length > 0).length;

        const stats = [
            `Versão Média dos Requisitos: ${versaoMedia}`,
            `Requisitos com Dependências: ${reqComDep}`,
            `Requisitos sem Dependências: ${state.requisitos.length - reqComDep}`,
            `Total de Tarefas Kanban: ${state.tarefas.length}`,
            `Tarefas Concluídas: ${state.tarefas.filter(t => t.coluna === 'concluido').length}`,
            `Documentos: ${state.documentos.length}`,
            `Membros da Equipe: ${state.usuarios.length}`
        ];

        stats.forEach(linha => {
            doc.text(linha, margin + 5, y);
            y += 6;
        });

        // RODAPÉ
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`ReqFlow - Sistema de Gerenciamento de Requisitos | Gerado em ${dataFormatada}`, margin, pageHeight - 10);

        // Salvar
        const nomeArquivo = `relatorio_reqflow_${agora.getTime()}.pdf`;
        doc.save(nomeArquivo);

        showToast('Relatório PDF gerado com sucesso!', 'success');
        addAuditLog('Relatório Exportado', 'Sistema', 'Relatório profissional completo em PDF');
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        showToast('Erro ao gerar relatório: ' + error.message, 'error');
    }
}

/**
 * Sistema de notificações
 */
function criarNotificacao(tipo, mensagem, usuario) {
    if (!state.notificacoes) state.notificacoes = [];

    const notificacao = {
        id: Date.now(),
        tipo: tipo, // 'mention', 'comment', 'assignment', 'status_change'
        mensagem: mensagem,
        usuario: usuario,
        data: new Date(),
        lida: false
    };

    state.notificacoes.unshift(notificacao);

    // Manter apenas últimas 50
    if (state.notificacoes.length > 50) {
        state.notificacoes = state.notificacoes.slice(0, 50);
    }

    saveToStorage();
}

/**
 * Renderiza painel de notificações
 */
function renderNotificacoesAvancadas() {
    const naoLidas = (state.notificacoes || []).filter(n => !n.lida);
    const container = document.getElementById('notificationsList');

    if (!container) return;

    if (naoLidas.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 text-center py-8">Nenhuma notificação</p>';
        return;
    }

    container.innerHTML = naoLidas.map(n => {
        const icone = n.tipo === 'mention' ? '✓' :
            n.tipo === 'comment' ? '💬' :
                n.tipo === 'assignment' ? '📌' : '🔄';

        return `
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3 rounded cursor-pointer hover:bg-blue-100 transition"
                 onclick="marcarNotificacaoLida(${n.id})">
                <div class="flex items-start gap-3">
                    <span class="text-xl">${icone}</span>
                    <div class="flex-1">
                        <p class="text-sm font-semibold text-gray-800">${n.mensagem}</p>
                        <p class="text-xs text-gray-500 mt-1">${formatarDataRelativa(n.data)}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Marca notificação como lida
 */
function marcarNotificacaoLida(notificacaoId) {
    const notif = (state.notificacoes || []).find(n => n.id === notificacaoId);
    if (notif) {
        notif.lida = true;
        saveToStorage();
        renderNotificacoesAvancadas();
    }
}

console.log('✓ Funcionalidades avançadas carregadas');

// ============================================================================
// ReqFlow - Análises Avançadas e Gráficos
// Funcionalidades de análise de impacto, cobertura e métricas
// ============================================================================

/**
 * Gera análise de cobertura de requisitos por tipo de teste
 * @returns {Object} Dados de cobertura
 */
function analisarCoberturaTestes() {
    const tiposTestem = ['Unitário', 'Integração', 'Sistema', 'Aceitação'];
    const cobertura = {};

    tiposTestem.forEach(tipo => {
        cobertura[tipo] = {
            total: state.requisitos.length,
            cobertos: Math.floor(Math.random() * (state.requisitos.length * 0.8)) + (state.requisitos.length * 0.2),
            percentual: 0
        };
        cobertura[tipo].percentual = Math.round((cobertura[tipo].cobertos / cobertura[tipo].total) * 100);
    });

    return cobertura;
}

/**
 * Calcula análise de dependências e impacto de mudanças
 * @param {string} requisitoId - ID do requisito
 * @returns {Object} Análise de impacto
 */
function analisarImpactoDeMudanca(requisitoId) {
    const req = state.requisitos.find(r => r.id === requisitoId);
    if (!req) return null;

    // Requisitos que dependem deste
    const dependentes = state.requisitos.filter(r =>
        r.dependencias.includes(requisitoId)
    );

    // Tarefas vinculadas
    const tarefasVinculadas = state.tarefas.filter(t =>
        t.requisitosVinculados.includes(requisitoId)
    );

    // Discussões relacionadas
    const discussoesRelacionadas = (state.discussoes || []).filter(d =>
        d.requisito === requisitoId
    );

    return {
        requisito: requisitoId,
        dependentes: dependentes.length,
        dependentesDetalhes: dependentes,
        tarefasAfetadas: tarefasVinculadas.length,
        tarefasDetalhes: tarefasVinculadas,
        discussoesAbertas: discussoesRelacionadas.length,
        impactoTotal: dependentes.length + tarefasVinculadas.length + discussoesRelacionadas.length,
        risco: dependentes.length > 2 ? 'Alto' : dependentes.length > 0 ? 'Médio' : 'Baixo'
    };
}

/**
 * Gera estatísticas do projeto
 * @returns {Object} Estatísticas gerais
 */
function gerarEstatisticasProjeto() {
    const stats = {
        totalRequisitos: state.requisitos.length,
        requisitosPorTipo: {
            RF: state.requisitos.filter(r => r.tipo === 'RF').length,
            RNF: state.requisitos.filter(r => r.tipo === 'RNF').length
        },
        requisitosPorStatus: {},
        requisitosPorPrioridade: {},
        versionamento: {
            versaoMedia: 0,
            maiorVersao: 0,
            requisitosMainoroRecentes: []
        },
        dependencias: {
            totalLinhas: 0,
            requisitoSemDependencias: 0,
            dependenciasCirculares: 0,
            requisitosOrfaos: 0
        },
        colaboracao: {
            totalDiscussoes: (state.discussoes || []).length,
            discussoesAbertas: (state.discussoes || []).filter(d => !d.resolvida).length,
            totalComentarios: (state.discussoes || []).reduce((sum, d) => sum + (d.respostas || []).length, 0)
        },
        tarefas: {
            total: state.tarefas.length,
            porColuna: {},
            concluidas: state.tarefas.filter(t => t.coluna === 'concluido').length
        },
        auditoria: {
            totalAcoes: state.auditoria.length,
            ultimaAcao: state.auditoria.length > 0 ? state.auditoria[state.auditoria.length - 1].data : null
        }
    };

    // Contar por status
    const statuses = ['Proposto', 'Aprovado', 'Em Desenvolvimento', 'Implementado', 'Validado'];
    statuses.forEach(status => {
        stats.requisitosPorStatus[status] = state.requisitos.filter(r => r.status === status).length;
    });

    // Contar por prioridade
    const prioridades = ['Alta', 'Média', 'Baixa'];
    prioridades.forEach(prio => {
        stats.requisitosPorPrioridade[prio] = state.requisitos.filter(r => r.prioridade === prio).length;
    });

    // Versionamento
    const versoes = state.requisitos.map(r => r.versao || 1);
    stats.versionamento.versaoMedia = versoes.length > 0 ? (versoes.reduce((a, b) => a + b, 0) / versoes.length).toFixed(2) : 0;
    stats.versionamento.maiorVersao = Math.max(...versoes);
    stats.versionamento.requisitosMainoroRecentes = state.requisitos
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);

    // Dependências
    state.requisitos.forEach(req => {
        if (!req.dependencias || req.dependencias.length === 0) {
            stats.dependencias.requisitoSemDependencias++;
        }
        stats.dependencias.totalLinhas += (req.dependencias || []).length;
    });

    // Contar por coluna kanban
    ['backlog', 'progresso', 'revisao', 'concluido'].forEach(coluna => {
        stats.tarefas.porColuna[coluna] = state.tarefas.filter(t => t.coluna === coluna).length;
    });

    return stats;
}

/**
 * Gera matriz de rastreabilidade avançada com dados
 * @returns {Object} Dados da matriz
 */
function gerarMatrizRastreabilidadeAvancada() {
    const matriz = {
        requisitos: state.requisitos,
        tiposTeste: ['Unitário', 'Integração', 'Sistema', 'Aceitação'],
        dados: [],
        cobertura: {
            cobertos: 0,
            total: 0,
            percentual: 0
        }
    };

    state.requisitos.forEach(req => {
        const linhas = {};
        linhas[req.id] = {};

        matriz.tiposTeste.forEach(teste => {
            // Simulação: alta prioridade tem mais cobertura
            const vinculado = req.prioridade === 'Alta' || Math.random() > 0.6;
            linhas[req.id][teste] = {
                vinculado: vinculado,
                dataUltimoTeste: vinculado ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null
            };

            if (vinculado) {
                matriz.cobertura.cobertos++;
            }
        });

        matriz.dados.push(linhas);
    });

    matriz.cobertura.total = state.requisitos.length * matriz.tiposTeste.length;
    matriz.cobertura.percentual = Math.round((matriz.cobertura.cobertos / matriz.cobertura.total) * 100);

    return matriz;
}

/**
 * Detecta gargalos no fluxo de trabalho
 * @returns {Array} Lista de gargalos
 */
function detectarGargalos() {
    const gargalos = [];

    // Gargalo 1: Requisitos em desenvolvimento há muito tempo
    const reqLongosDesenvolvimento = state.requisitos
        .filter(r => r.status === 'Em Desenvolvimento')
        .filter(r => {
            const dias = Math.floor((Date.now() - new Date(r.data)) / (1000 * 60 * 60 * 24));
            return dias > 30;
        });

    if (reqLongosDesenvolvimento.length > 0) {
        gargalos.push({
            tipo: 'Desenvolvimento Longo',
            severidade: 'Média',
            requisitos: reqLongosDesenvolvimento,
            recomendacao: 'Revisar progresso dos requisitos em desenvolvimento há mais de 30 dias'
        });
    }

    // Gargalo 2: Requisitos sem testes
    const reqSemTestes = state.requisitos
        .filter(r => r.status === 'Implementado')
        .filter(r => r.status !== 'Validado');

    if (reqSemTestes.length > state.requisitos.length * 0.3) {
        gargalos.push({
            tipo: 'Cobertura de Testes Baixa',
            severidade: 'Alto',
            quantidade: reqSemTestes.length,
            percentual: Math.round((reqSemTestes.length / state.requisitos.length) * 100),
            recomendacao: 'Aumentar prioridade de testes para requisitos implementados'
        });
    }

    // Gargalo 3: Discussões abertas há muito tempo
    const discAbertasLongas = (state.discussoes || [])
        .filter(d => !d.resolvida)
        .filter(d => {
            const dias = Math.floor((Date.now() - new Date(d.data)) / (1000 * 60 * 60 * 24));
            return dias > 14;
        });

    if (discAbertasLongas.length > 0) {
        gargalos.push({
            tipo: 'Discussões Abertas',
            severidade: 'Média',
            quantidade: discAbertasLongas.length,
            recomendacao: 'Resolver discussões abertas há mais de 14 dias'
        });
    }

    // Gargalo 4: Tarefas no Backlog
    const tarefasBacklog = state.tarefas.filter(t => t.coluna === 'backlog');
    if (tarefasBacklog.length > state.tarefas.length * 0.5) {
        gargalos.push({
            tipo: 'Backlog Acumulado',
            severidade: 'Média',
            quantidade: tarefasBacklog.length,
            recomendacao: 'Priorizar e mover tarefas do backlog para desenvolvimento'
        });
    }

    return gargalos;
}

/**
 * Gera recomendações baseadas em análises
 * @returns {Array} Lista de recomendações
 */
function gerarRecomendacoes() {
    const recomendacoes = [];
    const stats = gerarEstatisticasProjeto();

    // Recomendação 1: Versionamento
    if (stats.versionamento.versaoMedia < 1.5) {
        recomendacoes.push({
            categoria: 'Versionamento',
            titulo: 'Aumentar frequência de atualizações',
            descricao: 'A versão média dos requisitos é baixa. Considere revisar e atualizar mais frequentemente.',
            prioridade: 'Baixa',
            impacto: 'Mantém histórico mais completo'
        });
    }

    // Recomendação 2: Requisitos sem prioridade alta
    if (stats.requisitosPorPrioridade['Alta'] < state.requisitos.length * 0.3) {
        recomendacoes.push({
            categoria: 'Priorização',
            titulo: 'Revisar prioridades dos requisitos',
            descricao: 'Menos de 30% dos requisitos estão marcados como Alta prioridade. Verifique se a priorização está correta.',
            prioridade: 'Média',
            impacto: 'Melhora o planejamento e foco do time'
        });
    }

    // Recomendação 3: Requisitos propostos
    if (stats.requisitosPorStatus['Proposto'] > state.requisitos.length * 0.2) {
        recomendacoes.push({
            categoria: 'Aprovação',
            titulo: 'Revisar requisitos propostos',
            descricao: `Há ${stats.requisitosPorStatus['Proposto']} requisitos ainda no status "Proposto". Considere aprová-los ou rejeitá-los.`,
            prioridade: 'Alta',
            impacto: 'Acelera o ciclo de desenvolvimento'
        });
    }

    // Recomendação 4: Validação
    if (stats.requisitosPorStatus['Validado'] < state.requisitos.length * 0.5) {
        recomendacoes.push({
            categoria: 'Qualidade',
            titulo: 'Aumentar taxa de validação',
            descricao: 'Apenas ' + stats.requisitosPorStatus['Validado'] + ' requisitos foram validados. Intensifique o processo de validação.',
            prioridade: 'Alta',
            impacto: 'Garante qualidade do projeto'
        });
    }

    // Recomendação 5: Documentação
    if (state.documentos.length < state.requisitos.length * 0.1) {
        recomendacoes.push({
            categoria: 'Documentação',
            titulo: 'Aumentar cobertura de documentação',
            descricao: 'Há poucos documentos. Considere criar guias e especificações.',
            prioridade: 'Média',
            impacto: 'Facilita compreensão e manutenção do sistema'
        });
    }

    return recomendacoes;
}

/**
 * Exporta relatório analítico completo
 * @returns {Object} Relatório completo
 */
function gerarRelatorioAnalitico() {
    const dataGeracao = new Date();

    return {
        info: {
            nome: 'Relatório Analítico - ReqFlow',
            dataGeracao: dataGeracao,
            periodo: 'Análise Completa do Projeto',
            versao: state.requisitos.length > 0 ? Math.max(...state.requisitos.map(r => r.versao || 1)) : 0
        },
        estatisticas: gerarEstatisticasProjeto(),
        coberturaTestes: analisarCoberturaTestes(),
        matriz: gerarMatrizRastreabilidadeAvancada(),
        gargalos: detectarGargalos(),
        recomendacoes: gerarRecomendacoes(),
        dependencias: {
            totalLinhas: state.requisitos.reduce((sum, r) => sum + (r.dependencias || []).length, 0),
            requisitosComDependencias: state.requisitos.filter(r => (r.dependencias || []).length > 0).length,
            requisitosSemDependencias: state.requisitos.filter(r => !(r.dependencias || []).length).length
        },
        colaboracao: {
            totalComentarios: (state.discussoes || []).reduce((sum, d) => sum + (d.respostas || []).length, 0),
            usuariosAtivos: state.usuarios.length,
            acoesRecentes: state.auditoria.slice(-10)
        }
    };
}

console.log('✓ Módulo de Análises Avançadas carregado');

// ============================================================================
// ReqFlow - Matriz e Dependências Avançadas v0.3
// Melhorias significativas na visualização de dependências
// ============================================================================

/**
 * Renderiza matriz de rastreabilidade avançada e interativa
 */
function renderMatrizAvancada() {
    const container = document.getElementById('matrizRastreabilidade');
    if (!container) return;

    const requisitos = state.requisitos.filter(r => r.tipo === 'RF');
    const tiposTeste = ['Unitário', 'Integração', 'Sistema', 'Aceitação'];

    let html = `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-gray-800 text-white sticky top-0">
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold">ID Requisito</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Título</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Prioridade</th>
    `;

    tiposTeste.forEach(tipo => {
        html += `<th class="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">${tipo}</th>`;
    });

    html += `
                        <th class="border border-gray-300 px-4 py-3 text-center font-semibold">Cobertura</th>
                    </tr>
                </thead>
                <tbody>
    `;

    requisitos.forEach(req => {
        const priorityColor = req.prioridade === 'Alta' ? 'bg-red-100 text-red-800' :
            req.prioridade === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800';

        let cobertura = 0;
        let html_testes = '';

        tiposTeste.forEach((tipo, idx) => {
            // Simulação realista: alta prioridade tem mais cobertura
            const isLinked = req.prioridade === 'Alta' || (req.prioridade === 'Média' && idx < 2) || Math.random() > 0.65;
            if (isLinked) cobertura++;

            const cellClass = isLinked ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200';
            html_testes += `
                <td class="matriz-cell border ${cellClass} px-4 py-3 text-center cursor-pointer hover:shadow-md transition"
                    onclick="toggleVinculoMatriz(this, '${req.id}', '${tipo}')">
                    <span class="text-lg">${isLinked ? '✓' : '−'}</span>
                </td>
            `;
        });

        const percentualCobertura = Math.round((cobertura / tiposTeste.length) * 100);
        const coberturaColor = percentualCobertura === 100 ? 'bg-green-200 text-green-800' :
            percentualCobertura >= 75 ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800';

        html += `
                    <tr class="hover:bg-gray-50 transition border-b border-gray-200">
                        <td class="border border-gray-300 px-4 py-3 font-bold text-blue-600">${req.id}</td>
                        <td class="border border-gray-300 px-4 py-3 text-sm">${req.titulo.substring(0, 40)}...</td>
                        <td class="border border-gray-300 px-4 py-3">
                            <span class="px-2 py-1 rounded text-xs font-semibold ${priorityColor}">
                                ${req.prioridade}
                            </span>
                        </td>
                        ${html_testes}
                        <td class="border border-gray-300 px-4 py-3 text-center">
                            <span class="px-2 py-1 rounded text-xs font-semibold ${coberturaColor}">
                                ${percentualCobertura}%
                            </span>
                        </td>
                    </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-semibold text-gray-800 mb-2">Legenda:</p>
            <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-lg text-green-600">✓</span>
                    <span class="text-sm text-gray-700">Requisito com teste vinculado</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-lg text-gray-600">−</span>
                    <span class="text-sm text-gray-700">Sem vínculo de teste</span>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Toggle de vínculo na matriz
 */
function toggleVinculoMatriz(cell, reqId, tipo) {
    const isLinked = cell.textContent.includes('✓');

    if (isLinked) {
        cell.classList.remove('bg-green-100', 'border-green-300');
        cell.classList.add('bg-white', 'border-gray-200');
        cell.textContent = '−';
        showToast(`Vínculo removido: ${reqId} ↔ ${tipo}`, 'info');
    } else {
        cell.classList.remove('bg-white', 'border-gray-200');
        cell.classList.add('bg-green-100', 'border-green-300');
        cell.textContent = '✓';
        showToast(`Vínculo criado: ${reqId} ↔ ${tipo}`, 'success');
    }

    addAuditLog('Matriz Atualizada', 'Matriz', `${reqId} - ${tipo}`);
}

/**
 * Renderiza grafo de dependências com Vis.js melhorado
 */
function renderDependenciasAvancadas() {
    const container = document.getElementById('network');
    if (!container) return;

    // Preparar nós com mais informações
    const nodes = new vis.DataSet(state.requisitos.map(req => {
        const cor = req.prioridade === 'Alta' ? '#ef4444' :
            req.prioridade === 'Média' ? '#f59e0b' : '#10b981';

        // Aumentar tamanho dos nós significativamente
        const size = 100 + ((req.dependencias || []).length * 10);

        return {
            id: req.id,
            label: req.id + " - " + req.titulo,
            title: `${req.id}: ${req.titulo}\n\nPrioridade: ${req.prioridade}\nStatus: ${req.status}\nDependências: ${(req.dependencias || []).length}`,
            color: {
                background: cor,
                border: '#1f2937',
                highlight: {
                    background: cor,
                    border: '#ffffff'
                }
            },
            shape: 'box',
            font: {color: '#ffffff', bold: {color: '#ffffff'}, size: 18, face: 'Arial'},
            size: size,
            physics: true,
            mass: 2,
            margin: {top: 10, right: 10, bottom: 10, left: 10}
        };
    }));

    // Preparar arestas com informações de dependência
    const edges = new vis.DataSet();
    state.requisitos.forEach(req => {
        if (req.dependencias && req.dependencias.length > 0) {
            req.dependencias.forEach(depId => {
                if (state.requisitos.some(r => r.id === depId)) {
                    edges.add({
                        from: depId,
                        to: req.id,
                        arrows: {to: {enabled: true, scaleFactor: 1.2}},
                        color: {color: '#94a3b8', highlight: '#3b82f6'},
                        smooth: {type: 'continuous'},
                        width: 2,
                        hoverWidth: 3
                    });
                }
            });
        }
    });

    const data = {nodes, edges};
    const options = {
        height: 100 + '%',
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 200,
                nodeSpacing: 250
            }
        },
        physics: {
            enabled: true,
            stabilization: {
                iterations: 200,
                fit: true
            },
            barnesHut: {
                gravitationalConstant: -30000,
                centralGravity: 0.3,
                springLength: 300,
                springConstant: 0.04
            },
            maxVelocity: 50,
            minVelocity: 0.75,
            damping: 0.55
        },
        manipulation: {
            enabled: false
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            hover: true,
            navigationButtons: false,
            keyboard: true
        },
        edges: {
            smooth: {
                enabled: true,
                type: 'cubicBezier',
                roundness: 0.5
            }
        },
        nodes: {
            shadow: {
                enabled: true,
                color: 'rgba(0, 0, 0, 0.2)',
                size: 10,
                x: 5,
                y: 5
            }
        },
        configure: {
            enabled: false,
            showButton: false
        }
    };

    try {
        const network = new vis.Network(container, data, options);

        // Evento: clique no nó abre editor
        network.on('click', function (params) {
            if (params.nodes.length > 0) {
                const reqId = params.nodes[0];
                editarRequisito(reqId);
            }
        });

        // Evento: double-click faz fit
        network.on('doubleClick', function (params) {
            network.fit();
        });

        // Melhorar layout ao estabilizar
        network.once('stabilizationIterationsDone', function () {
            network.setOptions({physics: false});
        });

        network.once('afterDrawing', () => {
            container.style.height = '80vh'
        })

        // Guardar referência para reutilizar
        window.dependenciesNetwork = network;

    } catch (error) {
        console.error('Erro ao renderizar grafo:', error);
        container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Erro ao carregar o grafo de dependências</div>';
    }
}

/**
 * Gera recomendação baseada no risco
 */
function gerarRecomendacao(nivel, alcance) {
    if (nivel >= 4) {
        return `⚠️ CRÍTICO: Esta mudança pode afetar ${alcance} requisitos! Requere revisão completa e testes extensivos.`;
    } else if (nivel >= 3) {
        return `⚡ ALTO: Esta mudança afeta ${alcance} requisitos. Validar impactos antes de alterar.`;
    } else if (nivel > 0) {
        return `ℹ️ MÉDIO: Esta mudança pode afetar ${alcance} requisitos. Verificar dependências.`;
    }
    return `✓ Seguro: Esta mudança é isolada e não afeta outros requisitos.`;
}

console.log('✓ Matriz e Dependências Avançadas carregadas');


// ============================================================================
// ReqFlow - Dados Realistas Avançados v0.3
// Mais comentários, atividades e colaboração
// ============================================================================

// Comentários realistas dos requisitos
const REALISTIC_COMMENTS = [
    {
        requisitoId: 'RF001',
        autor: 'João Silva',
        texto: '@Maria Santos, concordo que o CRUD deve ter validação em tempo real. Já comecei a implementar isso.',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 3
    },
    {
        requisitoId: 'RF001',
        autor: 'Maria Santos',
        texto: 'Ótima observação @João Silva! Também seria legal adicionar um preview antes de salvar.',
        data: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 2
    },
    {
        requisitoId: 'RF007',
        autor: 'Pedro Costa',
        texto: 'Os gráficos ficaram lindos! Sugestão: adicionar filtros por data?',
        data: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 5
    },
    {
        requisitoId: 'RF011',
        autor: 'Ana Oliveira',
        texto: 'Matriz de rastreabilidade pronta para testes. Vou começar a validar cobertura em breve.',
        data: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 1
    },
    {
        requisitoId: 'RF008',
        autor: 'Renzo Paulo',
        texto: 'Grafo de dependências ficou excelente! Bem organizado e muito legível.',
        data: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 4
    },
    {
        requisitoId: 'RF006',
        autor: 'Vanessa Maria',
        texto: 'Exportação para PDF muito melhorada. Suportamos todos os formatos necessários?',
        data: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 2
    },
    {
        requisitoId: 'RF009',
        autor: 'Yuri Filgueira',
        texto: 'Validação automática de dependências circulares foi implementada com sucesso!',
        data: new Date(Date.now() - 7 * 60 * 60 * 1000),
        likes: 6
    }
];

// Atividades mais realistas
const REALISTIC_ACTIVITIES = [
    {
        tipo: 'update',
        usuario: 'Maria Santos',
        acao: 'atualizou status de',
        entidade: 'RF005',
        data: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
        tipo: 'create',
        usuario: 'João Silva',
        acao: 'criou tarefa para',
        entidade: 'RF001',
        data: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
        tipo: 'update',
        usuario: 'Pedro Costa',
        acao: 'marcou como validado',
        entidade: 'RF007',
        data: new Date(Date.now() - 90 * 60 * 1000)
    },
    {
        tipo: 'create',
        usuario: 'Ana Oliveira',
        acao: 'adicionou dependência em',
        entidade: 'RF008',
        data: new Date(Date.now() - 120 * 60 * 1000)
    },
    {
        tipo: 'update',
        usuario: 'Renzo Paulo',
        acao: 'editou descrição de',
        entidade: 'RF011',
        data: new Date(Date.now() - 150 * 60 * 1000)
    },
    {
        tipo: 'create',
        usuario: 'Vanessa Maria',
        acao: 'criou novo documento',
        entidade: 'Especificação Técnica',
        data: new Date(Date.now() - 180 * 60 * 1000)
    },
    {
        tipo: 'update',
        usuario: 'Yuri Filgueira',
        acao: 'marcou como concluído',
        entidade: 'RF006',
        data: new Date(Date.now() - 210 * 60 * 1000)
    }
];

// Inserir dados realistas no inicialização
function carregarDadosRealistas() {
    if (!state.comments) state.comments = [];
    if (!state.atividades) state.atividades = [];

    // Adicionar comentários
    REALISTIC_COMMENTS.forEach(comment => {
        state.comments.push({
            ...comment,
            id: Date.now() + Math.random(),
            respostas: [],
            mencoes: extrairMencoes(comment.texto),
            data: new Date(comment.data)
        });
    });

    // Adicionar atividades
    REALISTIC_ACTIVITIES.forEach(atividade => {
        state.atividades.push({
            ...atividade,
            data: new Date(atividade.data)
        });
    });

    saveToStorage();
}

// Função helper para extrair menções
function extrairMencoes(texto) {
    const regex = /@(\w+)/g;
    const mencoes = [];
    let match;
    while ((match = regex.exec(texto)) !== null) {
        mencoes.push(match[1]);
    }
    return mencoes;
}

// Carregar ao inicializar
if (typeof carregarDadosRealistas === 'function') {
    document.addEventListener('DOMContentLoaded', carregarDadosRealistas);
}

console.log('✓ Dados realistas carregados');

