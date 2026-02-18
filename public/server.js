// server.js - Backend Node.js para SimGame multiplayer
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'players.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar archivo de datos
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}

// Leer jugadores
async function readPlayers() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Escribir jugadores
async function writePlayers(players) {
    await fs.writeFile(DATA_FILE, JSON.stringify(players, null, 2));
}

// ENDPOINTS

// GET /api/players - Obtener todos los jugadores
app.get('/api/players', async (req, res) => {
    try {
        const players = await readPlayers();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer jugadores' });
    }
});

// POST /api/players - Guardar/actualizar jugador
app.post('/api/players', async (req, res) => {
    try {
        const playerData = req.body;
        
        if (!playerData.name || !playerData.decisions || !playerData.averages) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const players = await readPlayers();
        const existingIndex = players.findIndex(p => p.name === playerData.name);
        
        if (existingIndex >= 0) {
            players[existingIndex] = playerData;
        } else {
            players.push(playerData);
        }
        
        await writePlayers(players);
        res.json({ success: true, player: playerData });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar jugador' });
    }
});

// DELETE /api/players - Resetear todos los jugadores
app.delete('/api/players', async (req, res) => {
    try {
        await writePlayers([]);
        res.json({ success: true, message: 'Todos los jugadores eliminados' });
    } catch (error) {
        res.status(500).json({ error: 'Error al resetear' });
    }
});

// GET /api/ranking - Obtener ranking ordenado
app.get('/api/ranking', async (req, res) => {
    try {
        const players = await readPlayers();
        const ranked = players.sort((a, b) => b.overallScore - a.overallScore);
        res.json(ranked);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ranking' });
    }
});

// Iniciar servidor
initDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`🎮 SimGame Server running on http://localhost:${PORT}`);
    });
});
