//* * * COMPONENTE DE NAVEGACIÓN Y CONTROLES DEL ENTORNO IDE * * *
import React from 'react';
import { Cpu, Play, CheckCircle, Upload, Settings, RefreshCw, Code2, Network, ArrowRightLeft, BarChart3, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function Navbar({
  projects,
  selectedProject,
  onSelectProject,
  onOpenAwsConfig,
  isTranspiling,
  onStartTranspilation,
  awsConfigured,
  transpiledSuccess,
  onOpenUploadModal,
  activeTab,
  setActiveTab,
  onResetProject,
  lang,
  onToggleLang
}) {
  //* * * CARGA DE TRADUCCIONES SEGUN EL IDIOMA SELECCIONADO * * *
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  //* * * PESTAÑAS PRINCIPALES DEL WORKBENCH * * *
  const tabs = [
    { id: 'editor', label: t.tabEditor, icon: Code2 },
    { id: 'graph', label: t.tabGraph, icon: Network },
    { id: 'sandbox', label: t.tabSandbox, icon: ArrowRightLeft },
    { id: 'metrics', label: t.tabMetrics, icon: BarChart3 }
  ];

  return (
    <header className="bg-[#1e1e2e] border-b border-[#313244] sticky top-0 z-40 select-none">
      
      //* * * BARRA DE CONTROL SUPERIOR * * *
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        //* * * TITULO DE MARCA Y LOGO * * *
        <div className="flex items-center gap-3">
          <button
            onClick={onResetProject}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#cba6f7] text-[#11111b] flex items-center justify-center font-bold shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm text-[#cdd6f4] tracking-tight block">Kiro PolyGlot</span>
              <span className="text-[10px] text-[#a6adc8] font-mono block -mt-1">{t.brandSubtitle}</span>
            </div>
          </button>

          //* * * SELECTOR DESPLEGABLE DE PROYECTOS * * *
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-[#313244]">
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const found = projects.find(p => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-1.5 text-xs text-[#cdd6f4] font-medium focus:outline-none focus:border-[#cba6f7] transition-colors"
            >
              <option value="" disabled>{t.selectProject}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name.replace(/^[^\s]+\s/, '')}
                </option>
              ))}
            </select>

            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181825] border border-[#313244] text-xs text-[#a6adc8] hover:text-[#cdd6f4] hover:border-[#45475a] transition-all font-medium"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadFolder}</span>
            </button>
          </div>
        </div>

        //* * * CONTROLES DE ACCION Y SELECTOR DE IDIOMA * * *
        <div className="flex items-center gap-2.5">
          
          //* * * BOTON SELECTOR DE IDIOMA ES / EN * * *
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181825] border border-[#313244] text-xs font-bold text-[#cba6f7] hover:border-[#cba6f7] transition-all"
            title="Switch Language / Cambiar Idioma"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>

          //* * * BOTON DE CONFIGURACION AWS * * *
          <button
            onClick={onOpenAwsConfig}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              awsConfigured
                ? 'bg-[#181825] border-[#a6e3a1]/40 text-[#a6e3a1]'
                : 'bg-[#181825] border-[#313244] text-[#a6adc8] hover:text-[#cdd6f4]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{awsConfigured ? t.awsConfigured : t.configureAws}</span>
          </button>

          //* * * BOTON PRINCIPAL DE ACCION TRANSPILAR A AWS * * *
          {selectedProject && (
            <button
              onClick={onStartTranspilation}
              disabled={isTranspiling}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                transpiledSuccess
                  ? 'bg-[#a6e3a1] text-[#11111b]'
                  : 'bg-[#cba6f7] hover:bg-[#b4befe] text-[#11111b]'
              }`}
            >
              {isTranspiling ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : transpiledSuccess ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-[#11111b]" />
              )}
              <span>{isTranspiling ? t.transpiling : transpiledSuccess ? t.reTranspileBtn : t.transpileBtn}</span>
            </button>
          )}
        </div>

      </div>

      //* * * BARRA INFERIOR DE PESTAÑAS DEL WORKBENCH * * *
      {selectedProject && (
        <div className="border-t border-[#313244] bg-[#181825]">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                    isActive
                      ? 'border-[#cba6f7] text-[#cba6f7] bg-[#1e1e2e]'
                      : 'border-transparent text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#1e1e2e]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
}
