import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { motion } from 'framer-motion';

export const Dashboard = ({ onSelectContainer }) => {
  const {
    containers,
    tfResources,
    logs,
    isLoading,
    error,
    getContainerUptime,
    healthyContainerCount
  } = useDashboardData();


  const StatCard = ({ label, value, sub, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border border-[var(--border)] card`}
    >
      <div className="text-xs font-mono uppercase tracking-widest font-bold text-[var(--muted)]">
        {label}
      </div>
      <div className={`text-3xl font-mono font-bold mt-2 text-[var(--${color})]`}>
        {value}
      </div>
      <div className="text-xs font-mono text-[var(--muted)] mt-1">{sub}</div>
    </motion.div>
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'running': return 'dot-green';
      case 'stopping': return 'dot-amber';
      default: return 'dot-red';
    }
  };

  const getCpuColor = (cpu) => {
    if (cpu > 70) return 'fill-amber';
    return 'fill-green';
  };

  return (
    <div className="flex-1 p-7 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Page Header */}
        <div className="flex items-end justify-between border-b border-[var(--border)] pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
              Infrastructure <span className="text-[var(--green)]">Simulator</span>
            </h1>
            <p className="text-xs font-mono text-[var(--muted)] mt-1">
              $ terraform apply — completed 4 resources · docker network: sim-net · host: localhost
            </p>
          </div>
          <button className="px-4 py-2 bg-[var(--green)] text-black font-mono text-xs font-bold rounded-lg hover:bg-[var(--green-mid)] transition-all transform hover:-translate-y-0.5">
            [RUN] terraform apply
          </button>
        </div>

        {/* Stats */}
        {error && (
          <div className="p-4 rounded-lg border border-red-500 bg-red-900/20 text-red-300 font-mono text-sm">
            Error loading data: {error}
          </div>
        )}

        {isLoading && (
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] font-mono text-sm text-center">
            Loading container data...
          </div>
        )}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Containers Up" value={healthyContainerCount} sub="/ 3 running" color="green" />
          <StatCard label="TF Resources" value={tfResources.length} sub="no drift detected" color="amber" />
          <StatCard label="Network" value="1" sub="sim-net · bridge" color="blue" />
          <StatCard label="Ansible Plays" value="5/5" sub="all tasks ok" color="green" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Containers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-2 card rounded-lg overflow-hidden"
          >
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                Running Containers
              </h3>
              <span className="inline-block px-2 py-1 text-xs font-mono font-semibold bg-[var(--green-dim)] text-[var(--green)] rounded">
                {healthyContainerCount} healthy
              </span>
            </div>

            <div>
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[var(--border)] text-xs font-mono font-bold text-[var(--muted)] uppercase tracking-widest">
                <div></div>
                <div>Name</div>
                <div>Image</div>
                <div>Port</div>
                <div className="text-right">Uptime</div>
              </div>

              {/* Rows */}
              {containers.length === 0 && !isLoading ? (
                <div className="p-4 text-center text-[var(--muted)] font-mono text-sm">
                  No containers running. Start services with: docker-compose up -d
                </div>
              ) : (
                containers.map((container, idx) => (
                  <motion.div
                    key={container.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onSelectContainer(container)}
                    className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--dim)] cursor-pointer transition-all items-center font-mono text-xs"
                  >
                    <div className={`status-dot ${getStatusClass(container.status)}`}></div>
                    <div className="font-bold text-[var(--text)]">{container.name}</div>
                    <div className="text-[var(--muted)]">{container.image}</div>
                    <div className="text-[var(--blue)]">:{container.port}</div>
                    <div className="text-right text-[var(--muted)]">{getContainerUptime(container)}</div>
                  </motion.div>
                ))
              )}
            </div>

            {/* CPU Usage */}
            <div className="p-4 border-t border-[var(--border)]">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                Resource Usage
              </h4>
              <div className="space-y-3">
                {containers.map(container => (
                  <div key={container.id} className="grid grid-cols-5 gap-3 items-center font-mono text-xs">
                    <div className="text-[var(--muted)]">{container.name}</div>
                    <div className="col-span-3 h-1 bg-[var(--dim)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCpuColor(container.cpu)}`}
                        style={{ width: `${container.cpu}%`, transition: 'width 0.5s ease' }}
                      ></div>
                    </div>
                    <div className={`text-right text-[var(--${getCpuColor(container.cpu) === 'fill-green' ? 'green' : 'amber'})]`}>
                      {container.cpu}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Terraform State */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card rounded-lg overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                Terraform State
              </h3>
              <span className="inline-block px-2 py-1 text-xs font-mono font-semibold bg-[var(--amber-dim)] text-[var(--amber)] rounded">
                {tfResources.length} resources
              </span>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-2">
              {tfResources.map((resource, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 border border-[var(--border)] rounded-lg hover:border-[var(--border-bright)] transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[var(--text)]">
                      {resource.name}
                    </span>
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      resource.status === 'applied'
                        ? 'bg-[var(--green-dim)] text-[var(--green)]'
                        : 'bg-[var(--blue-dim)] text-[var(--blue)]'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono space-y-0.5">
                    <div>{resource.type}</div>
                    <div className="break-all text-[10px]">id: {resource.id}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card rounded-lg overflow-hidden"
        >
          <div className="p-4 border-b border-[var(--border)]">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              Live Log Stream
            </h3>
          </div>
          <div className="p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--dim)' }}>
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-[var(--muted)] flex-shrink-0">{log.time}</span>
                <span className={`text-[var(--${log.type === 'ok' ? 'green' : log.type === 'warn' ? 'amber' : log.type === 'err' ? 'red' : 'blue'})]`}>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
