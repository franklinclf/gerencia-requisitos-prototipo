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

