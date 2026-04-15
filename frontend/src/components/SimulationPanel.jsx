import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { generateSimulationSteps } from '../utils/dataTransform';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const SimulationPanel = () => {
  const {
    simulationState,
    steps,
    currentStep,
    logs,
    failureInjected,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    completeSimulation,
    reset,
    addStep,
    addLog,
    setCurrentStep,
    updateStepStatus,
    toggleFailureInjection
  } = useSimulation();

  const [initialized, setInitialized] = useState(false);

  // Initialize simulation on first load
  useEffect(() => {
    if (!initialized) {
      const stepsList = generateSimulationSteps();
      stepsList.forEach(step => {
        addStep({ ...step, status: 'pending' });
      });
      setInitialized(true);
    }
  }, []);

  // Simulate running steps
  useEffect(() => {
    if (simulationState !== 'running' || !steps.length) return;

    if (currentStep >= steps.length) {
      completeSimulation();
      toast.success('Simulation completed successfully!');
      return;
    }

    const timer = setTimeout(() => {
      const step = steps[currentStep];
      
      // Check if should fail
      const shouldFail = failureInjected && currentStep === 4;
      
      updateStepStatus(currentStep, 'running');
      
      const logTimer = setTimeout(() => {
        if (shouldFail) {
          updateStepStatus(currentStep, 'failed');
          addLog({
            type: 'err',
            msg: `[FAIL] ${step.name} failed`
          });
          toast.error(`Step failed: ${step.name}`);
          pauseSimulation();
        } else {
          updateStepStatus(currentStep, 'completed');
          addLog({
            type: 'ok',
            msg: `[OK] ${step.name} completed`
          });
          setCurrentStep(currentStep + 1);
        }
      }, 1500);

      return () => clearTimeout(logTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, [simulationState, currentStep, steps, failureInjected]);

  const handleRun = () => {
    if (simulationState === 'idle') {
      startSimulation();
      toast.loading('Starting simulation...', { id: 'sim-toast' });
    } else if (simulationState === 'paused') {
      resumeSimulation();
      toast.loading('Resuming simulation...', { id: 'sim-toast' });
    }
  };

  const handlePause = () => {
    pauseSimulation();
    toast.success('Simulation paused');
  };

  const handleReset = () => {
    reset();
    setInitialized(false);
    toast.success('Simulation reset');
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed': return '[OK]';
      case 'running': return '[RUN]';
      case 'failed': return '[FAIL]';
      default: return '○';
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'text-[var(--green)]';
      case 'running': return 'text-[var(--amber)] animate-spin';
      case 'failed': return 'text-[var(--red)]';
      default: return 'text-[var(--muted)]';
    }
  };

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden"
         style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            Sandbox Simulation
          </h3>
          <p className="text-xs font-mono text-[var(--muted)] mt-1">
            Current: {steps[currentStep]?.name || 'Ready'} ({currentStep + 1}/{steps.length})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-block px-2 py-1 text-xs font-mono font-semibold rounded ${
            simulationState === 'running' ? 'bg-[var(--amber-dim)] text-[var(--amber)]' :
            simulationState === 'completed' ? 'bg-[var(--green-dim)] text-[var(--green)]' :
            simulationState === 'paused' ? 'bg-[var(--blue-dim)] text-[var(--blue)]' :
            'bg-[var(--dim)] text-[var(--muted)]'
          }`}>
            {simulationState.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 p-4 border-b border-[var(--border)] flex-wrap">
        <button
          onClick={handleRun}
          disabled={simulationState === 'running'}
          className="px-4 py-2 text-xs font-mono font-bold bg-[var(--green-dim)] text-[var(--green)] rounded hover:bg-[var(--green)] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [RUN] {simulationState === 'idle' ? 'Run' : 'Resume'}
        </button>

        <button
          onClick={handlePause}
          disabled={simulationState !== 'running'}
          className="px-4 py-2 text-xs font-mono font-bold bg-[var(--amber-dim)] text-[var(--amber)] rounded hover:bg-[var(--amber)] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [PAUSE] Pause
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-mono font-bold bg-[var(--red-dim)] text-[var(--red)] rounded hover:bg-[var(--red)] hover:text-black transition-all"
        >
          [RESET] Reset
        </button>

        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={failureInjected}
              onChange={toggleFailureInjection}
              className="w-3 h-3"
            />
            <span className="text-xs font-mono text-[var(--muted)]">Inject Failure</span>
          </label>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <AnimatePresence>
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] transition-all"
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center font-mono text-xs font-bold ${getStepColor(step.status)}`}>
                {getStepIcon(step.status)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">{step.name}</p>
                <p className="text-xs text-[var(--muted)] font-mono">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Logs */}
      <div className="border-t border-[var(--border)] p-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Logs</h4>
        <div className="bg-[var(--dim)] rounded p-3 font-mono text-xs space-y-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} className={`text-[var(--${log.type === 'ok' ? 'green' : log.type === 'warn' ? 'amber' : log.type === 'err' ? 'red' : 'blue'})]`}>
                <span className="text-[var(--muted)]">{log.timestamp}</span> {log.msg}
              </div>
            ))
          ) : (
            <p className="text-[var(--muted)]">No logs yet. Run simulation to see logs.</p>
          )}
        </div>
      </div>
    </div>
  );
};
