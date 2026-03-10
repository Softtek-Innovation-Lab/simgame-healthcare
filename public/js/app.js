import { loadPlayers, savePlayer, getEvent, setEventId } from './api.js';
import { BUDGET, decisionsData, calculateAverages } from './data.js';
import * as welcomeView from './views/welcome.js';
import * as objectivesView from './views/objectives.js';
import * as gameView from './views/game.js';
import * as resultsView from './views/results.js';
import * as docsView from './views/docs.js';

// ========================================
// Application State
// ========================================
const state = {
    currentPlayer: '',
    selectedDecisions: [],
    strategicObjectives: [],
    allPlayers: [],
    currentScreen: 'welcome',
    eventId: null,
    eventConfig: null  // { eventId, title, subtitle, eventName, adminUsername, adminDisplayName }
};

// ========================================
// App object exposed to views
// ========================================
const app = {
    state,
    showScreen,
    startGame,
    toggleObjective,
    confirmObjectives,
    toggleDecision,
    submitResults,
    resetSelections,
    openDocsModal,
    playAgain,
    exportToExcel,
    updateRanking,
};

// ========================================
// Screen Management
// ========================================
const mainContainer = () => document.getElementById('app');
const docsContainer = () => document.getElementById('docsOverlay');

async function showScreen(screen) {
    state.currentScreen = screen;
    const container = mainContainer();

    switch (screen) {
        case 'welcome':
            welcomeView.render(container, state);
            welcomeView.bind(app);
            state.allPlayers = await loadPlayers();
            welcomeView.updatePlayerCount(state.allPlayers);
            break;

        case 'objectives':
            objectivesView.render(container, state);
            objectivesView.bind(app);
            break;

        case 'game':
            gameView.render(container, state);
            gameView.bind(app);
            gameView.updateCosts(state);
            break;

        case 'results':
            // playerData should be set before calling showScreen('results')
            break;

        case 'eventNotFound':
            renderEventNotFound(container);
            break;
    }
}

function renderEventNotFound(container) {
    const eventId = new URLSearchParams(window.location.search).get('event') || '(none)';
    container.innerHTML = `
        <div class="header">
            <h1 class="main-title title-font">EVENTO NO ENCONTRADO</h1>
            <p style="font-size: 1.25rem; color: #cbd5e1; margin-bottom: 24px;">
                El evento <span style="color: #ef4444; font-weight: 700;">"${eventId}"</span> no existe.
            </p>
        </div>
        <div class="card card-cyan" style="max-width: 600px; margin: 0 auto; text-align: center;">
            <p style="color: #e2e8f0; font-size: 1.125rem; line-height: 1.6; margin-bottom: 24px;">
                Verifica el link que recibiste o contacta al organizador del evento.
            </p>
            <p style="color: #64748b; font-size: 0.875rem;">
                Si eres administrador, puedes crear un evento usando el panel de admin.
            </p>
        </div>
    `;
}

async function showResults(playerData) {
    state.allPlayers = await loadPlayers();
    const container = mainContainer();
    resultsView.render(container, state, playerData);
    resultsView.bind(app);
}

// ========================================
// Game Flow
// ========================================
function startGame() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
        alert('Por favor ingresa tu nombre');
        return;
    }

    state.currentPlayer = name;
    state.selectedDecisions = [];
    state.strategicObjectives = [];

    showScreen('objectives');
}

function toggleObjective(key) {
    const index = state.strategicObjectives.indexOf(key);

    if (index > -1) {
        state.strategicObjectives.splice(index, 1);
    } else {
        if (state.strategicObjectives.length < 2) {
            state.strategicObjectives.push(key);
        } else {
            state.strategicObjectives.shift();
            state.strategicObjectives.push(key);
        }
    }

    objectivesView.updateUI(state);
}

function confirmObjectives() {
    if (state.strategicObjectives.length !== 2) {
        alert('Debes seleccionar exactamente 2 objetivos estratégicos');
        return;
    }

    showScreen('game');
}

function toggleDecision(id) {
    const idx = state.selectedDecisions.indexOf(id);
    if (idx > -1) {
        state.selectedDecisions.splice(idx, 1);
    } else {
        state.selectedDecisions.push(id);
    }

    gameView.refreshDecisions(state);
}

async function submitResults() {
    if (state.selectedDecisions.length === 0) {
        alert('Debes seleccionar al menos una decisión');
        return;
    }

    const totalCost = state.selectedDecisions.reduce((sum, id) => {
        const d = decisionsData.find(dd => dd.id === id);
        return sum + d.costo;
    }, 0);

    if (totalCost > BUDGET) {
        alert('Has excedido el presupuesto. Reduce tus decisiones.');
        return;
    }

    const averages = calculateAverages(state.selectedDecisions);
    const overallScore = parseFloat(
        (Object.values(averages).reduce((a, b) => a + b, 0) / Object.values(averages).length).toFixed(2)
    );

    const playerData = {
        name: state.currentPlayer,
        decisions: state.selectedDecisions,
        cost: totalCost,
        averages: averages,
        overallScore: overallScore,
        strategicObjectives: state.strategicObjectives,
        timestamp: new Date().toISOString()
    };

    await savePlayer(playerData);
    await showResults(playerData);
}

function resetSelections() {
    if (confirm('¿Quieres reiniciar tus selecciones?')) {
        state.selectedDecisions = [];
        gameView.refreshDecisions(state);
    }
}

function openDocsModal() {
    docsView.openModal();
}

function playAgain() {
    state.selectedDecisions = [];
    showScreen('game');
}

function exportToExcel() {
    resultsView.exportToExcel(state);
}

async function updateRanking() {
    state.allPlayers = await loadPlayers();
    const playerData = state.allPlayers.find(p => p.name === state.currentPlayer);
    if (playerData) {
        await showResults(playerData);
        alert('¡Ranking actualizado!');
    }
}

// ========================================
// Initialization
// ========================================
async function init() {
    // Read event ID from URL
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');

    if (!eventId) {
        const container = mainContainer();
        container.innerHTML = `
            <div class="header">
                <h1 class="main-title title-font">EXECUTIVE DECISION SIMULATION</h1>
                <p style="font-size: 1.25rem; color: #cbd5e1; margin-bottom: 24px;">
                    No se especificó un evento. Agrega <code style="color: #22d3ee;">?event=tu-evento-id</code> a la URL.
                </p>
            </div>
            <div class="card card-cyan" style="max-width: 600px; margin: 0 auto; text-align: center;">
                <p style="color: #e2e8f0; font-size: 1.125rem; margin-bottom: 16px;">
                    Contacta al organizador para obtener el link del evento.
                </p>
            </div>
        `;
        return;
    }

    // Set event ID in API module
    setEventId(eventId);
    state.eventId = eventId;

    // Fetch event config from API
    const eventConfig = await getEvent(eventId);

    if (!eventConfig) {
        showScreen('eventNotFound');
        return;
    }

    state.eventConfig = eventConfig;

    // Render docs modal (always available)
    const docsOverlay = docsContainer();
    docsView.render(docsOverlay);
    docsView.bind();

    // Show welcome screen
    await showScreen('welcome');
}

init();
