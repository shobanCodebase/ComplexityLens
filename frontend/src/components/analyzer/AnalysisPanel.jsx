import React, { useState } from 'react';
import { 
  BarChart3, 
  Zap, 
  Cpu, 
  RotateCw, 
  Sparkles, 
  Layers, 
  AlertCircle,
  TrendingUp,
  Info,
  CheckCircle2,
  Clock,
  HardDrive,
  Loader2,
  Wand2
} from 'lucide-react';
import { ComplexityChart } from './ComplexityChart';
import { OptimizationPanel } from './OptimizationPanel';

export const AnalysisPanel = ({ analysisResult, isAnalyzing, error, onApplyCode, currentCode }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col h-full bg-[#121522] rounded-xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Header Tabs */}
      <div className="h-10 bg-[#0f121d] border-b border-slate-800/80 px-3 flex items-center justify-between shrink-0 font-sans text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-t-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#121522] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('optimizations')}
            className={`px-3 py-1.5 rounded-t-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'optimizations'
                ? 'bg-[#121522] text-emerald-400 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimizations</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-t-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'chart'
                ? 'bg-[#121522] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visualizations</span>
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-t-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-[#121522] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          {isAnalyzing ? (
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Fetching AST...</span>
            </span>
          ) : analysisResult ? (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>Live API Connected</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              Awaiting Analysis
            </span>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-950/50 border-b border-red-800/50 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Results Panel Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Top Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Time Complexity Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-cyan-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Big-O Complexity</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {analysisResult ? analysisResult.complexity : 'O(—)'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>AST Inferred</span>
            </div>
          </div>

          {/* Operation Count Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-indigo-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Operations</span>
              <RotateCw className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold font-mono text-indigo-400">
              {analysisResult ? analysisResult.operation_count.toLocaleString() : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Scaled by N
            </div>
          </div>

          {/* Execution Time Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-purple-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Exec Time</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-purple-400">
              {analysisResult ? `${analysisResult.execution_time_ms} ms` : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              API latency
            </div>
          </div>

          {/* Memory Usage Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-emerald-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Memory Usage</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {analysisResult ? `${analysisResult.memory_usage_mb} MB` : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Allocated RAM
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Backend Analysis Response</span>
              </div>
              {analysisResult ? (
                <pre className="p-3 bg-slate-900/90 rounded border border-slate-800 text-xs text-cyan-300 font-mono overflow-x-auto">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click <strong className="text-cyan-400 font-medium">"Analyze with Backend"</strong> to send your algorithm code to your teammate's FastAPI server (`POST /analyze`) and display real-time static AST results!
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'optimizations' && (
          <OptimizationPanel
            complexity={analysisResult?.complexity || 'O(n)'}
            onApplyCode={onApplyCode}
            currentCode={currentCode}
          />
        )}

        {activeTab === 'chart' && (
          <ComplexityChart complexity={analysisResult?.complexity || 'O(n)'} />
        )}

        {activeTab === 'breakdown' && (
          <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800 text-xs space-y-3">
            <div className="font-semibold text-slate-200">Backend API Schema Details</div>
            <div className="font-mono space-y-2">
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                <span className="text-cyan-400">Language:</span> {analysisResult?.language || 'python'}
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                <span className="text-cyan-400">Calculated Complexity:</span> {analysisResult?.complexity || 'N/A'}
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                <span className="text-cyan-400">Calculated Operations:</span> {analysisResult?.operation_count ?? 'N/A'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-7 bg-[#0b0d14] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-500 shrink-0 font-mono">
        <span>Target API: http://localhost:8000/analyze</span>
        <span>FastAPI Connected</span>
      </div>
    </div>
  );
};