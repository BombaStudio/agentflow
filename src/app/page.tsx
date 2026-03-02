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
  { id: 'generate-1', type: 'aiTextGenerate', position: { x: 100, y: 100 }, data: { prompt: '' } },
  { id: 'review-1', type: 'textReview', position: { x: 300, y: 100 }, data: {} },
];
const initialEdges : Edge[] = [
  { id: 'e1', source: 'generate-1', target: 'review-1', type: 'buttonedge', animated: true }
];

function NodeSettings({ node, updateNodeData, nodes, edges, deleteNode }: any) {
  if (node.type === 'aiTextGenerate') {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">✨ AI Generate Settings</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Prompt</label>
          <textarea
            className="w-full p-2.5 border border-zinc-700 rounded bg-zinc-900 text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors resize-y min-h-[100px] text-sm"
            placeholder="System instructions here..."
            value={(node.data?.prompt as string) || ''}
            onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
          />
        </div>
        
        {node.data?.output && (
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Global Output</label>
            <div className="text-sm text-emerald-400 bg-emerald-950/30 p-3 rounded border border-emerald-900/50 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
              {node.data.output as string}
            </div>
          </div>
        )}

        <button onClick={() => deleteNode(node.id)} className="mt-4 text-xs font-medium text-red-500 hover:text-red-400 border border-red-900/50 hover:bg-red-950/30 rounded py-2 transition-colors">Düğümü Sil</button>
      </div>
    );
  }

  if (node.type === 'textReview') {
    // Find connected source output
    const incomingEdges = edges.filter((e: any) => e.target === node.id);
    const sourceNodes = incomingEdges.map((e: any) => nodes.find((n: any) => n.id === e.source)).filter(Boolean);
    const incomingData = sourceNodes.map((n: any) => n.data?.output).filter(Boolean);

    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">👀 Text Review Settings</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Incoming Data</label>
          <div className="text-sm text-cyan-400 bg-cyan-950/30 p-3 rounded border border-cyan-900/50 min-h-[100px] max-h-60 overflow-y-auto whitespace-pre-wrap font-mono">
            {incomingData.length > 0 ? incomingData.join('\n\n---\n\n') : <span className="text-zinc-500 italic">No incoming data... Connect AI node first.</span>}
          </div>
        </div>
        <button onClick={() => deleteNode(node.id)} className="mt-4 text-xs font-medium text-red-500 hover:text-red-400 border border-red-900/50 hover:bg-red-950/30 rounded py-2 transition-colors">Düğümü Sil</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-zinc-100 capitalize">{node.type} Settings</h3>
      <p className="text-sm text-zinc-400">Bu düğüm için ayar bulunmuyor.</p>
      <button onClick={() => deleteNode(node.id)} className="mt-4 text-xs font-medium text-red-500 hover:text-red-400 border border-red-900/50 hover:bg-red-950/30 rounded py-2 transition-colors">Düğümü Sil</button>
    </div>
  );
}

export default function Home() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);

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

  const selectedNode = nodes.find(n => n.selected);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, []);

  const runFlow = async () => {
    setIsRunning(true);
    // Basic Flow Sequencer: evaluates all AI Generate nodes immediately 
    const generateNodes = nodes.filter(n => n.type === 'aiTextGenerate');
    
    // Yüklenme animasyonu ve süreci vermek adına yapay bekleme
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    for (const node of generateNodes) {
      if (!node.data?.prompt) continue;
      const output = `[Agent] -> Yapay Zeka Çıktısı:\n\nSorduğunuz "${node.data.prompt}" komutu başarıyla işlendi.`;
      updateNodeData(node.id, { output });
    }
    
    setIsRunning(false);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 font-sans text-zinc-300 overflow-hidden">
      {/* Main Canvas Area */}
      <main className="flex-1 h-full relative">
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
          {/* ReactFlow Panel olark Sidebar'ı içeri alıyoruz */}
          <Panel position="top-left" className="w-80 h-[calc(50vh-32px)] border border-zinc-800 bg-[#09090b]/95 backdrop-blur-md rounded-xl flex flex-col z-10 shadow-xl overflow-hidden pointer-events-auto my-4 ml-4">
            <div className="p-5 border-b border-zinc-800/80">
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Agent Flow</h1>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Studio Mode</p>
            </div>
            
            <div className="p-4 border-b border-zinc-800/80 flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-1">Toolbox</h2>
              <button
                onClick={() => addNode('aiTextGenerate')}
                className="w-full px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded border border-zinc-800 transition-all flex items-center justify-start gap-4"
              >
                <span className="text-emerald-500">✨</span> AI Generate
              </button>
              
              <button
                onClick={() => addNode('textReview')}
                className="w-full px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded border border-zinc-800 transition-all flex items-center justify-start gap-4"
              >
                <span className="text-cyan-500">👀</span> Text Review
              </button>
            </div>
          </Panel>

          <Panel position="top-right" className="w-80 h-[calc(100vh-32px)] border border-zinc-800 bg-[#09090b]/95 backdrop-blur-md rounded-xl flex flex-col z-10 shadow-xl overflow-hidden pointer-events-auto my-4 ml-4">

            <div className="flex-1 overflow-y-auto p-5">
              {selectedNode ? (
                <NodeSettings 
                  node={selectedNode} 
                  updateNodeData={updateNodeData} 
                  nodes={nodes} 
                  edges={edges} 
                  deleteNode={deleteNode} 
                />
              ) : (
                <div className="text-sm text-zinc-500 text-center mt-10 flex flex-col items-center">
                  <span className="text-4xl mb-4 opacity-20">🖱️</span>
                  Canvas'tan detaylarını görmek için bir dğüm seçin.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800/80 bg-[#09090b]">
              <button 
                onClick={runFlow}
                disabled={isRunning}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {isRunning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                    Çalışıyor...
                  </>
                ) : (
                  '▶ Run Flow'
                )}
              </button>
            </div>
          </Panel>

          <Background color="#3f3f46" gap={20} variant={BackgroundVariant.Dots} size={1} />
          {/*<Controls position="center-left" className="bg-zinc-900! border-zinc-800! fill-zinc-400!" />*/}
          <MiniMap position="bottom-left" className="bg-zinc-900! border-zinc-800!" maskColor="rgba(0,0,0,0.5)" nodeColor="#3f3f46" />
        </ReactFlow>
      </main>
    </div>
  );
}
