import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
 
export function TestNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected || false}
      title={data?.label ? String(data.label) : 'Test Node'}
      icon="🧪"
      themeColor="purple"
      minWidth={180}
    >
      <div className="text-sm font-mono text-purple-300 text-center py-2">
        A simple testing node.
      </div>
    </BaseNode>
  );
}