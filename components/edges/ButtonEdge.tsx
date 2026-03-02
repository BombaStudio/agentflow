import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { useFlowStore } from '../../src/store/useFlowStore';

export function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const activeEdges = useFlowStore((state) => state.activeEdges);
  const isRunning = useFlowStore((state) => state.isRunning);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const isExec = sourceHandleId === 'exec-out' || targetHandleId === 'exec-in';
  const isActive = activeEdges.includes(id);

  let strokeColor = selected ? '#3b82f6' : '#52525b';
  if (isRunning && isActive) {
      strokeColor = '#22c55e'; // Çalışırken ulaşılan node'a giden execution yolu yeşil
  }

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: isExec ? 2 : 3,
          strokeDasharray: isExec ? '5,5' : 'none',
          animation: isExec ? 'dashdraw 0.5s linear infinite' : 'none',
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-zinc-800 hover:bg-red-500 text-zinc-400 hover:text-white border border-zinc-700 rounded-full flex items-center justify-center text-xs transition-colors shadow-sm"
            onClick={onEdgeClick}
            title="Bağlantıyı Sil"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
