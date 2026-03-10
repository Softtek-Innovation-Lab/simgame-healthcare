import { decisionsData, decisionDescriptions, categoryColors, formatNumber } from '../data.js';

export function render(container) {
    container.innerHTML = `
        <div class="docs-modal" id="docsModal">
            <div class="docs-modal-inner">
                <button class="docs-modal-close" id="closeDocsBtn">✕</button>
                <div class="docs-modal-content">
                    <h1 style="font-family: 'Orbitron', sans-serif; font-size: 3rem; background: linear-gradient(90deg, #22d3ee, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px;">
                        📖 GUÍA DE DECISIONES
                    </h1>
                    <p style="color: #94a3b8; font-size: 1.125rem; margin-bottom: 40px;">
                        Catálogo completo de las 15 decisiones disponibles en el juego
                    </p>
                    <div id="docsContent">
                        ${renderDocsContent()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderDocsContent() {
    const categories = {
        'Tecnología AI': decisionsData.filter(d => d.categoria === 'Tecnología AI'),
        'Procesos': decisionsData.filter(d => d.categoria === 'Procesos'),
        'Experiencia Paciente': decisionsData.filter(d => d.categoria === 'Experiencia Paciente')
    };

    return Object.entries(categories).map(([catName, decisions]) => {
        const colors = categoryColors[catName];
        return `
            <div style="margin-bottom: 48px;">
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 2rem; color: ${colors.border}; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                    ${colors.icon} ${catName.toUpperCase()}
                </h2>
                
                ${decisions.map(d => {
                    const info = decisionDescriptions[d.id];
                    return `
                        <div style="background: ${colors.bg}; border: 2px solid ${colors.border}; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                                <h3 style="font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 0;">
                                    ${d.decision}
                                </h3>
                                <div style="font-size: 1.75rem; font-weight: 900; color: ${colors.border}; white-space: nowrap; margin-left: 20px;">
                                    ${formatNumber(d.costo)}
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
                                <span style="background: rgba(34, 211, 238, 0.2); border: 1px solid #22d3ee; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">NPS: ${d.nps}/5</span>
                                <span style="background: rgba(168, 85, 247, 0.2); border: 1px solid #a855f7; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Burnout: ${d.evitarBurnout}/5</span>
                                <span style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Eficiencia: ${d.eficiencia}/5</span>
                                <span style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Accuracy: ${d.accuracy}/5</span>
                                <span style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">GTM: ${d.goToMkt}/5</span>
                            </div>
                            
                            <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 12px;">
                                <strong style="color: ${colors.border};">¿Qué es?</strong><br>
                                ${info.desc}
                            </p>
                            
                            <p style="color: #cbd5e1; line-height: 1.6; font-size: 0.9rem;">
                                <strong style="color: ${colors.border};">Implicancias:</strong><br>
                                ${info.impl}
                            </p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');
}

export function bind() {
    const closeBtn = document.getElementById('closeDocsBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', handleEscape);
}

function handleEscape(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

export function openModal() {
    const modal = document.getElementById('docsModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('docsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
