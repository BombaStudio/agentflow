import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function AITextGenerate({ id, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected || false}
      icon="✨"
      themeColor="emerald"
    />
  );
}
