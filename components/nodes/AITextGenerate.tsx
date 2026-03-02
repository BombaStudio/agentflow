import { type NodeProps, Position } from '@xyflow/react';
import { BaseNode, BaseHandle } from './BaseNode';

export function AITextGenerate({ id, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected || false}
      icon="✨"
      themeColor="emerald"
    >
      {/* Execution (Flow) Handles */}
      <BaseHandle type="target" position={Position.Left} id="exec-in" />
      <BaseHandle type="source" position={Position.Right} id="exec-out" />

      {/* Data Input/Output Handles */}
      <BaseHandle type="input" position={Position.Top} id="data-in" />
      <BaseHandle type="output" position={Position.Bottom} id="data-out" />
    </BaseNode>
  );
}
