import { loadPlayers, deleteAllPlayers, createEvent, listEvents } from '../api.js';
import { formatNumber } from '../data.js';

export function render(container, state) {
    const config = state.eventConfig || {};
    const adminName = config.adminDisplayName || 'Admin';
    const eventName = config.eventName || state.eventId || 'Unknown';

    container.innerHTML = `
        <div class="header">
            <h1 class="main-title title-font">🔧 PANEL DE ADMINISTRACIÓN</h1>
            <p style="font-size: 1.25rem; color: #cbd5e1;">
                Bienvenido, <span style="color: #fbbf24; font-weight: 700;">${adminName}</span>
            </p>
            <p style="color: #94a3b8; margin-top: 4px;">
                Evento: <span style="color: #22d3ee;">${eventName}</span>
            </p>
        </div>

        <div class="card card-cyan" style="max-width: 800px; margin: 0 auto;">
            <div style="display: grid; gap: 20px; margin-bottom: 24px;">
                <!-- Stats Admin -->
                <div style="background: rgba(34, 211, 238, 0.1); border: 2px solid #22d3ee; border-radius: 12px; padding: 20px;">
                    <h3 style="color: #22d3ee; margin-bottom: 16px; font-size: 1.25rem;">📊 Estado del Juego</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                        <div>
                            <div style="font-size: 0.875rem; color: #94a3b8;">Jugadores Totales</div>
                            <div style="font-size: 2rem; font-weight: 900; color: #22d3ee;" id="adminPlayerCount">${state.allPlayers.length}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.875rem; color: #94a3b8;">Score Promedio</div>
                            <div style="font-size: 2rem; font-weight: 900; color: #22d3ee;" id="adminAvgScore">${getAvgScore(state.allPlayers)}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.875rem; color: #94a3b8;">Presupuesto Promedio</div>
                            <div style="font-size: 2rem; font-weight: 900; color: #22d3ee;" id="adminAvgCost">${getAvgCost(state.allPlayers)}</div>
                        </div>
                    </div>
                </div>

                <!-- Ranking -->
                <div style="background: rgba(251, 191, 36, 0.1); border: 2px solid #fbbf24; border-radius: 12px; padding: 20px;">
                    <h3 style="color: #fbbf24; margin-bottom: 16px; font-size: 1.25rem;">🏆 Top 5 Jugadores</h3>
                    <div id="adminTopPlayers">
                        ${renderTopPlayers(state.allPlayers)}
                    </div>
                </div>
            </div>

            <!-- Create Event Section -->
            <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #10b981; margin-bottom: 16px; font-size: 1.25rem;">🆕 Crear Nuevo Evento</h3>
                <div style="display: grid; gap: 12px;">
                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="newEventId" style="font-size: 0.875rem;">ID del Evento (slug para la URL)</label>
                        <input type="text" id="newEventId" placeholder="ej: mexico-apr-2026" style="padding: 12px;">
                    </div>
                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="newEventTitle" style="font-size: 0.875rem;">Título Principal</label>
                        <input type="text" id="newEventTitle" placeholder="EXECUTIVE DECISION SIMULATION" style="padding: 12px;">
                    </div>
                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="newEventSubtitle" style="font-size: 0.875rem;">Subtítulo</label>
                        <input type="text" id="newEventSubtitle" placeholder="Diseñando el Hospital del futuro..." style="padding: 12px;">
                    </div>
                    <div class="input-group" style="margin-bottom: 0;">
                        <label for="newEventName" style="font-size: 0.875rem;">Nombre del Evento + Fecha</label>
                        <input type="text" id="newEventName" placeholder="Softtek Discovery México - 01-abr-2026" style="padding: 12px;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="input-group" style="margin-bottom: 0;">
                            <label for="newAdminUsername" style="font-size: 0.875rem;">Usuario Admin</label>
                            <input type="text" id="newAdminUsername" placeholder="ej: juanperez" style="padding: 12px;">
                        </div>
                        <div class="input-group" style="margin-bottom: 0;">
                            <label for="newAdminDisplayName" style="font-size: 0.875rem;">Nombre Admin</label>
                            <input type="text" id="newAdminDisplayName" placeholder="ej: Juan" style="padding: 12px;">
                        </div>
                    </div>
                    <button class="btn btn-success btn-full" id="createEventBtn">
                        ✨ CREAR EVENTO
                    </button>
                    <div id="createEventResult" style="display: none;"></div>
                </div>
            </div>

            <!-- Event List -->
            <div style="background: rgba(168, 85, 247, 0.1); border: 2px solid #a855f7; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #a855f7; margin-bottom: 16px; font-size: 1.25rem;">📋 Todos los Eventos</h3>
                <div id="eventsList">
                    <p style="color: #64748b; text-align: center;">Cargando...</p>
                </div>
            </div>

            <!-- Danger zone -->
            <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #ef4444; margin-bottom: 16px; font-size: 1.25rem;">⚠️ Zona Peligrosa</h3>
                <button class="btn btn-full" id="adminResetBtn" style="background: linear-gradient(90deg, #ef4444, #dc2626); color: white; margin-bottom: 12px;">
                    🗑️ RESETEAR JUGADORES DE ESTE EVENTO
                </button>
                <p style="color: #94a3b8; font-size: 0.875rem; margin: 0;">
                    Solo elimina los jugadores del evento actual (<strong style="color: #ef4444;">${state.eventId}</strong>). Otros eventos no se ven afectados.
                </p>
            </div>

            <!-- Navigation -->
            <div class="btn-group">
                <button class="btn btn-primary" id="adminPlayBtn">
                    🎮 JUGAR NORMALMENTE
                </button>
                <button class="btn btn-secondary" id="adminViewRankingBtn">
                    👀 VER RANKING COMPLETO
                </button>
                <button class="btn btn-secondary" id="adminBackBtn">
                    ← VOLVER AL INICIO
                </button>
            </div>
        </div>
    `;

    // Load events list
    loadEventsList();
}

