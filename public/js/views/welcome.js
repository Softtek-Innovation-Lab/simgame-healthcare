import { loadPlayers } from '../api.js';

export function render(container, state) {
    const config = state.eventConfig || {};
    const title = config.title || 'EXECUTIVE DECISION SIMULATION';
    const subtitle = config.subtitle || '';
    const eventName = config.eventName || '';

    container.innerHTML = `
        <div class="header">
            <h1 class="main-title title-font">${title}</h1>
            ${subtitle ? `<p style="font-size: 1.5rem; color: #cbd5e1; margin-bottom: 8px;">${subtitle}</p>` : ''}
            ${eventName ? `<p style="color: #94a3b8;">${eventName}</p>` : ''}
        </div>

        <div class="card card-cyan" style="max-width: 600px; margin: 0 auto;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="font-size: 2rem;">👥</div>
                <div>
                    <p style="font-size: 1.125rem; font-weight: 700; color: #cbd5e1;">Jugadores registrados</p>
                    <p style="font-size: 3rem; font-weight: 900;" id="playerCount">0</p>
                </div>
            </div>

            <div class="input-group">
                <label for="playerName">Ingresa tu nombre para comenzar:</label>
                <input type="text" id="playerName" placeholder="Ej: María García" autocomplete="off">
            </div>

            <div class="card" style="max-width: 900px; margin: 0 auto 40px;">
                <h3 style="color: #22d3ee; font-size: 1.5rem; margin-bottom: 16px;">
                    🎮 ¿Cómo se juega?
                </h3>
                <div style="color: #e2e8f0; line-height: 1.8; font-size: 1.125rem;">
                    <p style="margin-bottom: 16px;">
                        <strong style="color: #fbbf24;">Tu misión:</strong> Eres el Director de Guardia durante una
                        crisis hospitalaria.
                        Tienes <strong>10,000 créditos</strong> para invertir en decisiones estratégicas que mejoren
                        5 métricas clave: Satisfacción del Paciente (NPS), Bienestar del Staff (Burnout),
                        Eficiencia Operativa, Precisión Médica (Accuracy) y Velocidad de Implementación
                        (Go-to-Market).
                    </p>
                    <p style="margin-bottom: 16px;">
                        <strong style="color: #fbbf24;">La clave del éxito:</strong> No se puede optimizar todo a la vez.
                        Al inicio elegirás <strong>2 objetivos estratégicos</strong> que serán tus prioridades.
                        Las decisiones que fortalezcan esos objetivos <strong style="color: #22d3ee;">puntúan el
                            doble</strong>,
                        pero descuidar las demás métricas también afecta tu score.
                    </p>
                </div>
            </div>

            <button class="btn btn-primary btn-full" id="startGameBtn">
                ▶️ COMENZAR A JUGAR
            </button>

            <button class="btn btn-secondary btn-full" style="margin-top: 12px;" id="toggleLeaderboardBtn">
                🏆 <span id="leaderboardToggle">Ver</span> Ranking
            </button>

            <div id="welcomeLeaderboard" style="margin-top: 24px; display: none;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #22d3ee; margin-bottom: 16px;">🏆 Ranking Actual</h3>
                <div id="welcomeRankingList"></div>
            </div>
        </div>
    `;
}

export function bind(app) {
    const startBtn = document.getElementById('startGameBtn');
    const toggleBtn = document.getElementById('toggleLeaderboardBtn');
    const nameInput = document.getElementById('playerName');

    startBtn.addEventListener('click', () => app.startGame());
    toggleBtn.addEventListener('click', () => toggleLeaderboard());
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') app.startGame();
    });
}

export async function updatePlayerCount(allPlayers) {
    const el = document.getElementById('playerCount');
    if (el) el.textContent = allPlayers.length;
}

async function toggleLeaderboard() {
    const lb = document.getElementById('welcomeLeaderboard');
    const toggle = document.getElementById('leaderboardToggle');
    if (lb.style.display === 'none') {
        lb.style.display = 'block';
        toggle.textContent = 'Ocultar';
        await renderLeaderboard();
    } else {
        lb.style.display = 'none';
        toggle.textContent = 'Ver';
    }
}

async function renderLeaderboard() {
    const container = document.getElementById('welcomeRankingList');
    const allPlayers = await loadPlayers();

    if (allPlayers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b;">Aún no hay jugadores</p>';
        return;
    }

    container.innerHTML = allPlayers.map((player, idx) => `
        <div style="background: rgba(15, 23, 42, 0.5); border: 2px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.5rem; font-weight: 900; color: ${idx === 0 ? '#fbbf24' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#d97706' : '#64748b'}">
                    ${idx + 1}°
                </span>
                <span style="font-weight: 600;">${player.name}</span>
            </div>
            <span style="font-size: 1.5rem; font-weight: 900; color: #22d3ee;">${player.overallScore}</span>
        </div>
    `).join('');
}
