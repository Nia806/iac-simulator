import React, { createContext, useContext, useState, useCallback } from 'react';

const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
  const [simulationState, setSimulationState] = useState('idle'); // idle | running | paused | completed
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [failureInjected, setFailureInjected] = useState(false);

  const addStep = useCallback((step) => {
    setSteps(prev => [...prev, step]);
  }, []);

  const addLog = useCallback((log) => {
    setLogs(prev => [...prev, {
      ...log,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }]);
  }, []);

  const reset = useCallback(() => {
    setSimulationState('idle');
    setSteps([]);
    setCurrentStep(0);
    setLogs([]);
    setFailureInjected(false);
  }, []);

  const startSimulation = useCallback(() => {
    setSimulationState('running');
  }, []);

  const pauseSimulation = useCallback(() => {
    setSimulationState('paused');
  }, []);

  const resumeSimulation = useCallback(() => {
    setSimulationState('running');
  }, []);

  const completeSimulation = useCallback(() => {
    setSimulationState('completed');
  }, []);

  const updateStepStatus = useCallback((stepIndex, status) => {
    setSteps(prev => {
      const updated = [...prev];
      updated[stepIndex] = { ...updated[stepIndex], status };
      return updated;
    });
  }, []);

  const toggleFailureInjection = useCallback(() => {
    setFailureInjected(prev => !prev);
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        simulationState,
        steps,
        currentStep,
        logs,
        failureInjected,
        addStep,
        addLog,
        reset,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        completeSimulation,
        updateStepStatus,
        setCurrentStep,
        toggleFailureInjection
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};
