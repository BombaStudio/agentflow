import { useCallback } from 'react';
import { Position, Handle, type NodeProps, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';

export function TextReview({ id, data, selected }: NodeProps) {
  // Sol taraftan ('target') gelen bağlantıları tespit et
  const connections = useHandleConnections({ type: 'target' });
  
  // Bulunan bağlantıların (kaynak düğümlerin) ürettiği node data'ları oku
  const connectedNodesData = useNodesData(connections.map((c) => c.source));
  
  // En basit yaklaşımla ilk bağlantının 'output' verisini alalım
  const incomingData = connectedNodesData[0]?.data;
  const contentToReview = incomingData?.output || data?.label || '';

  const { deleteElements } = useReactFlow();

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return (
    <div className={`rounded-xl border ${selected ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-zinc-800'} bg-zinc-900/60 backdrop-blur-md w-[320px] overflow-hidden transition-all duration-300`}>
      <div className="bg-zinc-950/50 px-4 py-2 flex justify-between items-center group border-b border-zinc-800/80">
        <div className="text-sm font-semibold text-cyan-400 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]">
          <span>👀 Text Review</span>
        </div>
        <button
          onClick={onDelete}
          className="text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 drop-shadow-[0_0_5px_rgba(239,68,68,0)] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          title="Node'u Sil"
        >
          🗑️
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-2.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Incoming Data</label>
        
        <div className="text-sm font-mono text-cyan-300 bg-black/60 p-3 rounded border border-zinc-800/80 min-h-[100px] whitespace-pre-wrap max-h-[250px] overflow-y-auto w-full">
          {contentToReview ? (
            String(contentToReview)
          ) : (
            <span className="text-zinc-600 italic">No data received. Connect an AI output.</span>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-zinc-900 border border-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-cyan-500 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
    </div>
  );
}
