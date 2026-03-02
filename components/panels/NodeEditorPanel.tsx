import { Panel } from "@xyflow/react";
import { NodeSettings } from "../nodes/NodeSettings";
import { useFlowStore } from "../../src/store/useFlowStore";

export function NodeEditorPanel() {
    const selectedNode = useFlowStore((state) => state.nodes.find(n => n.selected));
    const runFlow = useFlowStore((state) => state.runFlow);
    const isRunning = useFlowStore((state) => state.isRunning);
    return (
        <Panel position="top-right" className="w-80 h-[calc(100vh-32px)] border border-zinc-800 bg-[#09090b]/95 backdrop-blur-md rounded-xl flex flex-col z-10 shadow-xl overflow-hidden pointer-events-auto my-4 ml-4">
            <div className="flex-1 overflow-y-auto p-5">
              {selectedNode ? (
                <NodeSettings nodeId={selectedNode.id} />
              ) : (
                <div className="text-sm text-zinc-500 text-center mt-10 flex flex-col items-center">
                  <span className="text-4xl mb-4 opacity-20">🖱️</span>
                  Canvas'tan detaylarını görmek için bir dğüm seçin.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800/80 bg-[#09090b]">
              <button 
                onClick={runFlow}
                disabled={isRunning}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-semibold rounded flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {isRunning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                    Çalışıyor...
                  </>
                ) : (
                  '▶ Run Flow'
                )}
              </button>
            </div>
          </Panel>
    );
}