import React from 'react';
import { HardDrive, Zap, Activity, DollarSign, Award, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function TelemetryDashboard({ metrics, lang = 'es' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-[#1e1e2e] rounded-xl p-4 border border-[#313244] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#cba6f7]/15 text-[#cba6f7]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#cdd6f4]">
              {t.telemetryTitle}
            </h2>
            <p className="text-xs text-[#a6adc8]">
              {t.telemetrySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#181825] px-3 py-1.5 rounded-lg border border-[#313244] font-mono text-xs">
          <span className="text-[#a6adc8]">{t.estimatedSavings}:</span>
          <span className="text-[#a6e3a1] font-bold">-{metrics.awsCostReductionPercent}% USD</span>
        </div>
      </div>

      {/* 4 Minimal Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* RAM Reduction Card */}
        <div className="bg-[#1e1e2e] rounded-xl p-4 border border-[#313244]">
          <div className="flex items-center justify-between text-[#a6adc8] text-xs mb-1">
            <span className="font-semibold text-[#74c7ec]">{t.ramReduction}</span>
            <HardDrive className="w-4 h-4 text-[#74c7ec]" />
          </div>
          <div className="text-2xl font-bold text-[#74c7ec] font-mono">
            -{metrics.ramReductionPercent}%
          </div>
          
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#a6adc8]">
              <span>{metrics.legacyRamMb} MB (Legacy)</span>
              <span className="text-[#a6e3a1] font-semibold">{metrics.modernRamMb} MB (AWS)</span>
            </div>
            <div className="w-full bg-[#11111b] rounded-full h-1.5 overflow-hidden border border-[#313244]">
              <div
                className="bg-[#74c7ec] h-full rounded-full"
                style={{ width: `${100 - metrics.ramReductionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Speedup Factor Card */}
        <div className="bg-[#1e1e2e] rounded-xl p-4 border border-[#313244]">
          <div className="flex items-center justify-between text-[#a6adc8] text-xs mb-1">
            <span className="font-semibold text-[#f9e2af]">{t.latencyP95}</span>
            <Zap className="w-4 h-4 text-[#f9e2af]" />
          </div>
          <div className="text-2xl font-bold text-[#f9e2af] font-mono">
            {metrics.speedupFactor}x
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#a6adc8]">
              <span className="text-[#f38ba8]">{metrics.legacyLatencyMs} ms</span>
              <ArrowRight className="w-3 h-3 text-[#a6adc8] my-auto" />
              <span className="text-[#a6e3a1] font-semibold">{metrics.modernLatencyMs} ms</span>
            </div>
            <div className="w-full bg-[#11111b] rounded-full h-1.5 overflow-hidden border border-[#313244]">
              <div
                className="bg-[#f9e2af] h-full rounded-full"
                style={{ width: `${Math.min(100, metrics.speedupFactor * 10)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Throughput (TPS) Card */}
        <div className="bg-[#1e1e2e] rounded-xl p-4 border border-[#313244]">
          <div className="flex items-center justify-between text-[#a6adc8] text-xs mb-1">
            <span className="font-semibold text-[#cba6f7]">{t.throughputTps}</span>
            <Activity className="w-4 h-4 text-[#cba6f7]" />
          </div>
          <div className="text-2xl font-bold text-[#cba6f7] font-mono">
            +{metrics.modernTps}
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#a6adc8]">
              <span>{metrics.legacyTps} req/s</span>
              <span className="text-[#cba6f7] font-semibold">AWS Lambda Pool</span>
            </div>
            <div className="w-full bg-[#11111b] rounded-full h-1.5 overflow-hidden border border-[#313244]">
              <div
                className="bg-[#cba6f7] h-full rounded-full"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>

        {/* AWS Cost Reduction Card */}
        <div className="bg-[#1e1e2e] rounded-xl p-4 border border-[#313244]">
          <div className="flex items-center justify-between text-[#a6adc8] text-xs mb-1">
            <span className="font-semibold text-[#a6e3a1]">{t.awsCost}</span>
            <DollarSign className="w-4 h-4 text-[#a6e3a1]" />
          </div>
          <div className="text-2xl font-bold text-[#a6e3a1] font-mono">
            -{metrics.awsCostReductionPercent}%
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#a6adc8]">
              <span>EC2 Monolith</span>
              <span className="text-[#a6e3a1] font-semibold">Serverless Pay-per-Use</span>
            </div>
            <div className="w-full bg-[#11111b] rounded-full h-1.5 overflow-hidden border border-[#313244]">
              <div
                className="bg-[#a6e3a1] h-full rounded-full"
                style={{ width: `${metrics.awsCostReductionPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
