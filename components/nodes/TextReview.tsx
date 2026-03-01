import { useCallback } from 'react';
import { Position, Handle, type NodeProps, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';

export function TextReview({ id, data }: NodeProps) {
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
    <div className="rounded-xl border-2 border-emerald-200 bg-white shadow-md w-[320px] overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center group">
        <div className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
          <span>👀 Text Review</span>
        </div>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
          title="Node'u Sil"
        >
          🗑️
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gelen Metin</label>
        
        <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 min-h-[100px] whitespace-pre-wrap max-h-[250px] overflow-y-auto w-full">
          {contentToReview ? (
            String(contentToReview)
          ) : (
            <span className="text-slate-400 italic">Henüz bir veri gelmedi. Lütfen yapay zeka çıktısını bağlayın.</span>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
    </div>
  );
}
