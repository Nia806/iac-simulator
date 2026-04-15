# IaC Simulator Backend API

Real-time container metrics and infrastructure state API for the IaC Simulator frontend.

## Features

- **Live Container Metrics** - Real-time CPU usage, memory, container status
- **Docker Integration** - Queries Docker daemon for actual container data
- **Log Aggregation** - Collects logs from all running containers
- **Terraform State** - Exposes infrastructure state from Terraform files
- **CORS Enabled** - Ready for frontend integration

## API Endpoints

### GET /api/containers
Returns list of all running containers with real-time metrics.

```json
[
  {
    "id": "container_id",
    "name": "web-app",
    "image": "nginx:alpine",
    "port": 8081,
    "status": "running",
    "cpu": 18,
    "startTime": 1681234567890
  }
]
```

### GET /api/containers/:id
Returns detailed information about a specific container.

```json
{
  "id": "1234567890ab",
  "name": "iac-postgres",
  "image": "postgres:15-alpine",
  "status": "running",
  "created": "2024-04-15T12:00:00Z",
  "env": ["POSTGRES_PASSWORD=example", ...],
  "mounts": [...],
  "ports": {"5432/tcp": [{"HostIp": "", "HostPort": "5432"}]}
}
```

### GET /api/logs
Returns aggregated logs from all containers (last 10 entries).

```json
[
  {
    "time": "12:34:56",
    "type": "ok",
    "msg": "Container health check passed"
  }
]
```

### GET /api/terraform-state
Returns Terraform resource state from `infra_state.json` or defaults.

```json
[
  {
    "name": "docker_network.sim_net",
    "type": "docker · bridge",
    "id": "7a3f9c1b2e4d",
    "status": "applied"
  }
]
```

### GET /api/health
Health check endpoint for Docker healthcheck.

```json
{
  "status": "ok",
  "timestamp": "2024-04-15T12:34:56.000Z"
}
```

## Setup & Running

### Standalone (Node.js)

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

### With Docker Compose

The backend service is included in the main `docker-compose.yml`:

```bash
docker-compose up -d
# Backend runs on http://localhost:3001
```

### Requirements

- Node.js 18+
- Docker daemon (for container metrics)
- Docker CLI available in PATH
- Docker socket mounted (for Docker Compose setup)

## Environment Variables

```env
PORT=3001                    # Port to run the server
NODE_ENV=production         # Node environment
```

## Architecture

The backend service:
1. **Queries Docker daemon** using `docker` CLI commands
2. **Aggregates container metrics** (CPU, memory, status)
3. **Collects container logs** from all running services
4. **Reads infrastructure state** from Terraform files
5. **Exposes REST API** for frontend consumption
6. **Provides CORS headers** for cross-origin requests

## Frontend Integration

The React frontend (`src/hooks/useDashboardData.js`) automatically:
- Fetches from `http://localhost:3001/api` in development
- Polls container data every 5 seconds
- Updates logs every 5 seconds
- Refreshes Terraform state every 10 seconds

## Error Handling

If the backend is unavailable:
- Frontend shows "Loading container data..." message
- Displays error message to user
- Containers array appears empty
- Suggests to start services: `docker-compose up -d`

## Troubleshooting

**Error: "Cannot find docker command"**
- Ensure Docker is installed and in PATH
- Restart the backend service after installing Docker

**Error: "Cannot connect to Docker daemon"**
- Ensure Docker daemon is running
- On Windows, ensure Docker Desktop is running
- On Linux, check Docker socket permissions

**No containers showing**
- Run `docker-compose up -d` to start services
- Wait 5 seconds for frontend to refresh
- Check browser console for API errors

**Logs not appearing**
- Containers may not have log output yet
- Check Docker logs directly: `docker logs <container_name>`
- Some images have minimal logging

## Development

Start the backend in development mode with auto-reload:

```bash
npm run dev
# Requires: npm install --save-dev nodemon
```

## Production

When deploying:

1. Use the included `Dockerfile` for containerization
2. Mount Docker socket: `-v /var/run/docker.sock:/var/run/docker.sock:ro`
3. Set `NODE_ENV=production`
4. Configure appropriate CORS origins instead of "*"
5. Use a reverse proxy (nginx) for TLS/HTTPS

## License

Same as parent project
