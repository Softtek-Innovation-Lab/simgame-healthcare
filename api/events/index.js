const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('Events API:', req.method);

    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.method === 'OPTIONS') {
        context.res = { status: 200, headers: corsHeaders, body: '' };
        return;
    }

    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!connectionString) {
            context.res = {
                status: 500,
                headers: corsHeaders,
                body: { error: 'Storage not configured' }
            };
            return;
        }

        const tableClient = TableClient.fromConnectionString(connectionString, "events");

        try {
            await tableClient.createTable();
        } catch (e) {
            // Table already exists
        }

        // GET - Get single event by id OR list all events
        if (req.method === 'GET') {
            const eventId = req.query.id;

            if (eventId) {
                // Get single event
                context.log('GET event:', eventId);
                try {
                    const entity = await tableClient.getEntity("events", eventId);
                    const event = {
                        eventId: entity.rowKey,
                        title: entity.title,
                        subtitle: entity.subtitle,
                        eventName: entity.eventName,
                        adminUsername: entity.adminUsername,
                        adminDisplayName: entity.adminDisplayName,
                        createdAt: entity.createdAt
                    };
                    context.res = {
                        status: 200,
                        headers: corsHeaders,
                        body: event
                    };
                } catch (e) {
                    context.log('Event not found:', eventId);
                    context.res = {
                        status: 404,
                        headers: corsHeaders,
                        body: { error: 'Event not found' }
                    };
                }
                return;
            }

            // List all events
            context.log('GET: Listing all events');
            const events = [];
            const entities = tableClient.listEntities();

            for await (const entity of entities) {
                events.push({
                    eventId: entity.rowKey,
                    title: entity.title,
                    subtitle: entity.subtitle,
                    eventName: entity.eventName,
                    adminUsername: entity.adminUsername,
                    adminDisplayName: entity.adminDisplayName,
                    createdAt: entity.createdAt
                });
            }

            events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            context.res = {
                status: 200,
                headers: corsHeaders,
                body: events
            };
            return;
        }

        // POST - Create event
        if (req.method === 'POST') {
            context.log('POST: Creating event');

            const event = req.body;

            if (!event || !event.eventId || !event.title || !event.eventName) {
                context.res = {
                    status: 400,
                    headers: corsHeaders,
                    body: { error: 'Missing required fields: eventId, title, eventName' }
                };
                return;
            }

            const rowKey = event.eventId
                .toLowerCase()
                .replace(/[^a-z0-9\-]/g, '-')
                .substring(0, 100);

            const entity = {
                partitionKey: 'events',
                rowKey: rowKey,
                title: event.title || 'EXECUTIVE DECISION SIMULATION',
                subtitle: event.subtitle || '',
                eventName: event.eventName || '',
                adminUsername: event.adminUsername || '',
                adminDisplayName: event.adminDisplayName || '',
                createdAt: event.createdAt || new Date().toISOString()
            };

            await tableClient.upsertEntity(entity, "Replace");

            context.log(`Event created: ${rowKey}`);
            context.res = {
                status: 200,
                headers: corsHeaders,
                body: { success: true, eventId: rowKey, event: entity }
            };
            return;
        }

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
            body: { error: 'Internal server error', details: error.message }
        };
    }
};
