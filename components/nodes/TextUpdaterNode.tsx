"use client";
import { useCallback } from "react";
import { Position, Handle, type NodeProps } from '@xyflow/react';


export function TextUpdaterNode({ data }: NodeProps) {
  const onChange = useCallback((evt : React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm min-w-[150px] text-center">
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />

        
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-400" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-400" />
    </div>
  );
}