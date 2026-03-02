"use client";
import { ReactFlow, Background, Controls, MiniMap, Panel, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TextUpdaterNode } from '../../components/nodes/TextUpdaterNode';
import { TestNode } from '../../components/nodes/TestNode';
import { AITextGenerate } from '../../components/nodes/AITextGenerate';
import { TextReview } from '../../components/nodes/TextReview';
import { ButtonEdge } from '../../components/edges/ButtonEdge';
import { useFlowStore } from '../store/useFlowStore';
import { NodeSettings } from '../../components/nodes/NodeSettings';

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  test: TestNode,
  aiTextGenerate: AITextGenerate,
  textReview: TextReview,
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

export default function Home() {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  const isRunning = useFlowStore((state) => state.isRunning);
  const runFlow = useFlowStore((state) => state.runFlow);
  const addNode = useFlowStore((state) => state.addNode);

  const selectedNode = nodes.find(n => n.selected);

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
          <Panel position="top-left" className="w-80 h-[calc(100vh-32px)] border border-zinc-800 bg-[#09090b]/95 backdrop-blur-md rounded-xl flex flex-col z-10 shadow-xl overflow-hidden pointer-events-auto my-4 ml-4">
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

            <div className="flex-1 overflow-y-auto p-5">
              {selectedNode ? (
                <NodeSettings nodeId={selectedNode.id} />
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
          <Controls className="bg-zinc-900! border-zinc-800! fill-zinc-400!" />
          <MiniMap className="bg-zinc-900! border-zinc-800!" maskColor="rgba(0,0,0,0.5)" nodeColor="#3f3f46" />
        </ReactFlow>
      </main>
    </div>
  );
}
