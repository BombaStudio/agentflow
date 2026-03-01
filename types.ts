import type { Node as XYNode, Edge as XYEdge } from '@xyflow/react';

export interface NodeData extends Record<string, unknown> {
    label?: string;
}

export type Node = XYNode<NodeData>;
export type Edge = XYEdge;