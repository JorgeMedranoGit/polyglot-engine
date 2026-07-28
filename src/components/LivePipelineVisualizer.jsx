import React from 'react';
import { Cpu, Sparkles, CheckCircle2, ShieldCheck, Activity, Terminal, Database, ArrowRight } from 'lucide-react';

export default function LivePipelineVisualizer({ currentPhase, phasePercent, currentMessage, liveTokens }) {
  const phases = [
    { id: 1, title: 'AST & System Graph Parsing', icon: <Cpu className="w-4 h-4" /> },
    { id: 2, title: 'Neural-Symbolic Analysis', icon: <Activity className="w-4 h-4" /> },
    { id: 3, title: 'AWS Bedrock LLM Synthesis', icon: <Sparkles className="w-4 h-4" /> },
    { id: 4, title: 'Differential Proof & Benchmark', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="catppuccin-card-glow rounded-2xl p-5 border border-ctp-mauve/40 shadow-2xl relative overflow-hidden my-4 animate-fade-in">
      
      {/* Background Animated Gradient Pulse */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ctp-mauve/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-ctp-surface1/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ctp-mauve/20 border border-ctp-mauve/40 text-ctp-mauve">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ctp-text uppercase tracking-wider flex items-center gap-2">
              Pipeline de Transpilación en Tiempo Real
              <span className="px-2 py-0.5 text-[10px] font-mono bg-ctp-mauve text-ctp-crust rounded font-extrabold animate-pulse">
                EN VIVO
              </span>
            </h3>
            <p className="text-xs text-ctp-subtext font-mono mt-0.5">
              {currentMessage || 'Analizando dependencias y generando handlers en AWS Bedrock...'}
            </p>
          </div>
        </div>

        {/* Live Token Counter */}
        <div className="flex items-center gap-3 bg-ctp-crust/80 px-3 py-1.5 rounded-xl border border-ctp-surface0 font-mono text-xs">
          <Terminal className="w-4 h-4 text-ctp-blue" />
          <span className="text-ctp-subtext">Tokens Procesados:</span>
          <span className="text-ctp-green font-bold">{liveTokens || 142}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-ctp-crust rounded-full h-3 mb-6 p-0.5 overflow-hidden border border-ctp-surface0">
        <div
          className="bg-gradient-to-r from-ctp-mauve via-ctp-blue to-ctp-green h-full rounded-full transition-all duration-300 relative shadow-lg shadow-ctp-mauve/30"
          style={{ width: `${phasePercent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
        </div>
      </div>

      {/* 4 Pipeline Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {phases.map((phase) => {
          const isDone = currentPhase > phase.id;
          const isCurrent = currentPhase === phase.id;

          return (
            <div
              key={phase.id}
              className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                isDone
                  ? 'bg-ctp-green/10 border-ctp-green/40 text-ctp-green'
                  : isCurrent
                  ? 'bg-ctp-mauve/15 border-ctp-mauve shadow-lg shadow-ctp-mauve/10 scale-105'
                  : 'bg-ctp-crust/60 border-ctp-surface0 text-ctp-overlay0'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-ctp-mauve text-ctp-crust' : isDone ? 'bg-ctp-green/20 text-ctp-green' : 'bg-ctp-surface0 text-ctp-overlay0'}`}>
                  {phase.icon}
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-ctp-green" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-ctp-mauve animate-ping" />
                ) : null}
              </div>

              <span className={`text-xs font-semibold ${isCurrent ? 'text-ctp-mauve font-bold' : isDone ? 'text-ctp-green' : 'text-ctp-subtext'}`}>
                Fase {phase.id}: {phase.title}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
