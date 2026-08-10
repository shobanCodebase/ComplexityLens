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
  CheckCircle2
} from 'lucide-react';

export const AnalysisPanel = () => {
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
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-t-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-[#121522] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Step Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('visualizations')}
            className={`px-3 py-1.5 rounded-t-md font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'visualizations'
                ? 'bg-[#121522] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visualizations</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono text-slate-300">
            Results Panel
          </span>
        </div>
      </div>

      {/* Main Results Panel Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Top Key Metrics Cards (Placeholders) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Time Complexity Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-cyan-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Time Complexity</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              O(log N)
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Logarithmic growth</span>
            </div>
          </div>

          {/* Space Complexity Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-purple-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Space Complexity</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-purple-400">
              O(1)
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Constant auxiliary memory
            </div>
          </div>

          {/* Operation Count Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-indigo-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Est. Ops (N=1000)</span>
              <RotateCw className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold font-mono text-indigo-400">
              ~10 ops
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Worst-case comparisons
            </div>
          </div>

          {/* Loops & Recursion Card */}
          <div className="p-3.5 rounded-lg bg-[#0e101a] border border-slate-800/90 hover:border-emerald-500/30 transition shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Loops & Structure</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-emerald-400 flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>1 While Loop</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              No recursion detected
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Step-by-Step Explanation Placeholder */}
            <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Complexity Analysis Summary</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The algorithm repeatedly divides the search interval in half. Because the search space is halved at each iteration step (from <code className="text-cyan-300 font-mono">N</code> to <code className="text-cyan-300 font-mono">N/2</code> to <code className="text-cyan-300 font-mono">N/4</code>...), the total number of operations grows logarithmically with respect to input size.
              </p>
            </div>

            {/* Optimization Suggestions Placeholder */}
            <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 mb-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Optimization Insights</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start space-x-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  <span><strong>Optimal Complexity:</strong> This algorithm is already optimal at O(log N) for searching in sorted arrays.</span>
                </li>
                <li className="flex items-start space-x-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                  <span><strong>Overflow Prevention:</strong> Consider using <code className="text-slate-300 font-mono">left + Math.floor((right - left) / 2)</code> to prevent potential integer overflow in languages with fixed integer limits.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800 text-xs space-y-3">
            <div className="font-semibold text-slate-200">Step-by-Step Code Walkthrough</div>
            <div className="font-mono space-y-2">
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                <span className="text-cyan-400">Line 2-3:</span> Variable initialization <code className="text-emerald-400">O(1)</code>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                <span className="text-cyan-400">Line 5-16:</span> Main search loop halving range <code className="text-emerald-400">O(log N)</code>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                <span className="text-cyan-400">Line 17:</span> Return default fallback <code className="text-emerald-400">O(1)</code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizations' && (
          <div className="p-6 rounded-lg bg-[#0e101a] border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
            <BarChart3 className="w-10 h-10 text-slate-600 animate-pulse" />
            <div className="text-sm font-semibold text-slate-300">Complexity Curve Visualizations</div>
            <p className="text-xs text-slate-500 max-w-sm">
              Recharts chart component integration placeholder for Big-O growth curves vs. standard bounds.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-7 bg-[#0b0d14] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-500 shrink-0 font-mono">
        <span>Analysis status: Mock Data Preview</span>
        <span>AST engine connection pending</span>
      </div>
    </div>
  );
};
