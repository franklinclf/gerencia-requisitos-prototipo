// ============================================================================
// ReqFlow - Inicialização de Dados do Projeto
// Carrega dados do documento de requisitos (entrega3.md)
// ============================================================================

// Dados iniciais do projeto baseados em entrega3.md
const INITIAL_PROJECT_DATA = {
    projectName: 'Ferramenta de Gerência de Requisitos - ReqFlow',
    projectVersion: '0.2.0',
    projectDate: '2024-12-04',
    projectTeam: [
        'Franklin Claudio Lopes De Oliveira Filho',
        'Ivison Santana Cau Filho',
        'Joaremio Marinho Revoredo Neto',
        'Marcos Beraldo Barros',
        'Pedro Antonio Galvão Da Costa',
        'Rary Emanuel Gonçalves Coringa',
        'Renzo Paulo Da Silva Zukeram',
        'Vanessa Maria De Oliveira Silva',
        'Yuri Filgueira Tavares De Medeiros'
    ]
};

// Requisitos funcionais e não-funcionais do projeto
const INITIAL_REQUIREMENTS = [
    // RF001 - CRUD de Requisitos
    {
        id: 'RF001',
        titulo: 'Manter Requisitos (CRUD)',
        descricao: 'O sistema deve permitir o gerenciamento completo de requisitos, sendo possível fazer a criação de requisitos, bem como defini-los se são dependentes a outros requisitos ou não, a visualização, edição e deleção.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: [],
        autor: 'Usuário Admin',
        data: new Date('2024-11-15'),
        tags: ['gestão', 'básico', 'crud'],
        criteriosAceitacao: [
            'Criar novo requisito com todos os campos obrigatórios',
            'Editar requisito existente com justificativa',
            'Visualizar detalhes completos do requisito',
            'Excluir requisito com confirmação',
            'Validar IDs únicos (RF001, RNF001, etc)'
        ]
    },
    // RF002 - Busca e Filtro Avançado
    {
        id: 'RF002',
        titulo: 'Busca e filtro avançado para o board',
        descricao: 'O sistema deve permitir a busca rápida por cards no board por meio de palavras chave e com o uso de filtros. O usuário deve conseguir filtrar por critérios como data de entrega, tipo de requisito e prioridade. O sistema deve atualizar em tempo real.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-15'),
        tags: ['busca', 'filtro', 'usabilidade'],
        criteriosAceitacao: [
            'Buscar por título de requisito',
            'Buscar por ID de requisito',
            'Filtrar por tipo (RF ou RNF)',
            'Filtrar por prioridade (Alta, Média, Baixa)',
            'Atualizar resultados em tempo real'
        ]
    },
    // RF003 - Manter Documentação
    {
        id: 'RF003',
        titulo: 'Manter documentação',
        descricao: 'O sistema deve ter um módulo específico focado no gerenciamento de documentação. Basicamente, o sistema deve permitir criar, alterar, visualizar e excluir documentações.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: [],
        autor: 'Usuário Admin',
        data: new Date('2024-11-16'),
        tags: ['documentação', 'wiki', 'gestão'],
        criteriosAceitacao: [
            'Criar documento com título e conteúdo em Markdown',
            'Editar documentos existentes',
            'Visualizar documentos com renderização Markdown',
            'Excluir documentos com confirmação',
            'Manter histórico de versões de documentos'
        ]
    },
    // RF004 - Versionamento e Comparação
    {
        id: 'RF004',
        titulo: 'Versionamento e Comparação',
        descricao: 'O sistema deve implementar um controle de versão granular para cada requisito individualmente. Ao editar um requisito, o sistema não deve sobrescrever o texto anterior, mas sim criar um novo registro (snapshot) vinculado ao ID do requisito, solicitando uma justificativa da mudança.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-16'),
        tags: ['versionamento', 'auditoria', 'histórico'],
        criteriosAceitacao: [
            'Criar nova versão ao editar requisito',
            'Registrar justificativa obrigatória',
            'Manter histórico completo de alterações',
            'Visualizar comparação entre versões',
            'Reverter para versão anterior'
        ]
    },
    // RF005 - Priorização de Requisitos
    {
        id: 'RF005',
        titulo: 'Priorização de requisitos',
        descricao: 'Está funcionalidade deve permitir que os usuários consigam atribuir um valor de prioridade para tarefas, requisitos, testes e demais artefatos dentro do sistema.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-17'),
        tags: ['priorização', 'gestão'],
        criteriosAceitacao: [
            'Atribuir prioridade Alta, Média ou Baixa',
            'Indicação visual clara da prioridade',
            'Filtrar requisitos por prioridade',
            'Ordenar requisitos por prioridade',
            'Alterar prioridade de requisito existente'
        ]
    },
    // RF006 - Exportação e Importação
    {
        id: 'RF006',
        titulo: 'Exportação/Importação de documentos de requisitos (PDF, DOCx, XLSx, CSV)',
        descricao: 'O sistema deve permitir que os requisitos cadastrados no sistema sejam exportados em uma estrutura padrão, em arquivos PDF, DOCx, XLSx e CSV. Também deve permitir que arquivos CSV com requisitos nessa estrutura padrão sejam importados para cadastrar automaticamente muitos requisitos ao mesmo tempo.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-17'),
        tags: ['exportação', 'importação', 'integração'],
        criteriosAceitacao: [
            'Exportar requisitos em PDF',
            'Exportar requisitos em Excel (XLSX)',
            'Exportar requisitos em CSV',
            'Exportar projeto completo em JSON',
            'Importar requisitos de CSV',
            'Importar requisitos de Excel',
            'Importar projeto completo de JSON',
            'Validar estrutura de importação'
        ]
    },
    // RF007 - Dashboard de Visão Geral
    {
        id: 'RF007',
        titulo: 'Dashboard de visão geral',
        descricao: 'O sistema deve possuir um dashboard capaz de mostrar aos usuários o progresso atual do projeto, de acordo com os avanços que forem ocorrendo no projeto, como requisitos concluídos.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-18'),
        tags: ['dashboard', 'métricas', 'visualização'],
        criteriosAceitacao: [
            'Exibir total de requisitos',
            'Mostrar requisitos de alta prioridade',
            'Gráfico de distribuição por tipo',
            'Gráfico de distribuição por prioridade',
            'Mostrar cobertura de testes',
            'Atualizar métricas em tempo real'
        ]
    },
    // RF008 - Visualização de Dependências
    {
        id: 'RF008',
        titulo: 'Visualização de Dependências',
        descricao: 'O sistema deve gerar automaticamente um diagrama de nós (grafo) que representa as relações entre os artefatos. Se o Requisito A é "Pai" do Requisito B, e o Requisito B depende do Caso de Teste C, essa cadeia deve ser visível graficamente.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-18'),
        tags: ['grafo', 'dependências', 'visualização'],
        criteriosAceitacao: [
            'Gerar grafo com requisitos como nós',
            'Exibir arestas para dependências',
            'Colorir por prioridade',
            'Permitir interação com nós',
            'Exibir tooltip com informações',
            'Editar requisito ao clicar no nó'
        ]
    },
    // RF009 - Validação Automática
    {
        id: 'RF009',
        titulo: 'Validação automática de requisitos',
        descricao: 'O sistema deve realizar verificações básicas ao salvar um requisito, como impedir campos obrigatórios vazios e títulos duplicados.',
        tipo: 'RF',
        prioridade: 'Média',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-19'),
        tags: ['validação', 'qualidade'],
        criteriosAceitacao: [
            'Validar campos obrigatórios',
            'Verificar IDs únicos',
            'Validar formato de ID (RFXXX ou RNFXXX)',
            'Detectar dependências circulares',
            'Validar dependências existentes',
            'Mostrar mensagens de erro claras'
        ]
    },
    // RF010 - Templates de Requisitos
    {
        id: 'RF010',
        titulo: 'Templates de requisitos',
        descricao: 'O sistema deve oferecer modelos pré-definidos como histórias de usuário, por exemplo.',
        tipo: 'RF',
        prioridade: 'Média',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-19'),
        tags: ['templates', 'padronização'],
        criteriosAceitacao: [
            'Criar novo template',
            'Editar template existente',
            'Aplicar template ao criar requisito',
            'Deletar template',
            'Reutilizar template múltiplas vezes'
        ]
    },
    // RF011 - Matriz de Rastreabilidade
    {
        id: 'RF011',
        titulo: 'Matriz de Rastreabilidade',
        descricao: 'O sistema deve fornecer uma visualização em formato de grade (tabela de dupla entrada) onde as linhas representam Requisitos Funcionais e as colunas representam Casos de Teste (ou Código). As células devem indicar se existe vínculo entre eles.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-20'),
        tags: ['rastreabilidade', 'qualidade', 'testes'],
        criteriosAceitacao: [
            'Exibir matriz com requisitos nas linhas',
            'Exibir tipos de teste nas colunas',
            'Indicar vínculo entre requisito e teste',
            'Permitir toggle de vínculo',
            'Destacar requisitos sem cobertura',
            'Exportar matriz'
        ]
    },
    // RF012 - Log de Auditoria
    {
        id: 'RF012',
        titulo: 'Log de Auditoria Completo',
        descricao: 'O sistema deve registrar em banco de dados todas as ações críticas, gravando Usuário, Data e Ação.',
        tipo: 'RF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: [],
        autor: 'Usuário Admin',
        data: new Date('2024-11-20'),
        tags: ['auditoria', 'segurança', 'rastreamento'],
        criteriosAceitacao: [
            'Registrar criação de requisito',
            'Registrar edição de requisito',
            'Registrar exclusão de requisito',
            'Mostrar usuário que realizou ação',
            'Mostrar data/hora da ação',
            'Mostrar detalhes da ação',
            'Permitir filtro por data',
            'Permitir filtro por usuário'
        ]
    },
    // RF013 - Ferramenta Colaborativa
    {
        id: 'RF013',
        titulo: 'Ferramenta Colaborativa de Discussão',
        descricao: 'O sistema deve permitir adicionar comentários e threads de discussão em cada requisito para facilitar negociação e colaboração.',
        tipo: 'RF',
        prioridade: 'Média',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-21'),
        tags: ['colaboração', 'comentários', 'discussão'],
        criteriosAceitacao: [
            'Adicionar comentário em requisito',
            'Editar comentário próprio',
            'Deletar comentário',
            'Mencionar usuários com @',
            'Mostrar histórico de discussão',
            'Notificar usuários mencionados'
        ]
    },
    // RF014 - Quadro Kanban
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
        tags: ['kanban', 'tarefas', 'gestão'],
        criteriosAceitacao: [
            'Criar tarefa em coluna Backlog',
            'Mover tarefa entre colunas via drag-and-drop',
            'Definir prioridade de tarefa',
            'Atribuir responsável',
            'Vincular tarefa a requisitos',
            'Visualizar contagem de tarefas por coluna'
        ]
    },
    // RF015 - Módulo de Negociação
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
        tags: ['negociação', 'aprovação', 'workflow'],
        criteriosAceitacao: [
            'Propor alteração em requisito',
            'Visualizar histórico de negociação',
            'Votar em alteração proposta',
            'Comentar sobre proposta',
            'Aprovar ou rejeitar proposta',
            'Registrar decisão final'
        ]
    },
    // RF016 - Gerenciamento de Escopo
    {
        id: 'RF016',
        titulo: 'Gerenciamento de Escopo',
        descricao: 'O sistema deve permitir agrupar requisitos em pastas, pacotes ou módulos.',
        tipo: 'RF',
        prioridade: 'Média',
        status: 'Proposto',
        versao: 1,
        historico: [],
        dependencias: ['RF001'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-22'),
        tags: ['escopo', 'organização', 'estrutura'],
        criteriosAceitacao: [
            'Criar módulo/pacote',
            'Agrupar requisitos em módulo',
            'Mover requisito entre módulos',
            'Visualizar requisitos por módulo',
            'Estatísticas por módulo',
            'Exportar requisitos de módulo específico'
        ]
    },
    // RF017 - Geração de Relatórios
    {
        id: 'RF017',
        titulo: 'Geração de Relatórios Automatizada',
        descricao: 'O Sistema deve permitir gerar relatórios de requisitos, testes, progresso do projeto e status dos requisitos com base nas informações armazenadas no repositório de requisitos.',
        tipo: 'RF',
        prioridade: 'Média',
        status: 'Proposto',
        versao: 1,
        historico: [],
        dependencias: ['RF001', 'RF007'],
        autor: 'Usuário Admin',
        data: new Date('2024-11-23'),
        tags: ['relatórios', 'análise', 'exportação'],
        criteriosAceitacao: [
            'Gerar relatório de requisitos',
            'Gerar relatório de progresso',
            'Gerar relatório de testes',
            'Customizar campos do relatório',
            'Exportar relatório em PDF',
            'Agendar geração de relatórios'
        ]
    },
    // RF018 - Documentação e Wiki
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
        tags: ['documentação', 'wiki', 'markdown'],
        criteriosAceitacao: [
            'Criar documento com Markdown',
            'Editar documento',
            'Visualizar com formatação',
            'Deletar documento',
            'Manter histórico de versões',
            'Exportar documento'
        ]
    },
    // Requisitos Não-Funcionais
    {
        id: 'RNF001',
        titulo: 'Integração entre Módulos',
        descricao: 'Garante uma experiência fluida, evitando que o usuário sinta que está trocando de sistema ao navegar entre funcionalidades. A integração entre módulos assegura que dados e processos sejam compartilhados de forma transparente.',
        tipo: 'RNF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: [],
        autor: 'Usuário Admin',
        data: new Date('2024-11-24'),
        tags: ['integração', 'arquitetura', 'modularidade'],
        criteriosAceitacao: [
            'Navegação fluida entre módulos',
            'Compartilhamento de dados transparente',
            'Alterações refletem automaticamente',
            'Consistência de dados entre módulos'
        ]
    },
    {
        id: 'RNF002',
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
        tags: ['usabilidade', 'design', 'interface'],
        criteriosAceitacao: [
            'Seguir padrões Ant Design',
            'Navegação clara e consistente',
            'Feedback visual para ações',
            'Responsive em diferentes tamanhos',
            'Acessibilidade básica'
        ]
    },
    {
        id: 'RNF003',
        titulo: 'Portabilidade Web',
        descricao: 'O sistema deve ser acessível via navegadores web modernos, sem necessidade de instalação de software adicional.',
        tipo: 'RNF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: [],
        autor: 'Usuário Admin',
        data: new Date('2024-11-25'),
        tags: ['portabilidade', 'web', 'compatibilidade'],
        criteriosAceitacao: [
            'Funciona em Chrome',
            'Funciona em Firefox',
            'Funciona em Safari',
            'Funciona em Edge',
            'Compatível com Windows, Mac, Linux'
        ]
    },
    {
        id: 'RNF004',
        titulo: 'Padronização de Dados (JSON)',
        descricao: 'O sistema deve utilizar estruturas JSON como forma padrão para a persistência e troca de dados.',
        tipo: 'RNF',
        prioridade: 'Alta',
        status: 'Implementado',
        versao: 1,
        historico: [],
        dependencias: [],
        autor: 'Usuário Admin',
        data: new Date('2024-11-25'),
        tags: ['padrão', 'dados', 'JSON'],
        criteriosAceitacao: [
            'Dados persistidos em JSON',
            'Exportação em JSON',
            'Importação de JSON',
            'Estrutura válida e bem-formada',
            'Legível para humanos'
        ]
    }
];

