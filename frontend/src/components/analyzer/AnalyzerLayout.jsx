import React from 'react';
import { CodeEditorPanel } from './CodeEditorPanel';
import { AnalysisPanel } from './AnalysisPanel';

export const AnalyzerLayout = () => {
  return (
    <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden bg-[#0d0f17]">
      {/* Left Column: Code Editor Panel (7 cols on desktop) */}
      <div className="lg:col-span-7 h-full min-h-[420px]">
        <CodeEditorPanel />
      </div>

      {/* Right Column: Analysis & Results Panel (5 cols on desktop) */}
      <div className="lg:col-span-5 h-full min-h-[420px]">
        <AnalysisPanel />
      </div>
    </main>
  );
};
