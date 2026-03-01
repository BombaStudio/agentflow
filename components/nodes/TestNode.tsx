import { Position, Handle, type NodeProps } from '@xyflow/react';
 
export function TestNode({ data }: NodeProps) {
  return (
    <div className="rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm min-w-[150px] text-center">
      <div className="text-sm font-medium text-slate-900">
        {data?.label ? String(data.label) : 'Test Node'}
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-400" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-400" />
    </div>
  );
}