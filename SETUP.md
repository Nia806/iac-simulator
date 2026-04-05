# IaC Simulator - Windows Setup Guide

**Docker Compose + Ansible Edition**

Complete step-by-step guide for Windows users to set up and run the IaC Simulator project locally.

---

## Table of Contents

1. [What You'll Need (Prerequisites)](#prerequisites)
2. [Installation Steps](#installation)
3. [Running the Project](#running-the-project)
4. [Access the Dashboard](#access-dashboard)
5. [Testing](#testing)
6. [Stopping Everything](#cleanup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need to Install

Before starting, **install these 2 tools** on your computer:

| Tool | Version | Download |
|------|---------|----------|
| **Docker Desktop** | Latest | https://www.docker.com/products/docker-desktop |
| **Ansible** | 2.10+ | https://docs.ansible.com/ansible/latest/installation_guide/ |

### Check If Already Installed

Open **PowerShell** and run these commands:

```powershell
docker --version
ansible --version
```

If both show versions, **skip to Step 1** below.

---

## Installation

### Step 0: Install Required Tools

#### **Install Docker Desktop:**
1. Go to: https://www.docker.com/products/docker-desktop
2. Click **Download for Windows**
3. Run the installer
4. Follow installation wizard
5. **Restart your computer** when prompted
6. Open Docker Desktop app from Start menu
7. Wait for "Docker is running" message

#### **Install Ansible:**
Open **PowerShell as Administrator** and run:

```powershell
pip install ansible
```
ppip install 
Or if pip is not found:

```powershell
python -m pip install ansible
```

Verify: `ansible --version`

---

## Running the Project

### Step 1: Navigate to Project Directory

```powershell
cd iac-simulator
```

**Expected:** You should see these folders:
```
ansible/
docker-compose.yml
frontend/
scripts/
```

---

### Step 2: Start Docker Desktop

1. Open **Docker Desktop** app from Start menu
2. Wait for the message "Docker is running"
3. Verify in PowerShell:

```powershell
docker --version
docker ps
```

You should see Docker version and no errors.

---

### Step 3: Start Services with Docker Compose

This creates and starts the Nginx web server, PostgreSQL database, and Redis cache containers.

In PowerShell:

```powershell
docker-compose up -d
```

**What happens:**
- Pulls Nginx and PostgreSQL images from Docker Hub
- Creates a custom network (iac-network)
- Starts both containers in the background
- Takes ~30-60 seconds

**Expected output:**
```
Creating iac-nginx   ... done
Creating iac-postgres ... done
Creating iac-redis   ... done
```

Your containers are now running!

**Verify containers are running:**
```powershell
docker-compose ps
```

You should see both containers with status "Up".

---

### Step 4: Configure with Ansible

This verifies that your containers are running properly.

In PowerShell:

```powershell
ansible-playbook -i ansible/inventory.ini ansible/site.yml
```

**What happens:**
- Checks if Nginx container is running
- Checks if PostgreSQL container is running
- Checks if Redis container is running
- Prints status messages

**Expected output:**
```
Nginx container is running
PostgreSQL container is running
Redis container is running
IaC Simulator infrastructure is ready! Access dashboard at http://localhost:8080
```

**Takes about 10-15 seconds.**

All services are verified!

---

## Access Dashboard

### Step 5: Open the Dashboard

Open your web browser and go to:

```
http://localhost:8081
```

**You should see:**
- Modern dark dashboard
- 3 running services (Nginx, PostgreSQL, Redis)
- Live uptime counters
- CPU usage bars
- Log stream
- Real-time updates every 2 seconds

Your IaC Simulator is now running!

---

## Testing

### Step 6: Run Smoke Tests

Verify all services are accessible.

In PowerShell:

```powershell
cd scripts
.\smoke-test.sh
```

**What happens:**
- Tests Nginx (HTTP 200)
- Tests PostgreSQL (port 5432)
- Tests Redis (port 6379)

**Expected output:**
```
Testing Nginx...
Nginx is running (HTTP 200)

Testing PostgreSQL...
PostgreSQL is accessible

Testing Redis...
Redis is accessible

All services are running!
```

Everything is working!

---

### Manual Service Checks (Optional)

In PowerShell:

**Check Nginx:**
```powershell
curl http://localhost:8080
```

**Check PostgreSQL:**
```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

**Check Redis:**
```powershell
Test-NetConnection -ComputerName localhost -Port 6379
```

**List Running Containers:**
```powershell
docker-compose ps
```

**View Service Logs:**
```powershell
docker-compose logs
```

---

## Stopping Everything

### Step 7: Clean Up (When Done)

**To stop containers but keep data:**

In PowerShell:

```powershell
docker-compose stop
```

**To remove containers and clean up:**

In PowerShell:

```powershell
docker-compose down
```

**To remove containers and delete all data:**

In PowerShell:

```powershell
docker-compose down -v
```

---

## Quick Reference Commands (PowerShell)

**Copy and paste these commands to run the full setup:**

```powershell
# 1. Navigate to project
cd iac-simulator

# 2. Start services with Docker Compose
docker-compose up -d

# 3. Configure with Ansible
ansible-playbook -i ansible/inventory.ini ansible/site.yml

# 4. Run tests
cd scripts
.\smoke-test.sh

# 5. Open dashboard in browser:
# http://localhost:8080

# 6. When done, stop services:
# cd ..
# docker-compose down
```

---

## Troubleshooting

### Problem: "Docker daemon is not running"

**Solution:**
- Open Docker Desktop from Start menu
- Wait for message "Docker is running"
- In PowerShell, verify: `docker ps`

### Problem: Docker Desktop won't start

**Solution:**
- Restart your computer
- Ensure Hyper-V or WSL 2 is enabled (Docker setup handles this)
- Check Event Viewer for errors
- Reinstall Docker Desktop if needed

### Problem: "ansible: command not found"

**Solution:**

In PowerShell:

```powershell
pip install ansible
```

If pip is not found:

```powershell
python -m pip install ansible
```

Then restart PowerShell and try: `ansible --version`

### Problem: "Port 8080 is already in use"

**Solution:**
1. Edit `docker-compose.yml`
2. Change the nginx port:
```yaml
ports:
  - "8081:80"  # Change 8080 to 8081 or any available port
```
3. Run: `docker-compose up -d` again
4. Access: http://localhost:8081

### Problem: "ansible-playbook: command not found"

**Solution:**

In PowerShell:

```powershell
pip install ansible
ansible --version  # Verify installation
```

If still not found, restart PowerShell and try again.

### Problem: Containers won't start

**Solution:**

In PowerShell:

```powershell
# Check Docker status
docker ps

# View container logs
docker-compose logs

# View specific container logs
docker-compose logs nginx
docker-compose logs postgres
```

Then restart Docker Desktop app and try again.

### Problem: "curl: (7) Failed to connect"

**Solution:**
- Dashboard might still be loading
- Wait 30 seconds for containers to fully start
- Refresh browser
- Check if containers are running: `docker-compose ps`

### Problem: PostgreSQL connection fails

**Solution:**

In PowerShell:

```powershell
# Check if postgres is running
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Try to connect
psql -h localhost -U postgres -d iac_simulator
# Password: example
```

### Problem: Redis connection fails

**Solution:**

In PowerShell:

```powershell
# Check if redis is running
docker-compose ps

# View redis logs
docker-compose logs redis

# Try to connect
redis-cli -h localhost
```

### Problem: Cannot see dashboard updates

**Solution:**
- Ensure JavaScript is enabled in browser
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window
- Check browser console (F12) for errors

---

## File Summary

Here's what each file does:

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Defines Nginx, PostgreSQL, and Redis containers |
| `ansible/inventory.ini` | Ansible hosts configuration |
| `ansible/site.yml` | Playbook to verify services |
| `frontend/index.html` | Dashboard (opens at localhost:8080) |
| `scripts/smoke-test.sh` | Tests all services |

---

## What Gets Created

After completing all steps, you'll have:

```
Running Containers:
├── iac-nginx (Port 8080) - Web server
├── iac-postgres (Port 5432) - Database
└── iac-redis (Port 6379) - Cache

Dashboard:
└── http://localhost:8080 - Live monitoring

Data:
└── PostgreSQL database & Redis cache with persistent storage
```

---

## Summary

| Step | Command | Time | Result |
|------|---------|------|--------|
| 0 | Install tools | 10-15 min | Docker, Ansible ready |
| 1 | Navigate folder | 10 sec | Inside iac-simulator |
| 2 | Start Docker | 30 sec | Docker running |
| 3 | docker-compose up | 30-60 sec | 2 containers created & running |
| 4 | ansible-playbook | 15 sec | Services verified |
| 5 | Open dashboard | 5 sec | View http://localhost:8080 |
| 6 | smoke-test.sh | 10 sec | All tests pass |

Total Time: ~5-10 minutes (after tools are installed)

---

## Next Steps

After setup:
- View dashboard at http://localhost:8080
- Watch real-time updates every 2 seconds
- Run tests with .\smoke-test.sh
- Check logs with `docker-compose logs`
- Connect to PostgreSQL: `psql -h localhost -U postgres -d iac_simulator`
- Connect to Redis: `redis-cli -h localhost`
- Modify docker-compose.yml to add more services
- Share setup with teammates using this guide!

---

## Common Commands Reference

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Remove services
docker-compose down

# View logs
docker-compose logs

# View specific service logs
docker-compose logs nginx
docker-compose logs postgres

# Check running containers
docker-compose ps

# Execute command in container
docker-compose exec postgres psql -U postgres

# Rebuild containers
docker-compose up -d --build

# Remove all data and volumes
docker-compose down -v
```

---

## Need Help?

1. Check **Troubleshooting** section above
2. Verify all tools are installed: `docker --version; ansible --version`
3. Make sure Docker Desktop is running
4. Check container status: `docker-compose ps`
5. View container logs: `docker-compose logs`
6. Read README.md for project overview

---

