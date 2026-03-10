let _eventId = null;

export function setEventId(eventId) {
    _eventId = eventId;
}

export function getEventId() {
    return _eventId;
}

// ========================================
// Events API
// ========================================

export async function getEvent(eventId) {
    try {
        const response = await fetch(`/api/events?id=${encodeURIComponent(eventId)}`);

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading event:', error);
        return null;
    }
}

export async function listEvents() {
    try {
        const response = await fetch('/api/events');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error listing events:', error);
        return [];
    }
}

export async function createEvent(eventData) {
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error al crear evento. Verifica tu conexión.');
        throw error;
    }
}

// ========================================
// Players API (scoped by eventId)
// ========================================

export async function savePlayer(playerData) {
    try {
        const response = await fetch(`/api/players?event=${encodeURIComponent(_eventId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving player:', error);
        alert('Error al guardar resultados. Verifica tu conexión.');
        throw error;
    }
}

export async function loadPlayers() {
    try {
        const response = await fetch(`/api/players?event=${encodeURIComponent(_eventId)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading players:', error);
        return [];
    }
}

export async function deleteAllPlayers() {
    try {
        const response = await fetch(`/api/players?event=${encodeURIComponent(_eventId)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting players:', error);
        alert('Error al resetear. Verifica tu conexión.');
        throw error;
    }
}