// Tarefas Kanban iniciais
const INITIAL_TASKS = [
    {
        id: 1,
        titulo: 'Implementar Dashboard Avançado',
        descricao: 'Criar gráficos adicionais e análises de impacto para o dashboard',
        coluna: 'progresso',
        prioridade: 'Alta',
        responsavel: 'Dev Team',
        data: new Date(),
        requisitosVinculados: ['RF007', 'RF017']
    },
    {
        id: 2,
        titulo: 'Melhorar Matriz de Rastreabilidade',
        descricao: 'Adicionar filtros e análise de cobertura na matriz',
        coluna: 'revisao',
        prioridade: 'Alta',
        responsavel: 'Maria Santos',
        data: new Date(),
        requisitosVinculados: ['RF011']
    },
    {
        id: 3,
        titulo: 'Implementar Sistema de Comentários',
        descricao: 'Adicionar suporte a comentários e discussões em requisitos',
        coluna: 'backlog',
        prioridade: 'Média',
        responsavel: 'João Silva',
        data: new Date(),
        requisitosVinculados: ['RF013']
    },
    {
        id: 4,
        titulo: 'Testes de Importação/Exportação',
        descricao: 'Validar funcionalidades de import/export com diferentes formatos',
        coluna: 'concluido',
        prioridade: 'Média',
        responsavel: 'Pedro Costa',
        data: new Date(),
        requisitosVinculados: ['RF006']
    },
    {
        id: 5,
        titulo: 'Documentação de Dependências',
        descricao: 'Documentar todas as dependências e relações entre requisitos',
        coluna: 'progresso',
        prioridade: 'Média',
        responsavel: 'Ana Oliveira',
        data: new Date(),
        requisitosVinculados: ['RF008', 'RF018']
    },
    {
        id: 6,
        titulo: 'Testes de Validação',
        descricao: 'Testar validação automática de campos obrigatórios',
        coluna: 'backlog',
        prioridade: 'Alta',
        responsavel: 'Renzo Paulo',
        data: new Date(),
        requisitosVinculados: ['RF009', 'RF001']
    },
    {
        id: 7,
        titulo: 'Criar Templates Personalizados',
        descricao: 'Desenvolver templates adicionais para diferentes tipos de requisitos',
        coluna: 'backlog',
        prioridade: 'Baixa',
        responsavel: 'Vanessa Maria',
        data: new Date(),
        requisitosVinculados: ['RF010']
    },
    {
        id: 8,
        titulo: 'Análise de Dependências Circulares',
        descricao: 'Implementar detecção automática de dependências circulares',
        coluna: 'concluido',
        prioridade: 'Alta',
        responsavel: 'Yuri Filgueira',
        data: new Date(),
        requisitosVinculados: ['RF009', 'RF008']
    }
];

