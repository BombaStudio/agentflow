import { ReactNode } from 'react';
import { useReactFlow, Handle, Position } from '@xyflow/react';

export interface BaseNodeProps {
  id: string;
  selected: boolean;
  title: string;
  icon?: string;
  themeColor?: 'emerald' | 'cyan' | 'purple' | 'rose' | 'amber';
  children: ReactNode;
  minWidth?: number;
  hasTargetHandle?: boolean;
  hasSourceHandle?: boolean;
  hasReviewHandle?: boolean;

  hasDeleteButton?: boolean;
}

const themeConfigs = {
  emerald: {
    border: 'border-emerald-500',
    shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    text: 'text-emerald-400',
    dropShadow: 'drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]',
    handle: 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    targetHandle: 'bg-zinc-900 border-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]',
  },
  cyan: {
    border: 'border-cyan-500',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    text: 'text-cyan-400',
    dropShadow: 'drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]',
    handle: 'bg-cyan-500 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    targetHandle: 'bg-zinc-900 border-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]',
  },
  purple: {
    border: 'border-purple-500',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    text: 'text-purple-400',
    dropShadow: 'drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]',
    handle: 'bg-purple-500 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
    targetHandle: 'bg-zinc-900 border-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)]',
  },
  rose: {
    border: 'border-rose-500',
    shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    text: 'text-rose-400',
    dropShadow: 'drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]',
    handle: 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    targetHandle: 'bg-zinc-900 border-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]',
  },
  amber: {
    border: 'border-amber-500',
    shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    text: 'text-amber-400',
    dropShadow: 'drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]',
    handle: 'bg-amber-500 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    targetHandle: 'bg-zinc-900 border-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]',
  },
};

export function BaseNode({
  id,
  selected,
  title,
  icon,
  themeColor = 'emerald',
  children,
  minWidth = 280,
  hasTargetHandle = true,
  hasSourceHandle = true,
  hasReviewHandle = false,
}: BaseNodeProps) {
  const { deleteElements } = useReactFlow();
  const theme = themeConfigs[themeColor];

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div 
      className={`rounded-xl border ${selected ? `${theme.border} ${theme.shadow}` : 'border-zinc-800'} bg-zinc-900/60 backdrop-blur-md overflow-hidden transition-all duration-300`}
      style={{ minWidth: `${minWidth}px` }}
    >
      {/* Header Section */}
      <div className="bg-zinc-950/50 px-4 py-2 flex justify-between items-center group border-b border-zinc-800/80">
        <div className={`text-sm font-semibold ${theme.text} flex items-center gap-2 ${theme.dropShadow}`}>
          <span>{icon} {title}</span>
        </div>
        <button
          onClick={onDelete}
          className="text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 drop-shadow-[0_0_5px_rgba(239,68,68,0)] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          title="Node'u Sil"
        >
          🗑️
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col gap-4">
        {children}
      </div>

      {hasTargetHandle && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className={`w-2.5 h-2.5 ${theme.targetHandle}`} 
        />
      )}
      {hasSourceHandle && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className={`w-2.5 h-2.5 ${theme.handle}`} 
        />
      )}
      {hasReviewHandle && (
        <Handle 
          type="target" 
          position={Position.Bottom} 
          className={`w-2.5 h-2.5 ${theme.targetHandle}`} 
        />
      )}
    </div>
  );
}
