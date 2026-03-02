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
import { ToolbarPanel } from '../../components/panels/ToolbarPanel';
import { NodeEditorPanel } from '../../components/panels/NodeEditorPanel';

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
          <ToolbarPanel />
          <NodeEditorPanel />

          <Background color="#3f3f46" gap={20} variant={BackgroundVariant.Dots} size={1} />
          <Controls position="center-right" className="bg-zinc-900! border-zinc-800! fill-zinc-400!" />
          <MiniMap position="bottom-left" className="bg-zinc-900! border-zinc-800!" maskColor="rgba(0,0,0,0.5)" nodeColor="#3f3f46" />
        </ReactFlow>
      </main>
    </div>
  );
}
