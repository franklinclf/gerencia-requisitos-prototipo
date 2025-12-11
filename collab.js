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
        const { jsPDF } = window.jspdf;
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
        const dataFormatada = agora.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

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

