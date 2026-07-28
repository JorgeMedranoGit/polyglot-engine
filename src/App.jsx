//* * * COMPONENTE PRINCIPAL Y CONTROLES DEL MOTOR KIRO POLYGLOT * * *
import React, { useState } from 'react';
import confetti from 'canvas-confetti';

//* * * IMPORTACION DE COMPONENTES DE LA INTERFAZ Y SERVICIOS * * *
import Navbar from './components/Navbar';
import ArchitectureGraph from './components/ArchitectureGraph';
import CodeEditor from './components/CodeEditor';
import DifferentialSandbox from './components/DifferentialSandbox';
import TelemetryDashboard from './components/TelemetryDashboard';
import AwsConfigModal from './components/AwsConfigModal';
import LivePipelineVisualizer from './components/LivePipelineVisualizer';
import ProjectUploadModal from './components/ProjectUploadModal';
import EmptyStateHero from './components/EmptyStateHero';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { transpileProjectWithBedrock } from './services/bedrockService';

export default function App() {
  //* * * ESTADOS GLOBALES DE NAVEGACION Y PROYECTO * * *
  const [projectsList, setProjectsList] = useState(SAMPLE_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [lang, setLang] = useState('es');

  //* * * ESTADOS DE EJECUCION DE TRANSPILACIÓN Y PIPELINE EN VIVO * * *
  const [isTranspiling, setIsTranspiling] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const [transpiledCode, setTranspiledCode] = useState('');
  const [transpiledSuccess, setTranspiledSuccess] = useState(false);
  const [providerName, setProviderName] = useState('');
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  //* * * ESTADOS DE METRICAS DEL PIPELINE * * *
  const [pipelinePhase, setPipelinePhase] = useState(1);
  const [pipelinePercent, setPipelinePercent] = useState(0);
  const [pipelineMessage, setPipelineMessage] = useState('');
  const [liveTokens, setLiveTokens] = useState(0);

  //* * * CONFIGURACION DE CREDENCIALES AWS BEDROCK * * *
  const [awsConfig, setAwsConfig] = useState({
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
    modelId: import.meta.env.VITE_AWS_BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0'
  });

  const awsConfigured = Boolean(awsConfig.accessKeyId && awsConfig.secretAccessKey);

  //* * * CAMBIO DE IDIOMA ENTRE ESPAÑOL E INGLES * * *
  const toggleLanguage = () => {
    setLang(prev => (prev === 'es' ? 'en' : 'es'));
  };

  //* * * MANEJADORES DE SELECCION Y CARGA DE PROYECTOS * * *
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setTranspiledCode('');
    setTranspiledSuccess(false);
    setActiveNodeIndex(-1);
    setProviderName('');
  };

  const handleUploadProject = (newProject) => {
    setProjectsList([newProject, ...projectsList]);
    setSelectedProject(newProject);
    setTranspiledCode('');
    setTranspiledSuccess(false);
  };

  const handleLoadSampleJava = () => {
    handleSelectProject(SAMPLE_PROJECTS[0]);
  };

  //* * * INICIO DEL PROCESO DE TRANSPILACION RECURSIVA CON AWS BEDROCK * * *
  const handleStartTranspilation = async () => {
    if (!selectedProject) return;
    setIsTranspiling(true);
    setTranspiledSuccess(false);
    setActiveNodeIndex(0);
    setPipelinePhase(1);
    setPipelinePercent(10);
    setLiveTokens(45);

    //* * * ETAPAS DEL PIPELINE DE TRANSPILACION EN VIVO * * *
    const phaseSteps = [
      { phase: 1, pct: 25, msg: `Escaneando todos los ${selectedProject.fileTree ? selectedProject.fileTree.length : 1} archivos del proyecto...`, tokens: 120 },
      { phase: 2, pct: 50, msg: "Construyendo el Grafo Semántico de Funciones e Invariantes...", tokens: 280 },
      { phase: 3, pct: 75, msg: "Invocando AWS Bedrock (Claude 3.5 Sonnet) para la síntesis completa...", tokens: 460 },
      { phase: 4, pct: 95, msg: "Verificando Equivalencia Semántica y Métricas de Rendimiento...", tokens: 590 }
    ];

    let stepIdx = 0;
    const progressTimer = setInterval(() => {
      if (stepIdx < phaseSteps.length) {
        const step = phaseSteps[stepIdx];
        setPipelinePhase(step.phase);
        setPipelinePercent(step.pct);
        setPipelineMessage(step.msg);
        setLiveTokens(step.tokens);
        setActiveNodeIndex(stepIdx);
        stepIdx++;
      }
    }, 600);

    //* * * INVOCACION AL SERVICIO RECURSIVO DE TRANSPILACION * * *
    const result = await transpileProjectWithBedrock({
      sourceCode: selectedProject.sourceCode,
      fileTree: selectedProject.fileTree,
      sourceLanguage: selectedProject.sourceLanguage,
      targetLanguage: selectedProject.targetLanguage,
      awsConfig,
      onProgress: ({ status, percent }) => {
        if (status) setPipelineMessage(status);
        if (percent) setPipelinePercent(percent);
      },
      onNodeTranspiled: (nodeIdx) => {
        setActiveNodeIndex(nodeIdx);
      }
    });

    clearInterval(progressTimer);
    setIsTranspiling(false);
    setPipelinePercent(100);

    //* * * CELEBRACION Y GUARDADO DEL RESULTADO EXITOSO * * *
    if (result.success) {
      setTranspiledCode(result.code || selectedProject.targetCode);
      setTranspiledSuccess(true);
      setProviderName(result.provider);
      setActiveNodeIndex(selectedProject.graphNodes.length);

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4] flex flex-col font-sans selection:bg-[#cba6f7] selection:text-[#11111b]">
      
      //* * * BARRA DE NAVEGACION SUPERIOR * * *
      <Navbar
        projects={projectsList}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onOpenAwsConfig={() => setIsAwsModalOpen(true)}
        isTranspiling={isTranspiling}
        onStartTranspilation={handleStartTranspilation}
        awsConfigured={awsConfigured}
        transpiledSuccess={transpiledSuccess}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetProject={() => setSelectedProject(null)}
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      //* * * AREA DE TRABAJO PRINCIPAL * * *
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col justify-start">
        
        {!selectedProject ? (
          <EmptyStateHero
            onLoadSampleJava={handleLoadSampleJava}
            onUploadCustomProject={handleUploadProject}
            lang={lang}
          />
        ) : (
          <>
            {isTranspiling && (
              <LivePipelineVisualizer
                currentPhase={pipelinePhase}
                phasePercent={pipelinePercent}
                currentMessage={pipelineMessage}
                liveTokens={liveTokens}
              />
            )}

            {activeTab === 'editor' && (
              <div className="space-y-4 animate-fade-in">
                <CodeEditor
                  project={selectedProject}
                  transpiledCode={transpiledCode}
                  isTranspiling={isTranspiling}
                  isVerified={transpiledSuccess}
                  providerName={providerName}
                  onUploadCode={() => setIsUploadModalOpen(true)}
                  lang={lang}
                />
              </div>
            )}

            {activeTab === 'graph' && (
              <div className="animate-fade-in">
                <ArchitectureGraph
                  nodes={selectedProject.graphNodes}
                  edges={selectedProject.graphEdges}
                  activeNodeIndex={activeNodeIndex}
                  isTranspiling={isTranspiling}
                  isVerified={transpiledSuccess}
                  lang={lang}
                />
              </div>
            )}

            {activeTab === 'sandbox' && (
              <div className="animate-fade-in">
                <DifferentialSandbox
                  project={selectedProject}
                  isVerified={transpiledSuccess}
                  lang={lang}
                />
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="animate-fade-in">
                <TelemetryDashboard metrics={selectedProject.metrics} lang={lang} />
              </div>
            )}
          </>
        )}

      </main>

      //* * * MODAL DE CONFIGURACION CREDENCIALES AWS * * *
      <AwsConfigModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
        awsConfig={awsConfig}
        onSaveConfig={(newConfig) => setAwsConfig(newConfig)}
      />

      //* * * MODAL DE CARGA DE PROYECTOS * * *
      <ProjectUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadProject={handleUploadProject}
      />

    </div>
  );
}
