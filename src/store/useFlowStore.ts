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
  activeEdges: string[];
  onNodesChange: (changes: NodeChange<Node>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string) => void;
  updateNodeData: (id: string, data: Partial<Node['data']>) => void;
  deleteNode: (id: string) => void;
  runFlow: () => Promise<void>;
};

const initialNodes: Node[] = [
  { id: 'start-1', type: 'start', position: { x: 50, y: 100 }, data: {}, deletable: false },
  { id: 'generate-1', type: 'aiTextGenerate', position: { x: 300, y: 100 }, data: { prompt: '' } },
  { id: 'review-1', type: 'textReview', position: { x: 600, y: 100 }, data: {} },
];
const initialEdges: Edge[] = [
  { id: 'e0', source: 'start-1', target: 'generate-1', sourceHandle: 'exec-out', targetHandle: 'exec-in', type: 'buttonedge' },
  { id: 'e1', source: 'generate-1', target: 'review-1', sourceHandle: 'exec-out', targetHandle: 'exec-in', type: 'buttonedge' }
];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isRunning: false,
  activeEdges: [],

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
    set({ isRunning: true, activeEdges: [] });

    const nodes = get().nodes;
    const edges = get().edges;

    // Build Execution Graph Data Structures (Topological Sort)
    // Sadece exec-out ve exec-in olanları dahil et:
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    nodes.forEach((n) => {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    });

    edges.forEach((e) => {
      // Data edges should theoretically NOT restrict execution in topological sort strictly,
      // but for simplicity in this flow, they might unless we check `targetHandle === 'exec-in'`
      const isExec = e.sourceHandle === 'exec-out' || e.targetHandle === 'exec-in';
      if (isExec && inDegree.has(e.target) && adjList.has(e.source)) {
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
      
      // Node çalışmadan hemen önce, bu node'a gelen execution edge'leri yeşil yapalım
      set((state) => {
        const incomingEdges = state.edges.filter(e => e.target === currId && (e.targetHandle === 'exec-in' || e.sourceHandle === 'exec-out')).map(e => e.id);
        return { activeEdges: [...state.activeEdges, ...incomingEdges] };
      });

      const currNode = get().nodes.find((n) => n.id === currId);
      
      if (currNode) {
         await new Promise((resolve) => setTimeout(resolve, 800));

         if (currNode.type === 'aiTextGenerate') {
             if (currNode.data?.prompt) {
                const output = `[Agent] -> Yapay Zeka Çıktısı:\nSorduğunuz "${currNode.data.prompt}" komutu başarıyla işlendi.`;
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

    set({ isRunning: false, activeEdges: [] });
  },
}));
