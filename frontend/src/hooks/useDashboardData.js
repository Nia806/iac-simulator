import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const useDashboardData = () => {
  const [containers, setContainers] = useState([]);
  const [tfResources, setTfResources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch containers from API
  const fetchContainers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/containers`);
      if (!response.ok) throw new Error('Failed to fetch containers');
      const data = await response.json();
      setContainers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching containers:', err);
      setError(err.message);
      setContainers([]);
    }
  }, []);

  // Fetch logs from API
  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setLogs([]);
    }
  }, []);

  // Fetch Terraform state
  const fetchTerraformState = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/terraform-state`);
      if (!response.ok) throw new Error('Failed to fetch terraform state');
      const data = await response.json();
      setTfResources(data);
    } catch (err) {
      console.error('Error fetching terraform state:', err);
      setTfResources([]);
    }
  }, []);

  // Initial load and polling setup
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([fetchContainers(), fetchLogs(), fetchTerraformState()]);
      setIsLoading(false);
    };

    loadInitialData();

    // Poll for updates every 5 seconds
    const containerInterval = setInterval(fetchContainers, 5000);
    const logsInterval = setInterval(fetchLogs, 5000);
    const tfInterval = setInterval(fetchTerraformState, 10000);

    return () => {
      clearInterval(containerInterval);
      clearInterval(logsInterval);
      clearInterval(tfInterval);
    };
  }, [fetchContainers, fetchLogs, fetchTerraformState]);

  const updateContainerStatus = useCallback((containerId, status) => {
    setContainers(prev =>
      prev.map(c => c.id === containerId ? { ...c, status } : c)
    );
  }, []);

  const updateContainerCPU = useCallback((containerId, cpu) => {
    setContainers(prev =>
      prev.map(c => c.id === containerId ? { ...c, cpu } : c)
    );
  }, []);

  const addLog = useCallback((log) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => {
      const updated = [...prev, { ...log, time }];
      if (updated.length > 10) updated.shift();
      return updated;
    });
  }, []);

  const getContainerUptime = (container) => {
    const elapsed = Math.floor((Date.now() - container.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}m ${seconds}s`;
  };

  const healthyContainerCount = containers.filter(c => c.status === 'running').length;

  return {
    containers,
    tfResources,
    logs,
    isLoading,
    error,
    updateContainerStatus,
    updateContainerCPU,
    addLog,
    getContainerUptime,
    healthyContainerCount,
    refetch: {
      containers: fetchContainers,
      logs: fetchLogs,
      terraformState: fetchTerraformState
    }
  };
};
