import { ReactNode } from 'react';
import { Handle, HandleProps, Position } from '@xyflow/react';

export interface BaseHandleProps extends Omit<HandleProps, 'type'> {
  type: 'source' | 'target' | 'input' | 'output';
}

export function BaseHandle({ type, className, ...props }: BaseHandleProps) {
  // Map our custom types to React Flow handle types
  // 'target' and 'input' both act as receivers (React Flow 'target')
  // 'source' and 'output' both act as emitters (React Flow 'source')
  const xyflowType = (type === 'target' || type === 'input') ? 'target' : 'source';

  let handleStyle = '';

  // N8n-like visual distinction
  if (type === 'target' || type === 'source') {
    // Execution flow handles
    handleStyle = 'w-3 h-4 !bg-zinc-700 !border-2 !border-zinc-500 !rounded-[2px] z-10';
  } else {
    // Data handles
    handleStyle = 'w-3 h-3 !bg-blue-500/80 !border-2 !border-white/80 !rounded-full z-10 hover:!bg-blue-400 hover:scale-110 transition-all cursor-crosshair';
  }

  return (
    <Handle 
      {...props}
      type={xyflowType}
      className={`${handleStyle} ${className || ''}`} 
    />
  );
}

export interface BaseNodeProps {
  id: string;
  selected: boolean;
  icon?: string;
  themeColor?: 'blue' | 'zinc' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
  children?: ReactNode;
}

const colorMap: Record<string, string> = {
  emerald: 'text-emerald-400 border-emerald-500/50',
  blue: 'text-blue-400 border-blue-500/50',
  cyan: 'text-cyan-400 border-cyan-500/50',
  purple: 'text-purple-400 border-purple-500/50',
  zinc: 'text-zinc-400 border-zinc-500/50',
  amber: 'text-amber-400 border-amber-500/50',
  rose: 'text-rose-400 border-rose-500/50',
};

const activeColorMap: Record<string, string> = {
  emerald: 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]',
  blue: 'border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.2)]',
  cyan: 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]',
  purple: 'border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.2)]',
  zinc: 'border-zinc-400 shadow-[0_0_15px_rgba(161,161,170,0.2)]',
  amber: 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
  rose: 'border-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.2)]',
};

export function BaseNode({
  selected,
  icon,
  themeColor = 'zinc',
  children,
}: BaseNodeProps) {
  const baseColor = colorMap[themeColor] || colorMap.zinc;
  const activeColor = activeColorMap[themeColor] || activeColorMap.zinc;
  
  const selectedClass = selected 
    ? activeColor
    : 'border-zinc-800 hover:border-zinc-600';

  return (
    <div 
      className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 bg-zinc-900 transition-all ${selectedClass} ${baseColor.split(' ')[0]}`}
    >
      <span className="text-2xl pointer-events-none drop-shadow-md">{icon}</span>
      {children}
    </div>
  );
}