// Marcos/Milestones do projeto
const INITIAL_MILESTONES = [
    {
        id: 1,
        titulo: 'MVP - Versão 1.0',
        descricao: 'Lançamento da primeira versão com funcionalidades básicas',
        data: new Date('2024-12-11'),
        status: 'Em Progresso',
        requisitos: ['RF001', 'RF002', 'RF005', 'RF007', 'RF014']
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
        titulo: 'Versão 2.0 - Integração Completa',
        descricao: 'Integração com ferramentas externas e APIs',
        data: new Date('2025-03-15'),
        status: 'Pendente',
        requisitos: ['RF016', 'RF017']
    }
];

// Discussões iniciais
const INITIAL_DISCUSSIONS = [
    {
        id: 1,
        titulo: 'Revisão de Prioridades de RF008 e RF009',
        autor: 'Usuário Admin',
        mensagem: 'Preciso revisar as prioridades dos requisitos de dependência e validação. Acho que ambos deveriam ser Alta.',
        requisito: 'RF008',
        respostas: [
            {
                autor: 'Maria Santos',
                mensagem: 'Concordo! Validação automática é crítico para evitar erros.',
                data: new Date(Date.now() - 3600000)
            },
            {
                autor: 'João Silva',
                mensagem: 'Sugerido adicionar testes unitários antes da validação.',
                data: new Date(Date.now() - 1800000)
            }
        ],
        data: new Date(Date.now() - 7200000),
        lida: false
    },
    {
        id: 2,
        titulo: 'Dúvida sobre estrutura de RF011 - Matriz',
        autor: 'João Silva',
        mensagem: 'Como devemos estruturar a matriz de rastreabilidade? Requisitos nas linhas e testes nas colunas?',
        requisito: 'RF011',
        respostas: [
            {
                autor: 'Pedro Costa',
                mensagem: 'Exatamente! Assim podemos ver rapidamente o que está testado e o que não está.',
                data: new Date(Date.now() - 3600000)
            },
            {
                autor: 'Ana Oliveira',
                mensagem: 'Concordo. Isso facilita muito a rastreabilidade.',
                data: new Date(Date.now() - 2400000)
            }
        ],
        data: new Date(Date.now() - 10800000),
        lida: true
    },
    {
        id: 3,
        titulo: 'Implementação de RF006 - Exportação',
        autor: 'Pedro Costa',
        mensagem: 'Já começamos a implementação da exportação PDF. Vamos suportar também Excel?',
        requisito: 'RF006',
        respostas: [
            {
                autor: 'Usuário Admin',
                mensagem: 'Sim, Excel também. E CSV para compatibilidade com outras ferramentas.',
                data: new Date(Date.now() - 5400000)
            }
        ],
        data: new Date(Date.now() - 6300000),
        lida: true
    },
    {
        id: 4,
        titulo: 'Melhorias sugeridas para RF007 - Dashboard',
        autor: 'Ana Oliveira',
        mensagem: 'O dashboard ficou ótimo! Mas seria legal adicionar gráficos de progresso ao longo do tempo.',
        requisito: 'RF007',
        respostas: [
            {
                autor: 'Renzo Paulo',
                mensagem: 'Boa ideia! Vamos criar um gráfico de tendências.',
                data: new Date(Date.now() - 2700000)
            }
        ],
        data: new Date(Date.now() - 4500000),
        lida: false
    }
];

console.log('✓ Dados iniciais carregados do entrega3.md');

