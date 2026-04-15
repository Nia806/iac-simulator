import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const Topbar = ({ onViewChange, currentView }) => {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-100 bg-opacity-85 backdrop-blur-md border-b border-[var(--border)] px-7 py-3 flex items-center justify-between"
            style={{ backgroundColor: `rgba(10, 12, 16, 0.85)` }}>
      {/* Logo */}
      <div className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest text-[var(--green)]">
        <div className="w-6 h-6 border-2 border-[var(--green)] rounded-md flex items-center justify-center text-xs font-bold">
          ∑
        </div>
        IAC-SIM
      </div>

      {/* Center Section - View Toggle */}
      <div className="flex gap-6 items-center">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`text-xs font-mono font-semibold transition-colors ${
            currentView === 'dashboard'
              ? 'text-[var(--green)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onViewChange('graph')}
          className={`text-xs font-mono font-semibold transition-colors ${
            currentView === 'graph'
              ? 'text-[var(--blue)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Graph
        </button>
        <button
          onClick={() => onViewChange('editor')}
          className={`text-xs font-mono font-semibold transition-colors ${
            currentView === 'editor'
              ? 'text-[var(--amber)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Editor
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 font-mono text-xs text-[var(--muted)]">
        {/* Live badge */}
        <div className="flex items-center gap-2 text-[var(--green)]">
          <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse"></div>
          LIVE
        </div>

        {/* Environment */}
        <span>env: local-dev</span>

        {/* Time */}
        <span>time: {time}</span>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 rounded-md border border-[var(--border)] hover:border-[var(--border-bright)] hover:bg-[var(--dim)] transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Theme toggle"
        >
          {theme === 'dark' ? (
            <span className="text-lg">SUN</span>
          ) : (
            <span className="text-lg">MOON</span>
          )}
        </button>
      </div>
    </header>
  );
};
