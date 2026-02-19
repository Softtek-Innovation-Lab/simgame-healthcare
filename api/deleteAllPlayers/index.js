const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('DELETE /players - Resetting all players');

    // CORS
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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

        const entities = tableClient.listEntities();
        let count = 0;

        for await (const entity of entities) {
            await tableClient.deleteEntity(entity.partitionKey, entity.rowKey);
            count++;
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { success: true, message: `${count} jugadores eliminados` }
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { error: 'Error al resetear', details: error.message }
        };
    }
};