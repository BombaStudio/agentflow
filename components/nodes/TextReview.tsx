import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function TextReview({ id, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      selected={selected || false}
      icon="👀"
      themeColor="cyan"
    />
  );
}
