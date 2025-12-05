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
    console.log('Inicializando dados de exemplo...');
    
    // Requisitos baseados nas entregas
    state.requisitos = [
        {
            id: 'RF001',
            titulo: 'CRUD de Requisitos',
            descricao: 'O sistema deve permitir criar, visualizar, editar e excluir requisitos com campos como ID, título, descrição, tipo, prioridade, status, versão, autor e data.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: [],
            autor: 'Usuário Admin',
            data: new Date('2024-11-15'),
            tags: ['gestão', 'básico', 'crud']
        },
        {
            id: 'RF002',
            titulo: 'Busca e Filtro Avançado de Requisitos',
            descricao: 'O sistema deve permitir buscar e filtrar requisitos por múltiplos critérios: título, tipo, prioridade, status, tags e autor.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-15'),
            tags: ['busca', 'filtro', 'usabilidade']
        },
        {
            id: 'RF004',
            titulo: 'Versionamento e Comparação de Requisitos',
            descricao: 'O sistema deve manter histórico de versões dos requisitos, permitindo visualizar alterações e comparar versões com justificativas obrigatórias.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-16'),
            tags: ['versionamento', 'auditoria', 'histórico']
        },
        {
            id: 'RF005',
            titulo: 'Priorização de Requisitos',
            descricao: 'O sistema deve permitir classificar requisitos em níveis de prioridade: Alta, Média e Baixa, com indicação visual clara.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-16'),
            tags: ['priorização', 'gestão']
        },
        {
            id: 'RF006',
            titulo: 'Exportação e Importação de Requisitos',
            descricao: 'O sistema deve permitir exportar requisitos em múltiplos formatos (PDF, DOCX, XLSX, CSV, JSON) e importar dados estruturados.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-17'),
            tags: ['exportação', 'importação', 'integração']
        },
        {
            id: 'RF007',
            titulo: 'Dashboard de Visão Geral',
            descricao: 'O sistema deve apresentar um dashboard com métricas e gráficos sobre requisitos, incluindo distribuição por tipo, prioridade e status.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-18'),
            tags: ['dashboard', 'métricas', 'visualização']
        },
        {
            id: 'RF008',
            titulo: 'Visualização de Dependências em Grafo',
            descricao: 'O sistema deve exibir graficamente as dependências entre requisitos, permitindo identificar relações e impactos de mudanças.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-18'),
            tags: ['grafo', 'dependências', 'visualização']
        },
        {
            id: 'RF009',
            titulo: 'Validação Automática de Requisitos',
            descricao: 'O sistema deve validar automaticamente campos obrigatórios, formatos corretos e detectar dependências circulares.',
            tipo: 'RF',
            prioridade: 'Média',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-19'),
            tags: ['validação', 'qualidade']
        },
        {
            id: 'RF010',
            titulo: 'Templates de Requisitos',
            descricao: 'O sistema deve permitir criar e usar templates para padronizar a estrutura de diferentes tipos de requisitos.',
            tipo: 'RF',
            prioridade: 'Média',
            status: 'Proposto',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-19'),
            tags: ['templates', 'padronização']
        },
        {
            id: 'RF011',
            titulo: 'Matriz de Rastreabilidade',
            descricao: 'O sistema deve apresentar uma matriz de rastreabilidade mostrando relações entre requisitos, casos de teste e código.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-20'),
            tags: ['rastreabilidade', 'qualidade', 'testes']
        },
        {
            id: 'RF012',
            titulo: 'Log de Auditoria Completo',
            descricao: 'O sistema deve registrar todas as ações realizadas (criação, edição, exclusão) com informações de usuário, data/hora e detalhes.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: [],
            autor: 'Usuário Admin',
            data: new Date('2024-11-20'),
            tags: ['auditoria', 'segurança', 'rastreamento']
        },
        {
            id: 'RF013',
            titulo: 'Ferramenta Colaborativa de Discussão',
            descricao: 'O sistema deve permitir adicionar comentários e threads de discussão em cada requisito para facilitar negociação e colaboração.',
            tipo: 'RF',
            prioridade: 'Média',
            status: 'Proposto',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-21'),
            tags: ['colaboração', 'comentários', 'discussão']
        },
        {
            id: 'RF014',
            titulo: 'Quadro Kanban para Tarefas',
            descricao: 'O sistema deve fornecer um quadro Kanban com colunas drag-and-drop para gerenciar tarefas vinculadas aos requisitos.',
            tipo: 'RF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: ['RF001'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-21'),
            tags: ['kanban', 'tarefas', 'gestão']
        },
        {
            id: 'RF015',
            titulo: 'Módulo de Negociação de Requisitos',
            descricao: 'O sistema deve permitir propostas de alteração, discussão e aprovação de mudanças em requisitos com histórico de negociação.',
            tipo: 'RF',
            prioridade: 'Média',
            status: 'Proposto',
            versao: 1,
            historico: [],
            dependencias: ['RF001', 'RF013'],
            autor: 'Usuário Admin',
            data: new Date('2024-11-22'),
            tags: ['negociação', 'aprovação', 'workflow']
        },
        {
            id: 'RF018',
            titulo: 'Manter Documentação e Wiki',
            descricao: 'O sistema deve fornecer um módulo de documentação/wiki para armazenar guias, tutoriais e documentos técnicos com suporte a Markdown.',
            tipo: 'RF',
            prioridade: 'Média',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: [],
            autor: 'Usuário Admin',
            data: new Date('2024-11-23'),
            tags: ['documentação', 'wiki', 'markdown']
        },
        {
            id: 'RNF001',
            titulo: 'Interface Visual e Intuitiva',
            descricao: 'A interface deve seguir padrões de design modernos (Ant Design), com navegação clara e feedback visual imediato.',
            tipo: 'RNF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: [],
            autor: 'Usuário Admin',
            data: new Date('2024-11-24'),
            tags: ['usabilidade', 'design', 'interface']
        },
        {
            id: 'RNF002',
            titulo: 'Portabilidade Web',
            descricao: 'O sistema deve ser acessível via navegadores web modernos, sem necessidade de instalação de software adicional.',
            tipo: 'RNF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: [],
            autor: 'Usuário Admin',
            data: new Date('2024-11-24'),
            tags: ['portabilidade', 'web', 'compatibilidade']
        },
        {
            id: 'RNF003',
            titulo: 'Integração entre Módulos',
            descricao: 'Todos os módulos do sistema devem estar integrados, permitindo navegação fluida e compartilhamento de dados.',
            tipo: 'RNF',
            prioridade: 'Alta',
            status: 'Implementado',
            versao: 1,
            historico: [],
            dependencias: [],
            autor: 'Usuário Admin',
            data: new Date('2024-11-25'),
            tags: ['integração', 'arquitetura', 'modularidade']
        }
    ];
    
    // Tarefas Kanban
    state.tarefas = [
        {
            id: 1,
            titulo: 'Implementar sistema de notificações',
            descricao: 'Criar sistema de notificações em tempo real para mudanças em requisitos',
            coluna: 'backlog',
            prioridade: 'Média',
            responsavel: 'Dev Team',
            data: new Date(),
            requisitosVinculados: ['RF013']
        },
        {
            id: 2,
            titulo: 'Melhorar exportação PDF',
            descricao: 'Adicionar templates customizáveis para exportação PDF',
            coluna: 'progresso',
            prioridade: 'Alta',
            responsavel: 'João Silva',
            data: new Date(),
            requisitosVinculados: ['RF006']
        },
        {
            id: 3,
            titulo: 'Revisar matriz de rastreabilidade',
            descricao: 'Validar todos os vínculos da matriz e adicionar filtros',
            coluna: 'revisao',
            prioridade: 'Alta',
            responsavel: 'Maria Santos',
            data: new Date(),
            requisitosVinculados: ['RF011']
        },
        {
            id: 4,
            titulo: 'Documentar API',
            descricao: 'Criar documentação completa da API do sistema',
            coluna: 'concluido',
            prioridade: 'Média',
            responsavel: 'Pedro Costa',
            data: new Date(),
            requisitosVinculados: ['RF018']
        }
    ];
    
    // Documentos
    state.documentos = [
        {
            id: 1,
            titulo: 'Guia de Início Rápido',
            conteudo: `# Guia de Início Rápido - ReqFlow

## Bem-vindo ao ReqFlow!

Este guia vai ajudá-lo a começar a usar o sistema de gerenciamento de requisitos.

### Principais Funcionalidades

1. **Dashboard**: Visão geral do projeto com métricas em tempo real
2. **Requisitos**: CRUD completo com versionamento
3. **Kanban**: Gestão visual de tarefas
4. **Matriz**: Rastreabilidade completa
5. **Dependências**: Visualização em grafo

### Como Criar um Requisito

1. Navegue até a seção "Requisitos"
2. Clique em "Novo Requisito"
3. Preencha os campos obrigatórios
4. Salve e acompanhe no dashboard

### Exportação de Dados

O sistema suporta exportação em:
- PDF (relatórios formatados)
- Excel (planilhas)
- CSV (dados tabulares)
- JSON (integração com outras ferramentas)
`,
            tipo: 'guia',
            data: new Date('2024-11-01'),
            autor: 'Usuário Admin',
            versao: 1
        },
        {
            id: 2,
            titulo: 'Especificação de Requisitos',
            conteudo: `# Especificação de Requisitos do Sistema

## 1. Introdução

Este documento descreve os requisitos funcionais e não-funcionais do sistema ReqFlow.

## 2. Requisitos Funcionais

### 2.1 Gerenciamento de Requisitos
- RF001: CRUD de Requisitos
- RF002: Busca e Filtro Avançado
- RF004: Versionamento
- RF005: Priorização

### 2.2 Exportação e Relatórios
- RF006: Exportação Multi-formato
- RF007: Dashboard com Métricas

## 3. Requisitos Não-Funcionais

### 3.1 Usabilidade
- Interface intuitiva seguindo padrões Ant Design
- Feedback visual imediato para ações do usuário

### 3.2 Portabilidade
- Compatível com navegadores modernos
- Sem necessidade de instalação
`,
            tipo: 'especificacao',
            data: new Date('2024-11-05'),
            autor: 'Usuário Admin',
            versao: 1
        }
    ];
    
    // Templates
    state.templates = [
        {
            id: 1,
            nome: 'Requisito Funcional Padrão',
            tipo: 'RF',
            campos: {
                titulo: '',
                descricao: 'O sistema deve...',
                prioridade: 'Média',
                status: 'Proposto'
            }
        },
        {
            id: 2,
            nome: 'Requisito de Interface',
            tipo: 'RF',
            campos: {
                titulo: '',
                descricao: 'A interface deve apresentar...',
                prioridade: 'Alta',
                status: 'Proposto',
                tags: ['interface', 'usabilidade']
            }
        },
        {
            id: 3,
            nome: 'Requisito Não-Funcional',
            tipo: 'RNF',
            campos: {
                titulo: '',
                descricao: 'O sistema deve garantir...',
                prioridade: 'Alta',
                status: 'Proposto'
            }
        }
    ];
    
    // Usuários
    state.usuarios = [
        { id: 1, nome: 'Usuário Admin', papel: 'Gerente', avatar: 'UA' },
        { id: 2, nome: 'João Silva', papel: 'Desenvolvedor', avatar: 'JS' },
        { id: 3, nome: 'Maria Santos', papel: 'Analista', avatar: 'MS' },
        { id: 4, nome: 'Pedro Costa', papel: 'Tester', avatar: 'PC' }
    ];
    
    // Log de auditoria inicial
    addAuditLog('Sistema Inicializado', 'Sistema', 'Sistema inicializado com dados de exemplo');
    
    saveToStorage();
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
    updateDashboardMetrics();
    renderCharts();
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
            // Simulação: Requisitos de alta prioridade têm mais cobertura
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

console.log('ReqFlow - Funcionalidades avançadas carregadas!');

