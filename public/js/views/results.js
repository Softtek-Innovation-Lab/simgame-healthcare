import { decisionsData, metricsInfo, metricNamesLong, formatNumber, BUDGET, calculateAverages } from '../data.js';

let barChartInstance = null;
let radarChartInstance = null;

export function render(container, state, playerData) {
    const myRank = state.allPlayers.findIndex(p => p.name === state.currentPlayer) + 1;

    container.innerHTML = `
        <div class="header">
            <h1 class="main-title title-font">RESULTADOS - ${state.currentPlayer}</h1>
            <p style="font-size: 1.5rem; color: #cbd5e1;">
                Tu posición: <span style="color: #fbbf24; font-weight: 900;">#${myRank}</span> de <span>${state.allPlayers.length}</span>
            </p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" style="border-color: #fbbf24;">
                <p class="stat-label">Tu Score</p>
                <p class="stat-value">${playerData.overallScore}</p>
            </div>
            <div class="stat-card" style="border-color: #22d3ee;">
                <p class="stat-label">Créditos</p>
                <p class="stat-value">${formatNumber(playerData.cost)}/10k</p>
            </div>
            <div class="stat-card" style="border-color: #a855f7;">
                <p class="stat-label">Decisiones</p>
                <p class="stat-value">${playerData.decisions.length}</p>
            </div>
            <div class="stat-card" style="border-color: #10b981;">
                <p class="stat-label">Jugadores</p>
                <p class="stat-value">${state.allPlayers.length}</p>
            </div>
        </div>

        ${renderStrategicObjectives(playerData)}

        <div id="objectivesAnalysis"></div>

        <div class="charts-grid">
            <div class="chart-container">
                <h3 class="chart-title">📊 TU IMPACTO POR MÉTRICA</h3>
                <canvas id="barChart"></canvas>
            </div>
            <div class="chart-container">
                <h3 class="chart-title">🎯 TU PERFIL DE IMPACTO</h3>
                <canvas id="radarChart"></canvas>
            </div>
        </div>

        <div class="card">
            <h3 style="font-size: 1.75rem; font-weight: 700; color: #fbbf24; margin-bottom: 24px;">
                🏆 RANKING GENERAL
            </h3>
            <div class="ranking-list" id="rankingList">
                ${renderRanking(state)}
            </div>
        </div>

        <div class="btn-group">
            <button class="btn btn-primary" id="playAgainBtn">
                JUGAR DE NUEVO
            </button>
            <button class="btn btn-success" id="exportExcelBtn">
                📥 EXPORTAR A EXCEL
            </button>
            <button class="btn btn-secondary" id="updateRankingBtn">
                ACTUALIZAR RANKING
            </button>
        </div>
    `;

    // Render charts after DOM is ready
    setTimeout(() => {
        renderCharts(playerData.averages, playerData.strategicObjectives || state.strategicObjectives);
        renderObjectivesAnalysis(playerData.averages, playerData.strategicObjectives || state.strategicObjectives);
    }, 0);
}

function renderStrategicObjectives(playerData) {
    const objectives = playerData.strategicObjectives || [];
    if (objectives.length === 0) return '';

    return `
        <div style="background: rgba(251, 191, 36, 0.1); border: 2px solid #fbbf24; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #fbbf24; font-size: 1.25rem; margin-bottom: 12px;">🎯 Tus Objetivos Estratégicos</h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                ${objectives.map(obj => `
                    <div style="background: linear-gradient(90deg, #fbbf24, #f59e0b); color: #000; padding: 12px 20px; border-radius: 8px; font-weight: 700;">
                        ${metricsInfo[obj] ? metricsInfo[obj].name : obj}
                    </div>
                `).join('')}
            </div>
            <p style="color: #cbd5e1; margin-top: 12px; font-size: 0.875rem;">
                Estas métricas puntúan el doble en tu score final
            </p>
        </div>
    `;
}

function renderRanking(state) {
    return state.allPlayers.map((player, idx) => `
        <div class="ranking-item ${player.name === state.currentPlayer ? 'highlight' : ''}">
            <div class="ranking-left">
                <div class="ranking-position ${idx < 3 ? 'pos-' + (idx + 1) : ''}">
                    ${idx + 1}°
                </div>
                <div>
                    <div style="font-weight: 700; font-size: 1.125rem; color: ${player.name === state.currentPlayer ? '#22d3ee' : 'white'};">
                        ${player.name} ${player.name === state.currentPlayer ? '(TÚ)' : ''}
                    </div>
                    <div style="font-size: 0.875rem; color: #94a3b8;">
                        ${player.decisions.length} decisiones • ${formatNumber(player.cost)} créditos
                    </div>
                </div>
            </div>
            <div class="ranking-score">
                ${player.overallScore}
            </div>
        </div>
    `).join('');
}

