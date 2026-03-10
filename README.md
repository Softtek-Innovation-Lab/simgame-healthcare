# SimGame Healthcare — Executive Decision Simulation

An interactive multiplayer business simulation game where participants role-play as hospital emergency directors during a crisis, making strategic investment decisions to optimize healthcare operations.

Built for **Softtek Discovery** workshop events.

## 🎮 How It Works

1. **Welcome** — Players enter their name and join an event
2. **Strategy** — Choose 2 of 5 strategic objectives (scored at 2x weight)
3. **Decisions** — Allocate a 10,000 credit budget across 15 decision cards in 3 categories:
   - 🤖 **AI Technology** — High accuracy/efficiency, slow to implement
   - 🔄 **Processes** — Balanced impact across all metrics
   - 👥 **Patient Experience** — High NPS, fast to implement
4. **Results** — See your score, charts, strategic analysis, and live leaderboard

### Metrics

| Metric | Description |
|--------|-------------|
| **NPS** | Patient Satisfaction |
| **Burnout** | Staff Wellbeing |
| **Efficiency** | Operational Optimization |
| **Accuracy** | Medical Precision |
| **Go-to-Market** | Implementation Speed |

## 🏗️ Architecture

```
public/                    ← Frontend (Azure Static Web Apps)
├── index.html             ← Minimal shell
├── admin.html             ← Admin panel (event management)
├── css/styles.css         ← All styles
├── js/
│   ├── app.js             ← Main orchestrator (state, navigation, game flow)
│   ├── api.js             ← API layer (events + players, scoped by eventId)
│   ├── data.js            ← Constants (decisions, metrics, helpers)
│   └── views/
│       ├── welcome.js     ← Welcome screen
│       ├── objectives.js  ← Strategy selection
│       ├── game.js        ← Decision cards + budget tracking
│       ├── results.js     ← Charts, ranking, Excel export
│       ├── admin.js       ← Admin view (legacy, used by in-event admin)
│       └── docs.js        ← Decision guide modal

api/                       ← Backend (Azure Functions, Node.js)
├── events/                ← Events CRUD API
│   ├── function.json
│   └── index.js
├── players/               ← Players API (scoped by event)
│   ├── function.json
│   └── index.js
├── host.json
└── package.json
```

### Multi-Event System

Each event is fully isolated with its own players and leaderboard:

- **Events** stored in Azure Table Storage (`events` table)
- **Players** stored with `eventId` as `partitionKey` (`players` table)
- **URL routing**: `/?event=colombia-mar-2026` → specific event
- **Admin panel**: `/admin.html` → create/manage events

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events?id=xxx` | Get event config |
| `GET` | `/api/events` | List all events |
| `POST` | `/api/events` | Create event |
| `GET` | `/api/players?event=xxx` | Get players for event |
| `POST` | `/api/players?event=xxx` | Save player result |
| `DELETE` | `/api/players?event=xxx` | Reset event players |

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [SWA CLI](https://github.com/Azure/static-web-apps-cli)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Softtek-Innovation-Lab/simgame-healthcare.git
   cd simgame-healthcare
   ```

2. Install API dependencies:
   ```bash
   cd api && npm install && cd ..
   ```

3. Create `api/local.settings.json`:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "AZURE_STORAGE_CONNECTION_STRING": "<your-azure-storage-connection-string>"
     },
     "Host": {
       "CORS": "*"
     }
   }
   ```

4. Run locally:
   ```bash
   swa start public --api-location api
   ```

5. Open `http://localhost:4280/?event=your-event-id`

### Creating Your First Event

Via the admin panel:
1. Go to `http://localhost:4280/admin.html`
2. Enter the admin code
3. Fill in event ID + name → Create

Or via curl:
```bash
curl -X POST http://localhost:4280/api/events \
  -H "Content-Type: application/json" \
  -d '{"eventId":"my-event","title":"EXECUTIVE DECISION SIMULATION","subtitle":"Your subtitle","eventName":"Event Name - Date","adminUsername":"yourusername","adminDisplayName":"YourName"}'
```

## 📦 Deployment

Deployed as an **Azure Static Web App**. Push to `master` triggers the GitHub Actions workflow.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (ES Modules), Chart.js, SheetJS
- **Backend**: Azure Functions (Node.js)
- **Storage**: Azure Table Storage
- **Hosting**: Azure Static Web Apps
- **Fonts**: Orbitron + JetBrains Mono
