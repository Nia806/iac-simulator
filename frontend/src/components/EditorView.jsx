import React, { useState } from 'react';
import { GraphView } from './GraphView';
import { JSONEditor } from './JSONEditor';
import { motion } from 'framer-motion';

export const EditorView = ({ containers, tfResources }) => {
  const [layout, setLayout] = useState('split'); // split | graph | json

  return (
    <div className="flex-1 p-7 overflow-hidden flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Infrastructure <span className="text-[var(--amber)]">Editor</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setLayout('split')}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all ${
                layout === 'split'
                  ? 'bg-[var(--amber-dim)] text-[var(--amber)]'
                  : 'bg-[var(--dim)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setLayout('graph')}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all ${
                layout === 'graph'
                  ? 'bg-[var(--blue-dim)] text-[var(--blue)]'
                  : 'bg-[var(--dim)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Graph
            </button>
            <button
              onClick={() => setLayout('json')}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all ${
                layout === 'json'
                  ? 'bg-[var(--green-dim)] text-[var(--green)]'
                  : 'bg-[var(--dim)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              JSON
            </button>
          </div>
        </div>

        {/* Content */}
        {layout === 'split' && (
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            <div className="min-w-0">
              <GraphView containers={containers} tfResources={tfResources} />
            </div>
            <div className="min-w-0 overflow-y-auto">
              <JSONEditor tfResources={tfResources} containers={containers} />
            </div>
          </div>
        )}

        {layout === 'graph' && (
          <div className="flex-1 min-h-0">
            <GraphView containers={containers} tfResources={tfResources} />
          </div>
        )}

        {layout === 'json' && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <JSONEditor tfResources={tfResources} containers={containers} />
          </div>
        )}
      </motion.div>
    </div>
  );
};
