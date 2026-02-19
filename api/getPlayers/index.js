const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('GET /players - Loading players');

    // CORS
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('Storage connection string not configured');
        }

        const tableClient = TableClient.fromConnectionString(
            connectionString,
            "players"
        );

        const players = [];
        const entities = tableClient.listEntities();

        for await (const entity of entities) {
            players.push({
                name: entity.name,
                decisions: JSON.parse(entity.decisions || '[]'),
                cost: entity.cost,
                averages: JSON.parse(entity.averages || '{}'),
                overallScore: entity.overallScore,
                timestamp: entity.timestamp
            });
        }

        // Ordenar por score descendente
        players.sort((a, b) => b.overallScore - a.overallScore);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: players
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { error: 'Error al cargar jugadores', details: error.message }
        };
    }
};