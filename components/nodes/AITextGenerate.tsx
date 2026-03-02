"use client";
import { useState, useCallback } from 'react';
import { Position, Handle, type NodeProps, useReactFlow } from '@xyflow/react';

export function AITextGenerate({ id, data, selected }: NodeProps) {
  const { updateNodeData, deleteElements } = useReactFlow();
  const [prompt, setPrompt] = useState((data?.prompt as string) || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const onGenerate = useCallback(() => {
    setIsGenerating(true);
    // Mock AI API call ile gecikmeli çıktı süreci
    setTimeout(() => {
      const generatedText = `Yapay Zeka Çıktısı (Prompt: "${prompt}")\n\nCevap: Bu metin sistem tarafından otomatik oluşturulmuştur. Harika bir iş çıkardın!`;
      
      // Çıktıyı global Node Data içerisine aktarıyoruz ki bağlantı yapılan diğer nodelar okuyabilsin
      updateNodeData(id, { output: generatedText });
      setIsGenerating(false);
    }, 1500);
  }, [prompt, id, updateNodeData]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setPrompt(newVal);
    // İsteğe bağlı: Promptu da node data içinde tutabiliriz
    updateNodeData(id, { prompt: newVal });
  };

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return (
    <div className={`rounded-xl border ${selected ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-zinc-800'} bg-zinc-900/60 backdrop-blur-md min-w-[280px] overflow-hidden transition-all duration-300`}>
      <div className="bg-zinc-950/50 px-4 py-2 flex justify-between items-center group border-b border-zinc-800/80">
        <div className="text-sm font-semibold text-emerald-400 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]">
          <span>✨ AI Text Generate</span>
        </div>
        <button
          onClick={onDelete}
          className="text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 drop-shadow-[0_0_5px_rgba(239,68,68,0)] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          title="Node'u Sil"
        >
          🗑️
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Prompt</label>
          <textarea
            className="nodrag text-sm w-full p-2.5 border border-zinc-800/80 rounded bg-black/50 text-zinc-200 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-colors resize-none font-mono placeholder:text-zinc-600"
            rows={3}
            placeholder="System instructions here..."
            value={prompt}
            onChange={onChange}
          />
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-emerald-600/90 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-medium py-2 rounded transition-all w-full flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] disabled:shadow-none"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            'Generate'
          )}
        </button>

        {typeof data?.output === 'string' && (
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Output</label>
            <div className="text-xs font-mono text-emerald-300 bg-black/60 p-2.5 rounded border border-zinc-800/80 max-h-24 overflow-y-auto">
              {data.output}
            </div>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-zinc-900 border border-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-emerald-500 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
    </div>
  );
}
