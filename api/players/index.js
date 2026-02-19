const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('POST /players - Saving player');

    // CORS
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

        await tableClient.createTable().catch(() => {}); // Crear tabla si no existe

        const player = req.body;

        if (!player.name || !player.decisions || !player.averages) {
            context.res = {
                status: 400,
                body: { error: 'Datos incompletos' }
            };
            return;
        }

        // Sanitizar nombre para usarlo como RowKey
        const rowKey = player.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);

        const entity = {
            partitionKey: 'players',
            rowKey: rowKey,
            name: player.name,
            decisions: JSON.stringify(player.decisions),
            cost: player.cost,
            averages: JSON.stringify(player.averages),
            overallScore: player.overallScore,
            timestamp: player.timestamp || new Date().toISOString()
        };

        await tableClient.upsertEntity(entity, "Replace");

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { success: true, player }
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { error: 'Error interno', details: error.message }
        };
    }
};