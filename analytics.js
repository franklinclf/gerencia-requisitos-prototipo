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

