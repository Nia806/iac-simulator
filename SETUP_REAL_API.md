# IaC Simulator - Complete Setup Guide

This guide covers setting up and running the IaC Simulator with the new React frontend and real-time backend API.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│           NGINX (Port 8081)                             │
│  - Serves React Frontend                                │
│  - Static files from ./frontend/dist (after build)      │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    React Frontend (Port 3000)        │
        │  - Dashboard, Graph, Simulation      │
        │  - Fetches from Backend API          │
        └─────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│      Backend API (Port 3001)                            │
│  - Real container metrics & status                      │
│  - Log aggregation from services                        │
│  - Terraform state exposure                            │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    Docker Services                  │
        ├─────────────────────────────────────┤
        │ • Postgres (Port 5432)              │
        │ • Redis (Port 6379)                 │
        │ • Docker Network: iac-network       │
        └─────────────────────────────────────┘
```

## Quick Start

### 1. Build the Frontend

```bash
cd frontend
npm install
npm run build
```

Output: Creates `frontend/dist/` with production-ready files

### 2. Start All Services with Docker Compose

```bash
docker-compose up -d
```

Services started:
- **NGINX** (Frontend) → http://localhost:8081
- **Backend API** → http://localhost:3001/api
- **Postgres** → localhost:5432 (iac_simulator database)
- **Redis** → localhost:6379

### 3. Verify Services

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Test backend API
curl http://localhost:3001/api/health
```

### 4. Access the Frontend

Open browser: **http://localhost:8081**

## Development Setup

If you want to develop with hot reload:

### Terminal 1: Start Services (without frontend)

```bash
docker-compose up -d postgres redis backend
```

### Terminal 2: Run Frontend Dev Server

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Terminal 3 (Optional): Watch Backend

```bash
cd backend
npm run dev
```

## File Structure

```
iac-simulator/
├── docker-compose.yml          # Main orchestration config
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks (useDashboardData)
│   │   ├── context/           # Theme & Simulation contexts
│   │   └── utils/             # Data transformation
│   ├── package.json
│   ├── vite.config.js
│   └── dist/                  # Built files (after npm run build)
├── backend/                   # Node.js API server
│   ├── server.js              # Main API
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
└── ansible/                   # Ansible playbooks
```

## Frontend Configuration

### Environment Variables

**Development** (`.env.development`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Production** (inside docker-compose.yml):
```env
REACT_APP_API_URL=/api  # Proxied through NGINX
```

### Build Output

```bash
npm run build
# Creates: frontend/dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-ABC.js
#   │   └── index-ABC.css
#   └── favicon.svg
```

## Backend API

### Real-time Data

The backend pulls actual metrics from:

1. **Docker API** via CLI
   - Container status (running/stopped)
   - CPU usage
   - Container uptime
   - Port mappings

2. **Container Logs**
   - Last 5 logs per container
   - Aggregated (max 10 entries)
   - Types: ok, info, warn, error

3. **Terraform State**
   - From `infra_state.json` if exists
   - Defaults to 4 resources (network, 2 containers, volume)

### Polling Intervals

Frontend polls at:
- Containers: Every 5 seconds
- Logs: Every 5 seconds  
- Terraform State: Every 10 seconds

### API Endpoints

```
GET /api/health                    Health check
GET /api/containers                List all containers
GET /api/containers/:id            Container details
GET /api/logs                       Aggregated logs
GET /api/terraform-state           Infrastructure state
```

See [backend/README.md](backend/README.md) for detailed API docs.

## Common Tasks

### View Real-time Logs

```bash
# All Docker logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Stop Services

```bash
docker-compose down
```

### Rebuild a Service

```bash
docker-compose up -d --build backend
```

### Run Frontend Tests (if added)

```bash
cd frontend
npm run test
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Package with Docker
docker-compose up -d --build
```

## Troubleshooting

### "Cannot connect to Docker daemon"

```bash
# Ensure Docker is running
docker ps

# On Linux, check socket permissions
sudo usermod -aG docker $USER
```

### "Port 8081 already in use"

```bash
# Find process using port
lsof -i :8081

# Change port in docker-compose.yml
# Change: "8081:80" to "8082:80"
```

### "Backend API not responding"

```bash
# Check backend is running
docker-compose ps backend

# View backend logs
docker-compose logs backend

# Test API directly
curl http://localhost:3001/api/health
```

### "No containers showing in dashboard"

1. Check if services are running: `docker-compose ps`
2. Check browser console (F12) for errors
3. Wait 5 seconds for first poll
4. Backend must be accessible from frontend

### "Frontend shows old data"

The frontend auto-refreshes every 5 seconds. To force refresh:
- Open browser dev tools (F12)
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or check if backend API is running

## Performance Notes

- Each container metric poll takes ~100-200ms
- Log aggregation may be slow with many containers
- CPU usage is calculated per Docker stats call
- Consider increasing poll intervals if running many services

## Security Considerations

### Development
- API accessible on localhost only
- CORS allows all origins (*)
- No authentication required

### Production
- Mount Docker socket as read-only: `:ro`
- Restrict CORS to frontend domain
- Add authentication layer
- Use reverse proxy for HTTPS
- Run in isolated network

## Monitoring & Debugging

Check API responses directly:

```bash
# Container metrics
curl http://localhost:3001/api/containers | jq

# Logs
curl http://localhost:3001/api/logs | jq

# Terraform state
curl http://localhost:3001/api/terraform-state | jq
```

Monitor performance:
```bash
# Docker stats
docker stats

# Network traffic
docker-compose logs -f --timestamps
```

## Next Steps

1. Customize the backend to pull real Terraform state
2. Add WebSocket support for true real-time updates
3. Implement authentication for production
4. Set up CI/CD pipeline
5. Add more detailed monitoring metrics
6. Create API documentation with Swagger/OpenAPI

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify all services running: `docker-compose ps`
3. Test backend API: `curl http://localhost:3001/api/health`
4. Check frontend console (F12) for JavaScript errors
