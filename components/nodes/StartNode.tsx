import { type NodeProps, Position } from '@xyflow/react';
import { BaseNode, BaseHandle } from './BaseNode';

export function StartNode({ id, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected || false}
      icon="🚀"
      themeColor="rose"
    >
      {/* Starting point only has an execution output */}
      <BaseHandle type="source" position={Position.Right} id="exec-out" />
    </BaseNode>
  );
}
