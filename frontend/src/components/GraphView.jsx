import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { generateGraphData } from '../utils/dataTransform';

export const GraphView = ({ containers, tfResources }) => {
  const { nodes: initialNodes, edges: initialEdges } = generateGraphData(containers, tfResources);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = () => {};

  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateGraphData(containers, tfResources);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [containers, tfResources, setNodes, setEdges]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-[var(--border)]"
         style={{ backgroundColor: 'var(--surface)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="var(--border)" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
