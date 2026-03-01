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
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
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
            className="w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center font-bold shadow-md transition-all"
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
