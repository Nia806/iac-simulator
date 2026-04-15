import React, { useState } from 'react';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { EditorView } from './components/EditorView';
import { SimulationPanel } from './components/SimulationPanel';
import { ThemeProvider } from './context/ThemeContext';
import { SimulationProvider } from './context/SimulationContext';
import { useDashboardData } from './hooks/useDashboardData';
import { Toaster } from 'react-hot-toast';
import './styles/globals.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedContainer, setSelectedContainer] = useState(null);
  const { containers, tfResources } = useDashboardData();

  return (
    <div className="flex flex-col h-screen w-full">
      <Topbar onViewChange={setCurrentView} currentView={currentView} />

      <div className="flex-1 overflow-hidden flex">
        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'dashboard' && (
            <Dashboard onSelectContainer={setSelectedContainer} />
          )}
          {currentView === 'editor' && (
            <EditorView containers={containers} tfResources={tfResources} />
          )}
          {currentView === 'graph' && (
            <div className="flex-1 p-7 overflow-hidden">
              {/* Quick Graph View */}
              <div className="h-full rounded-lg border border-[var(--border)] overflow-hidden"
                   style={{ backgroundColor: 'var(--surface)' }}>
                <iframe
                  src="about:blank"
                  className="w-full h-full"
                  title="Graph View"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Simulation Panel */}
        {currentView === 'dashboard' && (
          <div className="w-96 overflow-y-auto p-4 border-l border-[var(--border)]">
            <SimulationPanel />
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontFamily: 'var(--mono)',
            fontSize: '12px'
          },
          success: {
            style: {
              borderColor: 'var(--green)',
              color: 'var(--green)'
            }
          },
          error: {
            style: {
              borderColor: 'var(--red)',
              color: 'var(--red)'
            }
          },
          loading: {
            style: {
              borderColor: 'var(--amber)',
              color: 'var(--amber)'
            }
          }
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <AppContent />
      </SimulationProvider>
    </ThemeProvider>
  );
}

export default App;
