import { metricsInfo } from '../data.js';

export function render(container, state) {
    container.innerHTML = `
        <div class="header">
            <h1 class="main-title title-font">DEFINE TU ESTRATEGIA</h1>
            <p style="font-size: 1.25rem; color: #cbd5e1; margin-bottom: 8px;">
                Hola, <span style="color: #22d3ee; font-weight: 700;">${state.currentPlayer}</span>
            </p>
            <p style="color: #94a3b8;">Elige 2 métricas como tus objetivos estratégicos prioritarios</p>
        </div>

        <div class="card card-cyan" style="max-width: 800px; margin: 0 auto;">
            <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid #22d3ee; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #22d3ee; margin-bottom: 12px;">💡 ¿Por qué elegir objetivos?</h3>
                <p style="color: #e2e8f0; line-height: 1.6;">
                    En una crisis hospitalaria, <strong>no se puede optimizar todo a la vez</strong>.
                    Las decisiones que tomes serán evaluadas priorizando tus objetivos estratégicos
                    (puntúan el <strong>doble</strong>), mientras mantienes un balance en las demás métricas.
                </p>
            </div>

            <h3 style="font-size: 1.5rem; font-weight: 700; color: #22d3ee; margin-bottom: 20px;">
                Selecciona 2 Objetivos Estratégicos:
            </h3>

            <div id="objectivesGrid" style="display: grid; gap: 16px; margin-bottom: 24px;">
                ${renderObjectiveCards(state.strategicObjectives)}
            </div>

            <div id="objectivesAlert" class="alert" style="display: ${state.strategicObjectives.length !== 2 ? 'flex' : 'none'}; margin-bottom: 20px;">
                ⚠️ Debes seleccionar exactamente 2 objetivos estratégicos
            </div>

            <button class="btn btn-primary btn-full" id="confirmObjectivesBtn">
                ▶️ CONTINUAR AL JUEGO
            </button>
        </div>
    `;
}

function renderObjectiveCards(strategicObjectives) {
    return Object.entries(metricsInfo).map(([key, info]) => {
        const isSelected = strategicObjectives.includes(key);
        return `
            <div class="objective-card ${isSelected ? 'selected' : ''}" data-objective="${key}">
                <div class="objective-checkbox" id="obj-check-${key}">${isSelected ? '✓' : ''}</div>
                <div class="objective-info">
                    <div class="objective-title">${info.name}</div>
                    <div class="objective-description">${info.description}</div>
                </div>
            </div>
        `;
    }).join('');
}

export function bind(app) {
    const grid = document.getElementById('objectivesGrid');
    const confirmBtn = document.getElementById('confirmObjectivesBtn');

    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.objective-card');
        if (!card) return;
        const key = card.dataset.objective;
        app.toggleObjective(key);
    });

    confirmBtn.addEventListener('click', () => app.confirmObjectives());
}

export function updateUI(state) {
    Object.keys(metricsInfo).forEach(key => {
        const checkbox = document.getElementById(`obj-check-${key}`);
        if (!checkbox) return;
        const card = checkbox.closest('.objective-card');

        if (state.strategicObjectives.includes(key)) {
            card.classList.add('selected');
            checkbox.textContent = '✓';
        } else {
            card.classList.remove('selected');
            checkbox.textContent = '';
        }
    });

    const alert = document.getElementById('objectivesAlert');
    if (alert) {
        alert.style.display = state.strategicObjectives.length !== 2 ? 'flex' : 'none';
    }
}
