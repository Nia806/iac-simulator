# IaC Simulator

A simple Infrastructure as Code project demonstrating Docker Compose, Ansible, and DevOps automation working together.

## What This Project Does

- **Docker Compose**: Provisions containers (Nginx web server + PostgreSQL database)
- **Ansible**: Verifies services are running and healthy
- **Frontend**: Interactive dashboard with real-time updates on localhost:8080

## Quick Start (3 Steps)

```bash
# 1. Start services with Docker Compose
docker-compose up -d

# 2. Verify services with Ansible
ansible-playbook -i ansible/inventory.ini ansible/site.yml

# 3. Open dashboard in browser
# http://localhost:8080
```

**That's it!** All services are now running.

## Available Commands

```bash
# Start all services in background
docker-compose up -d

# Stop all services
docker-compose down

# View running containers
docker-compose ps

# View service logs
docker-compose logs

# View specific service logs
docker-compose logs nginx
docker-compose logs postgres
```

## Testing Services

```bash
# Test Nginx
curl http://localhost:8080

# Test PostgreSQL connection
psql -h localhost -U postgres -d iac_simulator
# Password: example

# Run automated tests
./scripts/smoke-test.sh
```

## Tech Stack

- Docker Compose (Container orchestration)
- Ansible (Configuration management & verification)
- Nginx (Web server)
- PostgreSQL (Database)

## Project Structure

```
iac-simulator/
├── docker-compose.yml      # Service definitions
├── ansible/
│   ├── inventory.ini       # Ansible hosts
│   └── site.yml            # Service verification playbook
├── frontend/
│   └── index.html          # Dashboard UI
├── scripts/
│   └── smoke-test.sh       # Automated tests
├── README.md               # This file
└── .gitignore
```

## Dashboard Features

Access the interactive dashboard at http://localhost:8080:

- Real-time service status
- Container health checks
- Live uptime counters
- System metrics display
- Markdown formatted logs

## Learning Outcomes

By exploring this project, you'll understand:

1. **Docker Compose**: How to define multi-container applications
2. **Ansible**: How to automate verification and configuration
3. **DevOps Basics**: Infrastructure automation and monitoring
4. **Local Development**: Running full stacks locally

## Troubleshooting

**Services won't start:**
```bash
# Check Docker is running
docker ps

# Check for port conflicts
docker-compose logs
```

**Ansible playbook fails:**
```bash
# Verify inventory
ansible -i ansible/inventory.ini all -m ping

# Run playbook with verbose output
ansible-playbook -i ansible/inventory.ini ansible/site.yml -v
```

**Can't access dashboard:**
- Wait 10 seconds for nginx to start
- Refresh browser (Ctrl+R or Cmd+R)
- Check: `curl http://localhost:8080`

## Next Steps

1. Modify `docker-compose.yml` to add more services
2. Update `ansible/site.yml` with additional checks
3. Customize the frontend dashboard in `frontend/index.html`
4. Add more services to the Docker Compose stack

## Requirements

- Docker & Docker Compose (Docker Desktop includes both)
- Ansible 2.10+
- Bash shell (for smoke test script)

## License & Notes

This is a learning project. Feel free to modify and extend it!

```

**Check Redis:**
```bash
nc -z -w2 localhost 6379 && echo "Redis OK"
```

**List Containers:**
```bash
docker ps
```

## Dashboard Features

The interactive dashboard at `http://localhost:8080` displays:

- **Live Status**: Real-time container health and status
- **Uptime Counter**: Shows how long each service has been running
- **CPU Usage**: Animated CPU usage bars for each container
- **Live Logs**: Streaming log entries from deployment
- **Terraform State**: Resource tracking and status
- **Ansible Playbook**: Task execution status
- **GitHub Actions**: CI/CD pipeline results

The dashboard updates every 2 seconds with resource usage and service status changes!

## 🗑️ Clean Up

```bash
cd terraform
terraform destroy
# Type "yes" when prompted
```

## Service URLs

- Dashboard: http://localhost:8080
- PostgreSQL: localhost:5432 (user: admin, password: admin123)
- Redis: localhost:6379

## CI/CD Pipeline (GitHub Actions)

The project includes a simple GitHub Actions workflow that runs on push/PR:

**Pipeline Steps:**
1. **Terraform Validate** - Validates IaC configuration
2. **Ansible Lint** - Lints configuration management code
3. **Security Scan** - Basic security checks

To enable:
1. Push this repository to GitHub
2. Workflow runs automatically on push to `main`
3. View results in Actions tab

## Learning Outcomes

- How to use Terraform for Docker provisioning  
- How to run simple Ansible playbooks  
- How to manage infrastructure locally  
- Basic DevOps workflow concepts  
- Setting up GitHub Actions CI/CD pipeline  
- Multi-container orchestration

## Troubleshooting

**For detailed troubleshooting, see [SETUP.md - Troubleshooting Section](SETUP.md#troubleshooting)**

Quick fixes:
```bash
# Docker not running?
# → Start Docker Desktop app (Windows/Mac) or: sudo systemctl start docker (Linux)

# Port 8080 already in use?
# → Edit terraform/variables.tf and change: nginx_port = 8081

# Containers not starting?
# → Run: docker ps (to check status)
# → Run: docker logs iac-nginx (to see errors)
```

## Notes

This is a minimal beginner-friendly project. For production use, consider:
- Using remote state storage
- Adding monitoring and logging
- Implementing security policies
- Adding CI/CD pipeline

---

**Total Setup Time**: 5-10 minutes (after tools installed)  
**Difficulty**: Beginner
