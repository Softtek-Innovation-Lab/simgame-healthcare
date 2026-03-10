import { decisionsData, metricNames, categoryColors, formatNumber, BUDGET } from '../data.js';

export function render(container, state) {
    container.innerHTML = `
        <div class="header">
            <h1 class="main-title title-font">${state.currentPlayer}</h1>
            <p style="font-size: 1.25rem; color: #cbd5e1;">Selecciona tus decisiones estratégicas</p>
        </div>

        <div class="card card-cyan">
            <div class="stats-grid">
                <div class="stat-card" style="border-color: #64748b;">
                    <p class="stat-label">Créditos Totales</p>
                    <p class="stat-value">10,000</p>
                </div>
                <div class="stat-card" style="border-color: #22d3ee;">
                    <p class="stat-label">Gastado</p>
                    <p class="stat-value" id="costUsed">0</p>
                </div>
                <div class="stat-card" style="border-color: #10b981;">
                    <p class="stat-label">Disponible</p>
                    <p class="stat-value" id="costRemaining">10,000</p>
                </div>
                <div class="stat-card" style="border-color: #a855f7;">
                    <p class="stat-label">Jugadores</p>
                    <p class="stat-value" id="gamePlayerCount">${state.allPlayers.length}</p>
                </div>
            </div>
            <div id="budgetAlert" class="alert" style="display: none;">
                ⚠️ ¡Presupuesto excedido! Reduce tus decisiones.
            </div>
        </div>

        <div id="decisionsContainer">
            ${renderDecisions(state)}
        </div>

        <div class="btn-group">
            <button class="btn btn-primary" id="submitResultsBtn">
                VER MIS RESULTADOS
            </button>
            <button class="btn btn-secondary" id="resetGameBtn">
                REINICIAR
            </button>
            <button class="btn" id="openDocsBtn" style="background: linear-gradient(90deg, #10b981, #059669); color: white;">
                📖 GUÍA DE DECISIONES
            </button>
        </div>
    `;
}

function createMetricBar(metricName, value) {
    return `
        <div class="metric-row">
            <span class="metric-label">${metricNames[metricName]}</span>
            <div class="metric-bar-container">
                <div class="metric-bar level-${value}"></div>
            </div>
            <span class="metric-value">${value}</span>
        </div>
    `;
}

function renderDecisions(state) {
    const categories = {};
    decisionsData.forEach(d => {
        if (!categories[d.categoria]) categories[d.categoria] = [];
        categories[d.categoria].push(d);
    });

    const totalCost = state.selectedDecisions.reduce((sum, id) => {
        const dec = decisionsData.find(dd => dd.id === id);
        return sum + dec.costo;
    }, 0);

    return Object.entries(categories).map(([cat, decisions]) => `
        <div class="category-section">
            <h2 class="category-title title-font">
                <div class="category-dot" style="background: ${categoryColors[cat].dot};"></div>
                ${cat.toUpperCase()}
            </h2>
            <div class="decisions-grid">
                ${decisions.map(d => {
                    const isSelected = state.selectedDecisions.includes(d.id);
                    const canAfford = (totalCost + d.costo <= BUDGET) || isSelected;

                    return `
                        <div 
                            class="decision-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}" 
                            style="border-color: ${isSelected ? 'white' : categoryColors[cat].border};"
                            data-decision-id="${d.id}"
                            data-can-afford="${canAfford}"
                        >
                            <div class="decision-header">
                                <div class="checkbox ${isSelected ? 'checked' : ''}"></div>
                                <div class="decision-cost">
                                    ${formatNumber(d.costo)}
                                </div>
                            </div>
                            <div class="decision-title">
                                ${d.decision}
                            </div>
                            <div class="decision-metrics">
                                ${createMetricBar('nps', d.nps)}
                                ${createMetricBar('evitarBurnout', d.evitarBurnout)}
                                ${createMetricBar('eficiencia', d.eficiencia)}
                                ${createMetricBar('accuracy', d.accuracy)}
                                ${createMetricBar('goToMkt', d.goToMkt)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

export function bind(app) {
    const container = document.getElementById('decisionsContainer');
    const submitBtn = document.getElementById('submitResultsBtn');
    const resetBtn = document.getElementById('resetGameBtn');
    const docsBtn = document.getElementById('openDocsBtn');

    container.addEventListener('click', (e) => {
        const card = e.target.closest('.decision-card');
        if (!card) return;
        if (card.dataset.canAfford === 'false') return;
        const id = parseInt(card.dataset.decisionId);
        app.toggleDecision(id);
    });

    submitBtn.addEventListener('click', () => app.submitResults());
    resetBtn.addEventListener('click', () => app.resetSelections());
    docsBtn.addEventListener('click', () => app.openDocsModal());
}

export function refreshDecisions(state) {
    const container = document.getElementById('decisionsContainer');
    if (container) {
        container.innerHTML = renderDecisions(state);
    }
    updateCosts(state);
}

export function updateCosts(state) {
    const totalCost = state.selectedDecisions.reduce((sum, id) => {
        const d = decisionsData.find(dd => dd.id === id);
        return sum + d.costo;
    }, 0);

    const costUsedEl = document.getElementById('costUsed');
    const costRemainingEl = document.getElementById('costRemaining');
    const alertEl = document.getElementById('budgetAlert');

    if (costUsedEl) {
        costUsedEl.textContent = formatNumber(totalCost);
        costUsedEl.style.color = totalCost > BUDGET ? '#ef4444' : '#22d3ee';
    }

    if (costRemainingEl) {
        const remaining = BUDGET - totalCost;
        costRemainingEl.textContent = formatNumber(remaining);
        costRemainingEl.style.color = remaining < 0 ? '#ef4444' : '#10b981';
    }

    if (alertEl) {
        alertEl.style.display = totalCost > BUDGET ? 'flex' : 'none';
    }
}
