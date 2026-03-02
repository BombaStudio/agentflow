"use client";
import { useCallback } from "react";
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function TextUpdaterNode({ id, data, selected }: NodeProps) {
  const onChange = useCallback((evt : React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <BaseNode
      id={id}
      selected={selected || false}
      title={data?.label ? String(data.label) : 'Text Input'}
      icon="✏️"
      themeColor="amber"
      minWidth={200}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="text" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Input</label>
        <input 
          id="text" 
          name="text" 
          onChange={onChange} 
          className="nodrag text-sm w-full p-2 border border-zinc-800/80 rounded bg-black/50 text-amber-200 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-colors font-mono" 
        />
      </div>
    </BaseNode>
  );
}