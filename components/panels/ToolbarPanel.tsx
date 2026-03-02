import { Panel } from "@xyflow/react";
import { useFlowStore } from "../../src/store/useFlowStore";

export function ToolbarPanel() {
    const addNode = useFlowStore((state) => state.addNode);
    return (
        <Panel position="top-left" className="w-80 h-[calc(100vh-32px)] border border-zinc-800 bg-[#09090b]/95 backdrop-blur-md rounded-xl flex flex-col z-10 shadow-xl overflow-hidden pointer-events-auto my-4 ml-4">
                    <div className="p-5 border-b border-zinc-800/80">
                      <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Agent Flow</h1>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Studio Mode</p>
                    </div>
                    
                    <div className="p-4 border-b border-zinc-800/80 flex flex-col gap-2">
                      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-1">Toolbox</h2>
                      <button
                        onClick={() => addNode('aiTextGenerate')}
                        className="w-full px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded border border-zinc-800 transition-all flex items-center justify-start gap-4"
                      >
                        <span className="text-emerald-500">✨</span> AI Generate
                      </button>
                      
                      <button
                        onClick={() => addNode('textReview')}
                        className="w-full px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded border border-zinc-800 transition-all flex items-center justify-start gap-4"
                      >
                        <span className="text-cyan-500">👀</span> Text Review
                      </button>
                    </div>
                    </Panel>
    );
}