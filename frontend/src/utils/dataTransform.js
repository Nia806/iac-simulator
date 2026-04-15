/**
 * Convert container and resource data to graph nodes and edges for react-flow
 */
export const generateGraphData = (containers, tfResources) => {
  const nodes = [];
  const edges = [];

  // Add container nodes
  containers.forEach((container, index) => {
    nodes.push({
      id: container.id,
      data: { label: container.name, image: container.image, status: container.status },
      position: { x: index * 200, y: 100 },
      style: {
        background: container.status === 'running' ? '#00ff88' : '#ff4d6d',
        color: '#000',
        border: '2px solid #1e2229',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    });
  });

  // Add network node
  nodes.push({
    id: 'docker_network',
    data: { label: 'docker_network', resource: 'sim-net' },
    position: { x: 200, y: 300 },
    style: {
      background: '#5eaeff',
      color: '#000',
      border: '2px solid #1e2229',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    }
  });

  // Add tf resource node
  nodes.push({
    id: 'terraform',
    data: { label: 'Terraform State', resources: tfResources.length },
    position: { x: 500, y: 150 },
    style: {
      background: '#ffb347',
      color: '#000',
      border: '2px solid #1e2229',
      borderRadius: '10px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    }
  });

  // Create edges from containers to network
  containers.forEach(container => {
    edges.push({
      id: `${container.id}-network`,
      source: container.id,
      target: 'docker_network',
      animated: true,
      style: { stroke: '#00ff88', strokeWidth: 2 }
    });
  });

  // Edge from network to terraform
  edges.push({
    id: 'network-terraform',
    source: 'docker_network',
    target: 'terraform',
    animated: false,
    style: { stroke: '#5eaeff', strokeWidth: 2 }
  });

  return { nodes, edges };
};

/**
 * Convert terraform state to JSON for display
 */
export const generateTfStateJSON = (resources) => {
  return {
    version: 4,
    terraform_version: '1.5.0',
    serial: 7,
    lineage: 'iac-simulator',
    outputs: {},
    resources: resources.map(r => ({
      type: r.type.split(' · ')[0],
      name: r.name.split('.')[1],
      instances: [
        {
          attributes: {
            id: r.id,
            name: r.name
          }
        }
      ]
    }))
  };
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate mock simulation steps
 */
export const generateSimulationSteps = () => [
  { name: 'Validate Configuration', description: 'Loading and validating terraform config' },
  { name: 'Plan Infrastructure', description: 'Creating execution plan' },
  { name: 'Build Docker Network', description: 'Setting up docker network: sim-net' },
  { name: 'Start Containers', description: 'Launching web-app, postgres-db, redis-cache' },
  { name: 'Configure Services', description: 'Running ansible playbooks' },
  { name: 'Health Checks', description: 'Verifying all services are operational' },
  { name: 'Environment Ready', description: 'Complete - All systems operational' }
];
