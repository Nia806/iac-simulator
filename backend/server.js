const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Get running containers info
app.get('/api/containers', (req, res) => {
  try {
    const output = execSync('docker ps --format "{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}"', {
      encoding: 'utf-8'
    }).trim();

    if (!output) {
      return res.json([]);
    }

    const containers = output.split('\n').map(line => {
      const [id, name, image, status] = line.split('|');
      
      // Extract CPU usage
      const statsOutput = execSync(`docker stats --no-stream ${id}`, {
        encoding: 'utf-8'
      }).split('\n')[1];
      
      const cpuStr = statsOutput ? statsOutput.split(/\s+/)[2] : '0%';
      const cpu = parseInt(cpuStr) || 0;

      // Extract port from image name
      let port = 8081;
      if (name.includes('iac-postgres')) port = 5432;
      if (name.includes('iac-redis')) port = 6379;

      return {
        id,
        name: name.replace('iac-', ''),
        image,
        port,
        status: status.includes('Up') ? 'running' : 'stopped',
        cpu: Math.min(cpu, 100),
        startTime: Date.now() - 60000 // Approximate
      };
    });

    res.json(containers);
  } catch (error) {
    console.error('Error fetching containers:', error.message);
    res.json([]);
  }
});

// Get container logs
app.get('/api/logs', (req, res) => {
  try {
    const containers = execSync('docker ps --format "{{.Names}}"', {
      encoding: 'utf-8'
    }).trim().split('\n');

    const logs = [];

    containers.forEach(containerName => {
      try {
        const output = execSync(`docker logs --tail 5 --timestamps ${containerName}`, {
          encoding: 'utf-8'
        }).trim();

        output.split('\n').forEach(line => {
          if (line) {
            const timestamp = line.split(' ')[0] || new Date().toISOString();
            const msg = line.substring(line.indexOf(' ') + 1);
            
            let type = 'info';
            if (msg.includes('error') || msg.includes('Error')) type = 'error';
            else if (msg.includes('warn') || msg.includes('Warn')) type = 'warn';
            else if (msg.includes('started') || msg.includes('ready')) type = 'ok';

            logs.push({
              time: new Date(timestamp).toLocaleTimeString('en-US', { hour12: false }),
              type,
              msg: msg.substring(0, 100)
            });
          }
        });
      } catch (e) {
        // Container might not have logs yet
      }
    });

    // Return last 10 logs
    res.json(logs.slice(-10));
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.json([]);
  }
});

// Get container inspect data (advanced info)
app.get('/api/containers/:id', (req, res) => {
  try {
    const output = execSync(`docker inspect ${req.params.id}`, {
      encoding: 'utf-8'
    });
    const data = JSON.parse(output)[0];

    res.json({
      id: data.Id.substring(0, 12),
      name: data.Name.replace('/', ''),
      image: data.Config.Image,
      status: data.State.Status,
      created: data.Created,
      env: data.Config.Env || [],
      mounts: data.Mounts || [],
      ports: data.NetworkSettings.Ports || {}
    });
  } catch (error) {
    res.status(404).json({ error: 'Container not found' });
  }
});

// Get simulated terraform state (from file if exists)
app.get('/api/terraform-state', (req, res) => {
  try {
    const stateFile = path.join(__dirname, '../infra_state.json');
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      res.json(state);
    } else {
      // Return default terraform resources
      res.json([
        { name: 'docker_network.sim_net', type: 'docker · bridge', id: '7a3f9c1b2e4d', status: 'applied' },
        { name: 'docker_container.web_app', type: 'docker · container', id: 'c8f1a2b9d5e3', status: 'applied' },
        { name: 'docker_container.postgres', type: 'docker · container', id: 'e2d4f6a8b0c1', status: 'applied' },
        { name: 'docker_volume.pg_data', type: 'docker · volume', id: 'pg_data_vol', status: 'no-op' }
      ]);
    }
  } catch (error) {
    console.error('Error fetching terraform state:', error.message);
    res.json([]);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`IaC Simulator Backend API running on http://localhost:${PORT}`);
  console.log(`GET /api/containers - List all running containers`);
  console.log(`GET /api/containers/:id - Container details`);
  console.log(`GET /api/logs - Container logs`);
  console.log(`GET /api/terraform-state - Terraform resources`);
});
