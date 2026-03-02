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
          stroke: selected ? '#8B5CF6' : '#06B6D4',
          strokeWidth: 2,
          filter: selected ? 'drop-shadow(0 0 5px #8B5CF6)' : 'drop-shadow(0 0 3px #06B6D4)'
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // pointerEvents is needed because otherwise EdgeLabelRenderer disables click events
            pointerEvents: 'all',
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-red-500 hover:bg-red-600 text-black rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all"
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
