"use client";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, Panel, useReactFlow } from '@xyflow/react';
import type { OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback } from 'react';
import { Node, Edge } from '../../types';
import { TextUpdaterNode } from '../../components/nodes/TextUpdaterNode';
import { TestNode } from '../../components/nodes/TestNode';
import { AITextGenerate } from '../../components/nodes/AITextGenerate';
import { TextReview } from '../../components/nodes/TextReview';
import { ButtonEdge } from '../../components/edges/ButtonEdge';

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  test: TestNode,
  aiTextGenerate: AITextGenerate,
  textReview: TextReview,
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

const initialNodes : Node[] = [
  { id: 'generate-1', type: 'aiTextGenerate', position: { x: 50, y: 100 }, data: { prompt: '' } },
  { id: 'review-1', type: 'textReview', position: { x: 450, y: 100 }, data: {} },
];
const initialEdges : Edge[] = [
  { id: 'e1', source: 'generate-1', target: 'review-1', type: 'buttonedge', animated: true }
];

function FlowPanel({ addNode }: { addNode: (type: string) => void }) {
  return (
    <Panel position="center-left" className="bg-white/90 p-3 rounded-lg shadow-md border border-slate-200 flex flex-col gap-2 backdrop-blur-sm">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 text-center border-b border-slate-100 pb-2">Node Ekle & Sil</span>
      
      <button
        onClick={() => addNode('aiTextGenerate')}
        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md border border-indigo-200 transition-colors flex items-center gap-2"
      >
        ✨ AI Generate
      </button>
      
      <button
        onClick={() => addNode('textReview')}
        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-md border border-emerald-200 transition-colors flex items-center gap-2"
      >
        👀 Text Review
      </button>
      
      <span className="text-[10px] text-slate-400 text-center leading-tight mt-1">
        Ayrıca klavyeden "Delete" ile<br/>silebilirsiniz.
      </span>
    </Panel>
  );
}

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
    (params) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)),
    [],
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
      data: type === 'aiTextGenerate' ? { prompt: '' } : {},
    };
    setNodes((nds) => nds.concat(newNode));
  };

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
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          colorMode="light"
        >
          <Background color="#ccc" gap={16} />
          <Controls />
          <MiniMap />
          <FlowPanel addNode={addNode} />
        </ReactFlow>
      </main>
    </div>
  );
}
