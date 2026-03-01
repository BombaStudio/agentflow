"use client";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from '@xyflow/react';
import type { OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
import { Node, Edge } from '../../types';
import { TextUpdaterNode } from '../../components/nodes/TextUpdaterNode';
import { TestNode } from '../../components/nodes/TestNode';

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  test: TestNode,
};

const initialNodes : Node[] = [
  { id: 'n1', type: 'test', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', type: 'textUpdater', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3' } },
];
const initialEdges : Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function Home() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange<Edge> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans p-6 text-slate-900">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Agent Flow</h1>
        <p className="text-sm text-slate-500">ReactFlow canvas örneği (Açık Tema)</p>
      </header>
      <main className="flex-1 w-full bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          colorMode="light"
        >
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
}
