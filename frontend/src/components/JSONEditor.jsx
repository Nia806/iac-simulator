import React, { useState } from 'react';
import { generateTfStateJSON } from '../utils/dataTransform';
import toast from 'react-hot-toast';

export const JSONEditor = ({ tfResources, containers }) => {
  const [viewMode, setViewMode] = useState('visual'); // visual | json | yaml
  const [jsonContent, setJsonContent] = useState(JSON.stringify(generateTfStateJSON(tfResources), null, 2));

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonContent);
    toast.success('JSON copied to clipboard!');
  };

  const handleDownloadJson = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonContent));
    element.setAttribute('download', 'terraform-state.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Terraform state downloaded!');
  };

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden"
         style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            Infrastructure Config
          </h3>
          <span className="inline-block px-2 py-1 text-xs font-mono font-semibold bg-[var(--blue-dim)] text-[var(--blue)] rounded">
            {tfResources.length} resources
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all ${
              viewMode === 'visual'
                ? 'bg-[var(--green-dim)] text-[var(--green)]'
                : 'bg-[var(--dim)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all ${
              viewMode === 'json'
                ? 'bg-[var(--blue-dim)] text-[var(--blue)]'
                : 'bg-[var(--dim)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {viewMode === 'visual' ? (
          <div className="space-y-3">
            {tfResources.map((resource, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--border-bright)] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-[var(--text)]">
                    {resource.name}
                  </span>
                  <span className={`px-2 py-1 text-xs font-mono font-semibold rounded ${
                    resource.status === 'applied'
                      ? 'bg-[var(--green-dim)] text-[var(--green)]'
                      : 'bg-[var(--blue-dim)] text-[var(--blue)]'
                  }`}>
                    {resource.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--muted)] font-mono space-y-1">
                  <div>type: {resource.type}</div>
                  <div>id: {resource.id}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleCopyJson}
                className="px-3 py-2 text-xs font-mono font-semibold bg-[var(--green-dim)] text-[var(--green)] rounded hover:bg-[var(--green)] hover:text-black transition-all"
              >
                [C] Copy JSON
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-3 py-2 text-xs font-mono font-semibold bg-[var(--blue-dim)] text-[var(--blue)] rounded hover:bg-[var(--blue)] hover:text-black transition-all"
              >
                [D] Download
              </button>
            </div>
            <pre className="bg-[var(--dim)] p-3 rounded text-xs font-mono text-[var(--green)] overflow-x-auto">
              {jsonContent}
            </pre>
          </>
        )}
      </div>
    </div>
  );
};
