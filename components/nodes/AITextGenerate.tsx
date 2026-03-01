"use client";
import { useState, useCallback } from 'react';
import { Position, Handle, type NodeProps, useReactFlow } from '@xyflow/react';

export function AITextGenerate({ id, data }: NodeProps) {
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
    <div className="rounded-xl border-2 border-indigo-200 bg-white shadow-md min-w-[280px] overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center group">
        <div className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
          <span>✨ AI Text Generate</span>
        </div>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
          title="Node'u Sil"
        >
          🗑️
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prompt</label>
          <textarea
            className="nodrag text-sm w-full p-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors resize-none"
            rows={3}
            placeholder="Yapay zeka için prompt girin..."
            value={prompt}
            onChange={onChange}
          />
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium py-2 rounded-md transition-colors w-full flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Üretiliyor...
            </span>
          ) : (
            'Generate'
          )}
        </button>

        {typeof data?.output === 'string' && (
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sonuç Özeti</label>
            <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 max-h-20 overflow-y-auto">
              {data.output}
            </div>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-500 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-500 border-2 border-white" />
    </div>
  );
}
