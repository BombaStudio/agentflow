import { type NodeProps, useHandleConnections, useNodesData } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function TextReview({ id, data, selected }: NodeProps) {
  // Sol taraftan ('target') gelen bağlantıları tespit et
  const connections = useHandleConnections({ type: 'target' });
  
  // Bulunan bağlantıların (kaynak düğümlerin) ürettiği node data'ları oku
  const connectedNodesData = useNodesData(connections.map((c) => c.source));
  
  // En basit yaklaşımla ilk bağlantının 'output' verisini alalım
  const incomingData = connectedNodesData[0]?.data;
  const contentToReview = incomingData?.output || data?.label || '';

  return (
    <BaseNode
      id={id}
      selected={selected || false}
      title="Text Review"
      icon="👀"
      themeColor="cyan"
      minWidth={320}
    >
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Incoming Data</label>
        
        <div className="text-sm font-mono text-cyan-300 bg-black/60 p-3 rounded border border-zinc-800/80 min-h-[100px] whitespace-pre-wrap max-h-[250px] overflow-y-auto w-full">
          {contentToReview ? (
            String(contentToReview)
          ) : (
            <span className="text-zinc-600 italic">No data received. Connect an AI output.</span>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
