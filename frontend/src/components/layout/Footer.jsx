import React from 'react';
import { Terminal, Cpu, CheckCircle2, Layers } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="h-7 border-t border-slate-800/80 bg-[#0b0d14] px-3 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none font-mono">
      {/* Left side items */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-cyan-400">
          <Terminal className="w-3 h-3" />
          <span>ComplexityLens IDE</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-400">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>AST Parser Idle</span>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Layers className="w-3 h-3 text-purple-400" />
          <span>React + Vite</span>
        </div>
        <div className="flex items-center space-x-1">
          <Cpu className="w-3 h-3 text-indigo-400" />
          <span>UTF-8</span>
        </div>
      </div>
    </footer>
  );
};
