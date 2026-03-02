"use client";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, Panel, useReactFlow, BackgroundVariant } from '@xyflow/react';
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
    <Panel position="center-left" className="bg-black/40 p-4 rounded-xl border border-zinc-800/80 flex flex-col gap-3 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1 text-center border-b border-zinc-800/50 pb-2">Toolbox</span>
      
      <button
        onClick={() => addNode('aiTextGenerate')}
        className="px-4 py-2.5 bg-zinc-900/80 hover:bg-emerald-950/40 text-emerald-400 text-sm font-medium rounded border border-zinc-800 hover:border-emerald-500/50 transition-all flex items-center gap-2 shadow-[0_0_5px_rgba(16,185,129,0)] hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
      >
        ✨ AI Generate
      </button>
      
      <button
        onClick={() => addNode('textReview')}
        className="px-4 py-2.5 bg-zinc-900/80 hover:bg-cyan-950/40 text-cyan-400 text-sm font-medium rounded border border-zinc-800 hover:border-cyan-500/50 transition-all flex items-center gap-2 shadow-[0_0_5px_rgba(6,182,212,0)] hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
      >
        👀 Text Review
      </button>
      
      <span className="text-[10px] text-zinc-600 font-mono text-center leading-tight mt-1">
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
    <div className="flex h-screen w-full flex-col bg-[#050505] font-sans p-6 text-zinc-300">
      <header className="mb-5 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400 tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Agent Flow</h1>
          <p className="text-sm font-mono text-zinc-500 mt-1 uppercase tracking-widest">Neon Obsidian Laboratory</p>
        </div>
      </header>
      <main className="flex-1 w-full bg-[#09090b] rounded-2xl border border-zinc-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          colorMode="dark"
        >
          <Background color="#3f3f46" gap={20} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-[#09090b] !border-zinc-800 !fill-zinc-400" />
          <MiniMap />
          <FlowPanel addNode={addNode} />
        </ReactFlow>
      </main>
    </div>
  );
}
