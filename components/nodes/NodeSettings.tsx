"use client";
import { useFlowStore } from '../../src/store/useFlowStore';

export function NodeSettings({ nodeId }: { nodeId: string }) {
  const node = useFlowStore((state) => state.nodes.find((n) => n.id === nodeId));
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const deleteNode = useFlowStore((state) => state.deleteNode);

  if (!node) return null;

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
        
        {!!node.data?.output && (
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Global Output</label>
            <div className="text-sm text-emerald-400 bg-emerald-950/30 p-3 rounded border border-emerald-900/50 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
              {String(node.data.output)}
            </div>
          </div>
        )}

        <button onClick={() => deleteNode(node.id)} className="mt-4 text-xs font-medium text-red-500 hover:text-red-400 border border-red-900/50 hover:bg-red-950/30 rounded py-2 transition-colors">Düğümü Sil</button>
      </div>
    );
  }

  if (node.type === 'textReview') {
    // Find connected source output
    const incomingEdges = edges.filter((e) => e.target === node.id);
    const sourceNodes = incomingEdges.map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean);
    const incomingData = sourceNodes.map((n) => n?.data?.output).filter(Boolean);

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