function renderCharts(averages, strategicObjectives) {
    const metrics = Object.keys(averages);
    const values = Object.values(averages);
    const labels = metrics.map(m => metricNamesLong[m]);

    // Bar Chart
    const barCtx = document.getElementById('barChart');
    if (!barCtx) return;

    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(barCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Impacto',
                data: values,
                backgroundColor: metrics.map(m =>
                    strategicObjectives.includes(m) ? '#fbbf24' : '#22d3ee'
                ),
                borderColor: metrics.map(m =>
                    strategicObjectives.includes(m) ? '#f59e0b' : '#3b82f6'
                ),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true, max: 5,
                    ticks: { color: '#94a3b8' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { color: '#94a3b8', font: { size: 10 } },
                    grid: { color: '#334155' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const metric = metrics[context.dataIndex];
                            const isStrategic = strategicObjectives.includes(metric);
                            return `${context.parsed.y}/5 ${isStrategic ? '⭐ ESTRATÉGICA' : ''}`;
                        }
                    }
                }
            }
        }
    });

    // Radar Chart
    const radarCtx = document.getElementById('radarChart');
    if (!radarCtx) return;

    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(radarCtx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: labels.map((label, idx) => {
                const metric = metrics[idx];
                return strategicObjectives.includes(metric) ? `⭐ ${label}` : label;
            }),
            datasets: [
                {
                    label: 'Todas las Métricas',
                    data: values,
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    borderColor: '#a855f7',
                    borderWidth: 2,
                    pointBackgroundColor: '#a855f7',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#a855f7'
                },
                {
                    label: 'Objetivos Estratégicos',
                    data: metrics.map(m =>
                        strategicObjectives.includes(m) ? averages[m] : null
                    ),
                    backgroundColor: 'rgba(251, 191, 36, 0.3)',
                    borderColor: '#fbbf24',
                    borderWidth: 4,
                    pointBackgroundColor: '#fbbf24',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#fbbf24',
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true, min: 0, max: 5,
                    ticks: { color: '#94a3b8', backdropColor: 'transparent', stepSize: 1 },
                    grid: { color: '#334155' },
                    pointLabels: { color: '#94a3b8', font: { size: 11, weight: 'bold' } }
                }
            },
            plugins: {
                legend: {
                    display: true, position: 'bottom',
                    labels: { color: '#e2e8f0', padding: 15, font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.parsed.r}/5`;
                        }
                    }
                }
            }
        }
    });
}

function renderObjectivesAnalysis(averages, strategicObjectives) {
    const container = document.getElementById('objectivesAnalysis');
    if (!container || !strategicObjectives || strategicObjectives.length === 0) return;

    const strategicAvg = strategicObjectives.reduce((sum, metric) =>
        sum + averages[metric], 0
    ) / strategicObjectives.length;

    const otherMetrics = Object.keys(averages).filter(m => !strategicObjectives.includes(m));
    const otherAvg = otherMetrics.reduce((sum, metric) => sum + averages[metric], 0) / otherMetrics.length;

    let strategicLevel, strategicColor, strategicMessage;
    if (strategicAvg >= 4.0) {
        strategicLevel = 'EXCELENTE'; strategicColor = '#22c55e';
        strategicMessage = '¡Lograste un impacto sobresaliente en tus objetivos estratégicos!';
    } else if (strategicAvg >= 3.5) {
        strategicLevel = 'MUY BUENO'; strategicColor = '#84cc16';
        strategicMessage = 'Muy buen desempeño en tus prioridades estratégicas.';
    } else if (strategicAvg >= 3.0) {
        strategicLevel = 'BUENO'; strategicColor = '#eab308';
        strategicMessage = 'Buen balance, aunque hay margen de mejora en tus objetivos.';
    } else if (strategicAvg >= 2.5) {
        strategicLevel = 'REGULAR'; strategicColor = '#f97316';
        strategicMessage = 'Tus decisiones no priorizaron suficientemente tus objetivos estratégicos.';
    } else {
        strategicLevel = 'BAJO'; strategicColor = '#ef4444';
        strategicMessage = 'Considera revisar tus decisiones para alinearlas mejor con tus objetivos.';
    }

    container.innerHTML = `
        <div style="background: rgba(30, 41, 59, 0.8); border: 2px solid #334155; border-radius: 16px; padding: 24px;">
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #22d3ee; margin-bottom: 20px;">
                📊 Análisis de Objetivos Estratégicos
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px;">
                <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1)); border: 2px solid #fbbf24; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 0.875rem; color: #fbbf24; font-weight: 600; margin-bottom: 8px;">⭐ OBJETIVOS ESTRATÉGICOS</div>
                    <div style="font-size: 3rem; font-weight: 900; color: #fbbf24; margin: 8px 0;">${strategicAvg.toFixed(2)}</div>
                    <div style="font-size: 0.875rem; color: #cbd5e1;">${strategicObjectives.map(m => metricsInfo[m].name).join(' + ')}</div>
                </div>
                
                <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1)); border: 2px solid #a855f7; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 0.875rem; color: #a855f7; font-weight: 600; margin-bottom: 8px;">OTRAS MÉTRICAS</div>
                    <div style="font-size: 3rem; font-weight: 900; color: #a855f7; margin: 8px 0;">${otherAvg.toFixed(2)}</div>
                    <div style="font-size: 0.875rem; color: #cbd5e1;">Balance general del resto</div>
                </div>
                
                <div style="background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1)); border: 2px solid ${strategicColor}; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 0.875rem; color: ${strategicColor}; font-weight: 600; margin-bottom: 8px;">EVALUACIÓN</div>
                    <div style="font-size: 2rem; font-weight: 900; color: ${strategicColor}; margin: 8px 0;">${strategicLevel}</div>
                    <div style="font-size: 0.875rem; color: #cbd5e1;">Cumplimiento: ${((strategicAvg / 5) * 100).toFixed(0)}%</div>
                </div>
            </div>
            
            <div style="background: rgba(${strategicColor === '#22c55e' ? '34, 197, 94' : strategicColor === '#ef4444' ? '239, 68, 68' : '234, 179, 8'}, 0.1); border: 1px solid ${strategicColor}; border-radius: 8px; padding: 16px;">
                <p style="color: #e2e8f0; line-height: 1.6; margin: 0;">
                    <strong style="color: ${strategicColor};">💡 Insights:</strong> ${strategicMessage}
                </p>
            </div>
            
            <div style="margin-top: 20px;">
                <h4 style="color: #fbbf24; font-size: 1.125rem; margin-bottom: 12px;">Desglose de Objetivos:</h4>
                <div style="display: grid; gap: 12px;">
                    ${strategicObjectives.map(metric => {
                        const value = averages[metric];
                        const percentage = (value / 5) * 100;
                        return `
                            <div style="background: rgba(15, 23, 42, 0.5); border-radius: 8px; padding: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span style="color: #e2e8f0; font-weight: 600;">${metricsInfo[metric].name}</span>
                                    <span style="color: #fbbf24; font-weight: 900; font-size: 1.25rem;">${value}/5</span>
                                </div>
                                <div style="background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: linear-gradient(90deg, #fbbf24, #f59e0b); height: 100%; width: ${percentage}%; transition: width 0.5s;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

export function bind(app) {
    document.getElementById('playAgainBtn').addEventListener('click', () => app.playAgain());
    document.getElementById('exportExcelBtn').addEventListener('click', () => app.exportToExcel());
    document.getElementById('updateRankingBtn').addEventListener('click', () => app.updateRanking());
}

export function exportToExcel(state) {
    const playerData = state.allPlayers.find(p => p.name === state.currentPlayer);

    if (!playerData) {
        alert('No hay datos para exportar');
        return;
    }

    try {
        const decisionesExport = playerData.decisions.map(id => {
            const decision = decisionsData.find(d => d.id === id);
            return {
                'Decisión': decision.decision,
                'Categoría': decision.categoria,
                'Costo': decision.costo,
                'NPS': decision.nps,
                'Evitar Burnout': decision.evitarBurnout,
                'Eficiencia': decision.eficiencia,
                'Accuracy': decision.accuracy,
                'Go-to-Market': decision.goToMkt
            };
        });

        const resumenData = [{
            'Jugador': playerData.name,
            'Fecha': new Date(playerData.timestamp).toLocaleString('es-AR'),
            'Créditos Totales': BUDGET,
            'Créditos Usados': playerData.cost,
            'Créditos Restantes': BUDGET - playerData.cost,
            'Cantidad Decisiones': playerData.decisions.length,
            'Score General': playerData.overallScore
        }];

        const metricasData = [{
            'NPS (Satisfacción Paciente)': playerData.averages.nps,
            'Evitar Burnout (Staff)': playerData.averages.evitarBurnout,
            'Eficiencia (Ahorro)': playerData.averages.eficiencia,
            'Accuracy (Precisión)': playerData.averages.accuracy,
            'Go-to-Market (Velocidad)': playerData.averages.goToMkt
        }];

        const wb = XLSX.utils.book_new();

        const wsResumen = XLSX.utils.json_to_sheet(resumenData);
        wsResumen['!cols'] = [
            { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
            { wch: 18 }, { wch: 18 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

        const wsMetricas = XLSX.utils.json_to_sheet(metricasData);
        wsMetricas['!cols'] = [
            { wch: 25 }, { wch: 22 }, { wch: 20 }, { wch: 22 }, { wch: 25 }
        ];
        XLSX.utils.book_append_sheet(wb, wsMetricas, "Métricas Promedio");

        const wsDecisiones = XLSX.utils.json_to_sheet(decisionesExport);
        wsDecisiones['!cols'] = [
            { wch: 40 }, { wch: 20 }, { wch: 10 }, { wch: 8 },
            { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsDecisiones, "Decisiones");

        const fecha = new Date().toISOString().split('T')[0];
        const fileName = `SimGame_${playerData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${fecha}.xlsx`;

        XLSX.writeFile(wb, fileName);
        alert('✅ Archivo Excel generado exitosamente:\n' + fileName);
    } catch (error) {
        console.error('Error al exportar:', error);
        alert('❌ Error al generar el archivo Excel. Por favor intenta nuevamente.');
    }
}
