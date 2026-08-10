import React from 'react';
import { 
  Code2, 
  Sparkles, 
  Play, 
  RotateCcw, 
  FileCode, 
  Settings,
  Activity
} from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0f121d]/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/10">
          <div className="w-full h-full bg-[#0d0f17] rounded-[7px] flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-tight text-white font-mono">
              Complexity<span className="text-cyan-400">Lens</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              v0.1.0-dev
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Real-Time Algorithm Complexity Analyzer
          </p>
        </div>
      </div>

      {/* Center Action Toolbar Placeholder */}
      <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg p-1">
        <button 
          className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded transition shadow-sm cursor-pointer"
          title="Run analysis (Frontend placeholder)"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Analyze Code</span>
        </button>
        <button 
          className="flex items-center space-x-1 px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs rounded transition cursor-pointer"
          title="Reset editor code"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>

      {/* Right Controls & Navigation */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="hidden lg:flex items-center space-x-1 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px]">Frontend Ready</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
        <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-md transition cursor-pointer">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
