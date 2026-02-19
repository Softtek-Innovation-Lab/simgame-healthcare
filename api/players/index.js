const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request:', req.method);

    // CORS headers
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: corsHeaders,
            body: ''
        };
        return;
    }

    try {
        // Get connection string
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        
        if (!connectionString) {
            context.log.error('AZURE_STORAGE_CONNECTION_STRING not configured');
            context.res = {
                status: 500,
                headers: corsHeaders,
                body: { error: 'Storage not configured' }
            };
            return;
        }

        // Create table client
        const tableClient = TableClient.fromConnectionString(connectionString, "players");
        
        // Create table if it doesn't exist
        try {
            await tableClient.createTable();
            context.log('Table created or already exists');
        } catch (e) {
            context.log('Table already exists or error creating:', e.message);
        }

        // GET - List all players
        if (req.method === 'GET') {
            context.log('GET: Loading all players');
            
            const players = [];
            const entities = tableClient.listEntities();

            for await (const entity of entities) {
                try {
                    players.push({
                        name: entity.name,
                        decisions: JSON.parse(entity.decisions || '[]'),
                        cost: entity.cost,
                        averages: JSON.parse(entity.averages || '{}'),
                        overallScore: entity.overallScore,
                        timestamp: entity.timestamp
                    });
                } catch (parseError) {
                    context.log.error('Error parsing player:', parseError);
                }
            }

            // Sort by score
            players.sort((a, b) => b.overallScore - a.overallScore);

            context.log(`Returning ${players.length} players`);
            context.res = {
                status: 200,
                headers: corsHeaders,
                body: players
            };
            return;
        }

        // POST - Save player
        if (req.method === 'POST') {
            context.log('POST: Saving player');
            
            const player = req.body;

            if (!player || !player.name || !player.decisions || !player.averages) {
                context.res = {
                    status: 400,
                    headers: corsHeaders,
                    body: { error: 'Missing required fields: name, decisions, averages' }
                };
                return;
            }

            // Create entity
            const rowKey = player.name
                .replace(/[^a-zA-Z0-9]/g, '_')
                .substring(0, 50);

            const entity = {
                partitionKey: 'players',
                rowKey: rowKey,
                name: player.name,
                decisions: JSON.stringify(player.decisions),
                cost: player.cost || 0,
                averages: JSON.stringify(player.averages),
                overallScore: player.overallScore || 0,
                timestamp: player.timestamp || new Date().toISOString()
            };

            await tableClient.upsertEntity(entity, "Replace");
            
            context.log(`Player saved: ${player.name}`);
            context.res = {
                status: 200,
                headers: corsHeaders,
                body: { success: true, player: player }
            };
            return;
        }

        // DELETE - Remove all players
        if (req.method === 'DELETE') {
            context.log('DELETE: Removing all players');
            
            const entities = tableClient.listEntities();
            let count = 0;

            for await (const entity of entities) {
                await tableClient.deleteEntity(entity.partitionKey, entity.rowKey);
                count++;
            }

            context.log(`Deleted ${count} players`);
            context.res = {
                status: 200,
                headers: corsHeaders,
                body: { success: true, message: `${count} jugadores eliminados` }
            };
            return;
        }

        // Método no soportado
        context.res = {
            status: 405,
            headers: corsHeaders,
            body: { error: 'Method not allowed' }
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: { 
                error: 'Internal server error', 
                details: error.message 
            }
        };
    }
};