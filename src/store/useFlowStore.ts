import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
} from '@xyflow/react';
import type { Node, Edge } from '../../types';

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
  isRunning: boolean;
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string) => void;
  updateNodeData: (id: string, data: Partial<Node['data']>) => void;
  deleteNode: (id: string) => void;
  runFlow: () => Promise<void>;
};

const initialNodes: Node[] = [
  { id: 'generate-1', type: 'aiTextGenerate', position: { x: 100, y: 100 }, data: { prompt: '' } },
  { id: 'review-1', type: 'textReview', position: { x: 300, y: 100 }, data: {} },
];
const initialEdges: Edge[] = [
  { id: 'e1', source: 'generate-1', target: 'review-1', type: 'buttonedge', animated: true }
];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isRunning: false,

  onNodesChange: (changes: NodeChange<Node>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange<Edge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, type: 'buttonedge' }, get().edges),
    });
  },

  addNode: (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
      data: type === 'aiTextGenerate' ? { prompt: '' } : {},
    };
    set({ nodes: get().nodes.concat(newNode) });
  },

  updateNodeData: (id: string, data: Partial<Node['data']>) => {
    set({
      nodes: get().nodes.map((node) => 
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
    });
  },

  runFlow: async () => {
    if (get().isRunning) return;
    set({ isRunning: true });

    const nodes = get().nodes;
    const edges = get().edges;

    // Build Execution Graph Data Structures (Topological Sort)
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    nodes.forEach((n) => {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    });

    edges.forEach((e) => {
      if (inDegree.has(e.target) && adjList.has(e.source)) {
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
        adjList.get(e.source)!.push(e.target);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    // Execute nodes in topological order
    while (queue.length > 0) {
      const currId = queue.shift()!;
      const currNode = get().nodes.find((n) => n.id === currId);
      
      if (currNode) {
         // Yüklenme efekti için küçük bir gecikme
         await new Promise((resolve) => setTimeout(resolve, 800));

         if (currNode.type === 'aiTextGenerate') {
             if (currNode.data?.prompt) {
                const output = `[Agent] -> Yapay Zeka Çıktısı:\nSorduğunuz "${currNode.data.prompt}" komutu başarıyla işlendi. (Topological Order via Graph Execution)`;
                get().updateNodeData(currNode.id, { output });
             }
         }
         
         if (currNode.type === 'textReview') {
             const incomingEdgesToMe = edges.filter(e => e.target === currId);
             const incomingSources = incomingEdgesToMe.map(e => e.source);
             
             let textData = [];
             for (const src of incomingSources) {
                 const prevNode = get().nodes.find(n => n.id === src);
                 if (prevNode && prevNode.data?.output) {
                     textData.push(String(prevNode.data.output));
                 }
             }
             // Instead of modifying, we can store it, or TextReview node directly reads connected node's outputs at render time via `useNodesData` as it currently does. We don't necessarily have to inject it into its data, but we can to mark it as executed.
         }
      }

      // Unlock neighbors
      adjList.get(currId)?.forEach((neighbor) => {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    set({ isRunning: false });
  },
}));
