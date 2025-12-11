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
            font: { color: '#ffffff', bold: { color: '#ffffff' }, size: 18, face: 'Arial' },
            size: size,
            physics: true,
            mass: 2,
            margin: { top: 10, right: 10, bottom: 10, left: 10 }
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
                        arrows: { to: { enabled: true, scaleFactor: 1.2 } },
                        color: { color: '#94a3b8', highlight: '#3b82f6' },
                        smooth: { type: 'continuous' },
                        width: 2,
                        hoverWidth: 3
                    });
                }
            });
        }
    });

    const data = { nodes, edges };
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
        network.on('click', function(params) {
            if (params.nodes.length > 0) {
                const reqId = params.nodes[0];
                editarRequisito(reqId);
            }
        });

        // Evento: double-click faz fit
        network.on('doubleClick', function(params) {
            network.fit();
        });

        // Melhorar layout ao estabilizar
        network.once('stabilizationIterationsDone', function() {
            network.setOptions({ physics: false });
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

