//* * * COMPONENTE DE GRAFO TOPOLOGICO DE ARQUITECTURA * * *
import React, { useState, useEffect } from 'react';
import { Network, Database, Layers, CheckCircle2, ArrowRight, Activity, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function ArchitectureGraph({ nodes, edges, activeNodeIndex, isTranspiling, isVerified, lang = 'es' }) {
  //* * * CARGA DE TRADUCCIONES SEGUN EL IDIOMA * * *
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const [selectedNode, setSelectedNode] = useState(null);
  const [detectedFunctions, setDetectedFunctions] = useState([]);

  //* * * DETECCION Y MAPEO TOPOLOGICO DE FUNCIONES E INVARIANTES * * *
  useEffect(() => {
    if (isTranspiling || isVerified) {
      setDetectedFunctions([
        { id: 'fn1', name: 'handleRequest()', type: 'entry', color: 'border-[#cba6f7] bg-[#1e1e2e] text-[#cba6f7]', caller: 'API Gateway', target: 'Lambda Entry' },
        { id: 'fn2', name: 'validatePayload()', type: 'utility', color: 'border-[#74c7ec] bg-[#1e1e2e] text-[#74c7ec]', caller: 'handleRequest', target: 'Zod Validator' },
        { id: 'fn3', name: 'executeAtomicTransaction()', type: 'core', color: 'border-[#fab387] bg-[#1e1e2e] text-[#fab387]', caller: 'validatePayload', target: 'DynamoDB PutItem' },
        { id: 'fn4', name: 'logCloudWatchMetrics()', type: 'logger', color: 'border-[#a6e3a1] bg-[#1e1e2e] text-[#a6e3a1]', caller: 'executeAtomicTransaction', target: 'CloudWatch Logs' }
      ]);
    } else {
      setDetectedFunctions([
        { id: 'fn1', name: 'main()', type: 'entry', color: 'border-[#cba6f7] bg-[#1e1e2e] text-[#cba6f7]', caller: 'Router', target: 'Handler' },
        { id: 'fn2', name: 'processData()', type: 'core', color: 'border-[#f9e2af] bg-[#1e1e2e] text-[#f9e2af]', caller: 'main', target: 'Service' }
      ]);
    }
  }, [isTranspiling, isVerified]);

  //* * * SCROLL HORIZONTAL DE LA PALETA GRAFICA * * *
  const handleHorizontalWheel = (e) => {
    if (e.deltaY) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  //* * * ESTILOS PALETA CATPPUCCIN MOCHA * * *
  const nodeStyles = [
    { bg: 'bg-[#1e1e2e]', border: 'border-[#cba6f7]', text: 'text-[#cba6f7]', iconBg: 'bg-[#cba6f7]/15 text-[#cba6f7]' },
    { bg: 'bg-[#1e1e2e]', border: 'border-[#f5c2e7]', text: 'text-[#f5c2e7]', iconBg: 'bg-[#f5c2e7]/15 text-[#f5c2e7]' },
    { bg: 'bg-[#1e1e2e]', border: 'border-[#a6e3a1]', text: 'text-[#a6e3a1]', iconBg: 'bg-[#a6e3a1]/15 text-[#a6e3a1]' }
  ];

  const displayNodes = nodes || [
    { id: 'n1', label: 'App Controller', type: 'entry', legacyType: 'Spring Controller', targetType: 'API Gateway' },
    { id: 'n2', label: 'Task Service', type: 'service', legacyType: 'Spring @Service', targetType: 'AWS Lambda Core' },
    { id: 'n3', label: 'Task Repository', type: 'model', legacyType: 'JPA Repository', targetType: 'Amazon DynamoDB' }
  ];

  return (
    <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-5 space-y-5 animate-fade-in">
      
      //* * * CABECERA DEL GRAFO DE ARQUITECTURA * * *
      <div className="flex items-center justify-between border-b border-[#313244] pb-3">
        <div className="flex items-center gap-2.5">
          <Network className="w-5 h-5 text-[#cba6f7]" />
          <div>
            <h2 className="text-sm font-bold text-[#cdd6f4]">
              {t.graphTitle}
            </h2>
            <p className="text-xs text-[#a6adc8]">
              {t.graphSubtitle}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#a6adc8] bg-[#181825] px-3 py-1 rounded border border-[#313244]">
          {detectedFunctions.length} {t.functionsDetected}
        </span>
      </div>

      //* * * CANVAS PRINCIPAL DEL GRAFO TOPOLOGICO * * *
      <div
        onWheel={handleHorizontalWheel}
        className="relative bg-[#11111b] rounded-lg border border-[#313244] p-6 min-h-[360px] flex flex-col justify-between overflow-x-auto select-none"
      >
        
        //* * * LINEAS CONECTORAS SVG ENTRE NODOS * * *
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 min-w-[700px]">
          <path d="M 160 90 L 440 90 L 700 90" fill="none" stroke="#313244" strokeWidth="2" strokeDasharray="6" />
        </svg>

        //* * * FILA PRINCIPAL DE NODOS DE MODULOS * * *
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-5 min-w-[650px]">
          {displayNodes.map((node, idx) => {
            const style = nodeStyles[idx % nodeStyles.length];
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-between min-h-[130px] ${style.bg} ${style.border}`}
              >
                <div className={`p-2.5 rounded-lg mb-2 ${style.iconBg}`}>
                  {node.type === 'entry' ? <Layers className="w-5 h-5" /> : node.type === 'model' ? <Database className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </div>

                <div className="text-center space-y-1">
                  <span className={`text-xs font-bold block ${style.text}`}>
                    {node.label}
                  </span>
                  <span className="text-[11px] font-mono text-[#a6adc8] bg-[#181825] px-2.5 py-0.5 rounded border border-[#313244] inline-block">
                    {node.targetType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        //* * * AREA DE FLUJO DE INVOCACIONES DE FUNCIONES INTERNAS * * *
        <div className="relative z-10 pt-5 border-t border-[#313244] mt-6 min-w-[650px]">
          <div className="text-xs font-semibold text-[#a6adc8] font-mono mb-3">
            {t.flowTitle}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {detectedFunctions.map((fn, idx) => (
              <div
                key={fn.id}
                className={`p-3 rounded-lg border text-xs font-mono transition-all ${fn.color}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-bold truncate">{fn.name}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#181825] text-[#a6adc8] shrink-0 border border-[#313244]">
                    Step #{idx + 1}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#a6adc8] pt-1.5 border-t border-[#313244]">
                  <span className="truncate">{fn.caller}</span>
                  <ArrowRight className="w-3 h-3 text-[#a6adc8] shrink-0 mx-1" />
                  <span className="text-[#a6e3a1] truncate">{fn.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
