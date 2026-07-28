import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle2, Cloud, AlertCircle } from 'lucide-react';

export default function AwsConfigModal({ isOpen, onClose, awsConfig, onSaveConfig }) {
  if (!isOpen) return null;

  const [region, setRegion] = useState(awsConfig.region || 'us-east-1');
  const [accessKeyId, setAccessKeyId] = useState(awsConfig.accessKeyId || '');
  const [secretAccessKey, setSecretAccessKey] = useState(awsConfig.secretAccessKey || '');
  const [modelId, setModelId] = useState(awsConfig.modelId || 'anthropic.claude-3-5-sonnet-20240620-v1:0');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig({ region, accessKeyId, secretAccessKey, modelId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111722] border border-aws-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-aws-orange/10 border border-aws-orange/30 text-aws-orange">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Configuración AWS Bedrock</h3>
            <p className="text-xs text-slate-400">Credenciales e Invocación Directa de Modelos Cloud</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-medium mb-1">Región AWS</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="us-east-1"
              className="w-full bg-[#0b0e14] border border-aws-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-kiro-purple"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">AWS Access Key ID</label>
            <input
              type="text"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className="w-full bg-[#0b0e14] border border-aws-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-kiro-purple"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">AWS Secret Access Key</label>
            <input
              type="password"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              className="w-full bg-[#0b0e14] border border-aws-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-kiro-purple"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Model ID de Bedrock</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-[#0b0e14] border border-aws-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-kiro-purple cursor-pointer"
            >
              <option value="anthropic.claude-3-5-sonnet-20240620-v1:0">Claude 3.5 Sonnet (Recomendado)</option>
              <option value="anthropic.claude-v2">Claude v2</option>
              <option value="amazon.titan-text-express-v1">Amazon Titan Text Express</option>
            </select>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Nota: Si dejas las llaves en blanco, el sistema funcionará automáticamente en <strong>Modo Demo de Alta Fidelidad</strong> para pruebas sin costo.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-aws-orange hover:bg-amber-500 text-slate-950 font-bold transition-colors"
            >
              Guardar Configuración
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
