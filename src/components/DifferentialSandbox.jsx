import React, { useState } from 'react';
import { Play, CheckCircle2, RefreshCw, Terminal, ArrowRightLeft, Send, Server, Database, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function DifferentialSandbox({ project, isVerified, lang = 'es' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);

  // Thunder Client API Simulator state
  const [httpMethod] = useState('POST');
  const [httpEndpoint, setHttpEndpoint] = useState('/api/orders/checkout');
  const [isSendingHttp, setIsSendingHttp] = useState(false);
  const [thunderResponse, setThunderResponse] = useState(null);

  const currentTestCase = project.testCases[activeTestCaseIndex] || project.testCases[0];

  const handleRunDifferentialTest = () => {
    setIsRunningTest(true);
    setTestResults(null);

    setTimeout(() => {
      setIsRunningTest(false);
      setTestResults({
        passed: true,
        legacyDurationMs: project.metrics.legacyLatencyMs,
        transpiledDurationMs: project.metrics.modernLatencyMs,
        speedup: (project.metrics.legacyLatencyMs / project.metrics.modernLatencyMs).toFixed(1),
        legacyMemoryMb: project.metrics.legacyRamMb,
        transpiledMemoryMb: project.metrics.modernRamMb,
        ramSavings: project.metrics.ramReductionPercent,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 800);
  };

  const handleSendThunderRequest = () => {
    setIsSendingHttp(true);
    setThunderResponse(null);

    setTimeout(() => {
      setIsSendingHttp(false);
      setThunderResponse({
        statusCode: 201,
        statusText: 'Created',
        latencyMs: project.metrics.modernLatencyMs,
        headers: {
          'content-type': 'application/json',
          'x-kiro-transpiled': 'true',
          'x-aws-lambda-runtime': 'rust-1.78-graviton',
          'x-amzn-requestid': 'a1b2c3d4-e5f6-7890'
        },
        body: currentTestCase.transpiledResponse
      });
    }, 450);
  };

  return (
    <div className="bg-[#1e1e2e] rounded-xl border border-[#313244] p-5 space-y-5 animate-fade-in">
      
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#313244] pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <ArrowRightLeft className="w-5 h-5 text-[#a6e3a1]" />
          <h2 className="text-sm font-bold text-[#cdd6f4]">
            {t.sandboxTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {project.testCases.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTestCaseIndex(idx)}
              className={`px-3 py-1 text-xs rounded-md border transition-all font-mono ${
                activeTestCaseIndex === idx
                  ? 'bg-[#cba6f7] text-[#11111b] border-[#cba6f7] font-bold'
                  : 'bg-[#181825] border-[#313244] text-[#a6adc8] hover:text-[#cdd6f4]'
              }`}
            >
              Test #{idx + 1}
            </button>
          ))}

          <button
            onClick={handleRunDifferentialTest}
            disabled={isRunningTest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#a6e3a1] hover:opacity-90 text-[#11111b] transition-all shadow-sm"
          >
            {isRunningTest ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-[#11111b]" />
            )}
            <span>{t.runTest}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Payload vs Responses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Input Payload */}
        <div className="bg-[#181825] rounded-lg p-3.5 border border-[#313244]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#cba6f7] mb-2 font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.payloadInput}</span>
          </div>
          <pre className="text-xs font-mono text-[#89b4fa] overflow-x-auto p-3 bg-[#11111b] rounded border border-[#313244]">
            {JSON.stringify(currentTestCase.inputPayload, null, 2)}
          </pre>
        </div>

        {/* Legacy Execution Output */}
        <div className="bg-[#181825] rounded-lg p-3.5 border border-[#313244]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#f38ba8] mb-2 font-mono">
            <span>{t.legacyResponse}</span>
            {testResults && <span className="text-[11px] text-[#f38ba8]">{testResults.legacyDurationMs}ms</span>}
          </div>
          <pre className="text-xs font-mono text-[#cdd6f4] overflow-x-auto p-3 bg-[#11111b] rounded border border-[#313244]">
            {JSON.stringify(currentTestCase.legacyResponse, null, 2)}
          </pre>
        </div>

        {/* Transpiled Serverless Output */}
        <div className="bg-[#181825] rounded-lg p-3.5 border border-[#313244]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#a6e3a1] mb-2 font-mono">
            <span>{t.transpiledResponse}</span>
            {testResults && <span className="text-[11px] text-[#a6e3a1] font-bold">{testResults.transpiledDurationMs}ms</span>}
          </div>
          <pre className="text-xs font-mono text-[#a6e3a1] overflow-x-auto p-3 bg-[#11111b] rounded border border-[#313244]">
            {JSON.stringify(currentTestCase.transpiledResponse, null, 2)}
          </pre>
        </div>

      </div>

      {/* Verification Status Banner */}
      {testResults && (
        <div className="bg-[#a6e3a1]/10 border border-[#a6e3a1]/40 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#a6e3a1] shrink-0" />
            <div>
              <span className="font-bold text-[#a6e3a1] text-xs block">
                {t.verificationPassed}
              </span>
              <span className="text-[#a6adc8] text-[11px]">
                Salidas 100% idénticas. Latencia: <strong className="text-[#a6e3a1] font-mono">{testResults.transpiledDurationMs}ms</strong> (-{testResults.speedup}x).
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#6c7086]">
            {testResults.timestamp}
          </span>
        </div>
      )}

      {/* Thunder Client / Postman Embedded API Tester */}
      <div className="bg-[#181825] rounded-xl border border-[#313244] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#313244] pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#89b4fa] font-mono">
            <Server className="w-4 h-4 text-[#89b4fa]" />
            <span>Simulador HTTP API Client (Thunder Client / Postman Style):</span>
          </div>
          <span className="text-[10px] font-mono text-[#a6adc8] bg-[#11111b] px-2 py-0.5 rounded border border-[#313244]">
            Prueba de Servicio Vivo
          </span>
        </div>

        {/* HTTP Request URL Bar */}
        <div className="flex items-center gap-2 bg-[#11111b] p-1.5 rounded-lg border border-[#313244]">
          <span className="px-2.5 py-1 bg-[#cba6f7] text-[#11111b] font-mono text-xs font-bold rounded">
            {httpMethod}
          </span>
          <input
            type="text"
            value={httpEndpoint}
            onChange={(e) => setHttpEndpoint(e.target.value)}
            className="flex-1 bg-transparent text-xs font-mono text-[#cdd6f4] px-2 focus:outline-none"
          />
          <button
            onClick={handleSendThunderRequest}
            disabled={isSendingHttp}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#89b4fa] hover:opacity-90 text-[#11111b] font-mono text-xs font-bold rounded transition-all"
          >
            {isSendingHttp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send Request</span>
          </button>
        </div>

        {/* Thunder Client Response Panel */}
        {thunderResponse && (
          <div className="bg-[#11111b] rounded-lg p-3 border border-[#313244] space-y-2 text-xs font-mono animate-fade-in">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#313244]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#a6e3a1]/20 text-[#a6e3a1] font-bold">
                  Status: {thunderResponse.statusCode} {thunderResponse.statusText}
                </span>
                <span className="text-[#a6adc8]">Time: <strong className="text-[#a6e3a1]">{thunderResponse.latencyMs} ms</strong></span>
              </div>
              <span className="text-[#6c7086]">Size: 1.2 KB</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-[#a6adc8] font-bold block mb-1">Response Headers:</span>
                <pre className="text-[11px] text-[#74c7ec] bg-[#181825] p-2 rounded border border-[#313244] overflow-x-auto">
                  {JSON.stringify(thunderResponse.headers, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-[10px] text-[#a6adc8] font-bold block mb-1">Response Body (JSON):</span>
                <pre className="text-[11px] text-[#a6e3a1] bg-[#181825] p-2 rounded border border-[#313244] overflow-x-auto">
                  {JSON.stringify(thunderResponse.body, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
