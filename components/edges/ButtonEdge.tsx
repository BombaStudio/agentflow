import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';

export function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: selected ? '#3b82f6' : '#52525b',
          strokeWidth: 2,
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