function getAvgScore(allPlayers) {
    if (allPlayers.length === 0) return '0.00';
    return (allPlayers.reduce((sum, p) => sum + p.overallScore, 0) / allPlayers.length).toFixed(2);
}

function getAvgCost(allPlayers) {
    if (allPlayers.length === 0) return '0';
    return formatNumber(Math.round(allPlayers.reduce((sum, p) => sum + p.cost, 0) / allPlayers.length));
}

function renderTopPlayers(allPlayers) {
    if (allPlayers.length === 0) {
        return '<p style="color: #64748b; text-align: center;">No hay jugadores aún</p>';
    }

    return allPlayers.slice(0, 5).map((player, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.5rem; font-weight: 900; color: ${idx === 0 ? '#fbbf24' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#d97706' : '#64748b'}; min-width: 30px;">
                    ${idx + 1}°
                </span>
                <div>
                    <div style="font-weight: 700; color: #e2e8f0;">${player.name}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">
                        ${player.decisions.length} decisiones • ${formatNumber(player.cost)} créditos
                    </div>
                </div>
            </div>
            <span style="font-size: 1.5rem; font-weight: 900; color: #fbbf24;">
                ${player.overallScore}
            </span>
        </div>
    `).join('');
}

async function loadEventsList() {
    const container = document.getElementById('eventsList');
    if (!container) return;

    try {
        const events = await listEvents();

        if (events.length === 0) {
            container.innerHTML = '<p style="color: #64748b; text-align: center;">No hay eventos creados</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; margin-bottom: 8px;">
                <div>
                    <div style="font-weight: 700; color: #e2e8f0;">${event.eventName || event.eventId}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">
                        ID: ${event.eventId} • Admin: ${event.adminDisplayName || 'N/A'}
                    </div>
                </div>
                <a href="?event=${encodeURIComponent(event.eventId)}" 
                   style="color: #22d3ee; font-weight: 700; font-size: 0.875rem; text-decoration: none;"
                   target="_blank">
                    🔗 Abrir
                </a>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p style="color: #ef4444; text-align: center;">Error cargando eventos</p>';
    }
}

export function bind(app) {
    document.getElementById('adminResetBtn').addEventListener('click', () => adminReset(app));
    document.getElementById('adminPlayBtn').addEventListener('click', () => app.adminPlayNormal());
    document.getElementById('adminViewRankingBtn').addEventListener('click', () => app.adminViewRanking());
    document.getElementById('adminBackBtn').addEventListener('click', () => app.showScreen('welcome'));
    document.getElementById('createEventBtn').addEventListener('click', () => handleCreateEvent());
}

async function handleCreateEvent() {
    const eventId = document.getElementById('newEventId').value.trim();
    const title = document.getElementById('newEventTitle').value.trim();
    const subtitle = document.getElementById('newEventSubtitle').value.trim();
    const eventName = document.getElementById('newEventName').value.trim();
    const adminUsername = document.getElementById('newAdminUsername').value.trim();
    const adminDisplayName = document.getElementById('newAdminDisplayName').value.trim();

    if (!eventId || !eventName) {
        alert('El ID del evento y el nombre del evento son obligatorios');
        return;
    }

    try {
        const result = await createEvent({
            eventId,
            title: title || 'EXECUTIVE DECISION SIMULATION',
            subtitle,
            eventName,
            adminUsername,
            adminDisplayName
        });

        const resultDiv = document.getElementById('createEventResult');
        const eventUrl = `${window.location.origin}?event=${encodeURIComponent(result.eventId)}`;

        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin-top: 12px;">
                <p style="color: #10b981; font-weight: 700; margin-bottom: 8px;">✅ Evento creado exitosamente!</p>
                <p style="color: #e2e8f0; font-size: 0.875rem; margin-bottom: 8px;">Comparte este link con los participantes:</p>
                <div style="background: #1e293b; padding: 12px; border-radius: 6px; word-break: break-all;">
                    <a href="${eventUrl}" style="color: #22d3ee; text-decoration: none; font-weight: 600;">${eventUrl}</a>
                </div>
            </div>
        `;

        // Clear form
        document.getElementById('newEventId').value = '';
        document.getElementById('newEventTitle').value = '';
        document.getElementById('newEventSubtitle').value = '';
        document.getElementById('newEventName').value = '';
        document.getElementById('newAdminUsername').value = '';
        document.getElementById('newAdminDisplayName').value = '';

        // Refresh events list
        await loadEventsList();
    } catch (error) {
        console.error('Error creating event:', error);
    }
}

async function adminReset(app) {
    const confirmation = prompt(
        `⚠️ CONFIRMACIÓN REQUERIDA\n\n` +
        `Esto eliminará TODOS los jugadores del evento:\n` +
        `"${app.state.eventId}"\n\n` +
        `No se puede deshacer.\n\n` +
        `Para confirmar, escribe: RESET`
    );

    if (confirmation === 'RESET') {
        await deleteAllPlayers();
        app.state.allPlayers = [];
        alert('✅ Todos los jugadores de este evento han sido eliminados');
        app.showScreen('admin');
    } else if (confirmation !== null) {
        alert('❌ Cancelado. Debes escribir exactamente: RESET');
    }
}
