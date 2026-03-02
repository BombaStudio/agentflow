"use client";
import { useState, useCallback } from 'react';
import { type NodeProps, useReactFlow } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function AITextGenerate({ id, data, selected }: NodeProps) {
  const { updateNodeData } = useReactFlow();
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

  return (
    <BaseNode
      id={id}
      selected={selected || false}
      title="AI Text Generate"
      icon="✨"
      themeColor="emerald"
      minWidth={280}
      hasReviewHandle={true}
    >
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
    </BaseNode>
  );
}
