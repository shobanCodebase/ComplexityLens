import React, { useState } from 'react';
import { 
  BarChart3, Zap, Cpu, RotateCw, Sparkles, Layers, AlertCircle,
  TrendingUp, Info, Loader2
} from 'lucide-react';

const COMPLEXITY_DESCRIPTIONS = {
  "O(1)": "Constant time — the number of operations does not grow with input size.",
  "O(n)": "Linear growth — operations scale directly in proportion to input size.",
  "O(n^2)": "Quadratic growth — operations scale with the square of input size, typically from nested loops.",
  "O(n^3)": "Cubic growth — operations scale with the cube of input size, typically from triple-nested loops.",
  "O(2^n)": "Exponential growth — operations roughly double with each additional unit of input, often from unoptimized recursion.",
};

export const AnalysisPanel = ({ result, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const complexity = result?.complexity ?? null;
  const description = complexity
    ? (COMPLEXITY_DESCRIPTIONS[complexity] ?? "No description available for this complexity class.")
    : null;

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
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono text-slate-300">
            Results Panel
          </span>
        </div>
      </div>

      {/* Main content area — three distinct states: loading, error, and result */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="text-sm">Running analysis in sandbox...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-3 text-center px-4">
            <AlertCircle className="w-8 h-8" />
            <span className="text-sm font-medium">Analysis failed</span>
            <span className="text-xs text-slate-500">{error}</span>
          </div>
        )}

        {!isLoading && !error && !result && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
            <Sparkles className="w-8 h-8" />
            <span className="text-sm">Click "Analyze" to run your code</span>
          </div>
        )}

        {!isLoading && !error && result && (
          <div className="space-y-4">
            {/* Metrics cards — real data */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Time Complexity</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {result.complexity}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Space Complexity</span>
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-500">
                  N/A
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Not yet implemented</div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Operation Count</span>
                  <RotateCw className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl font-bold font-mono text-indigo-400">
                  {result.operation_count.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Execution Time</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {result.execution_time_ms.toFixed(2)} ms
                </div>
              </div>
            </div>

            {/* Real, honest explanation */}
            <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 mb-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Complexity Analysis</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {description}
              </p>
              <p className="text-[11px] text-slate-600 mt-2">
                Estimate based on static code structure analysis (loop nesting and recursion detection).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 mb-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Memory Usage</span>
              </div>
              <p className="text-xs text-slate-400">{result.memory_usage_mb.toFixed(2)} MB (measured in sandbox)</p>
            </div>
          </div>
        )}
      </div>

      <div className="h-7 bg-[#0b0d14] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-500 shrink-0 font-mono">
        <span>Analysis status: {result ? 'Live Backend Data' : 'Awaiting Analysis'}</span>
        <span>{result ? 'AST engine connected' : ''}</span>
      </div>
    </div>
  );
};