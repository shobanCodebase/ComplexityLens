import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { CodeEditorPanel } from './CodeEditorPanel';
import { AnalysisPanel } from './AnalysisPanel';

export const AnalyzerLayout = ({
  code,
  setCode,
  selectedLanguage,
  setSelectedLanguage,
  inputSize,
  setInputSize,
  onAnalyze,
  analysisResult,
  isAnalyzing,
  error
}) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState(58);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const newPercent = (relativeX / containerRect.width) * 100;
      
      // Enforce bounds between 25% and 75%
      const clampedPercent = Math.max(25, Math.min(75, newPercent));
      setLeftWidthPercent(clampedPercent);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleResetSplit = () => {
    setLeftWidthPercent(58);
  };

  return (
    <main
      ref={containerRef}
      className={`flex-1 p-3 flex flex-col lg:flex-row overflow-hidden bg-[#0d0f17] select-none ${
        isDragging ? 'cursor-col-resize select-none' : ''
      }`}
    >
      {/* Left Column: Code Editor Panel */}
      <div
        className="h-full min-h-[350px] lg:min-h-0 transition-all duration-75"
        style={{
          width: window.innerWidth >= 1024 ? `${leftWidthPercent}%` : '100%'
        }}
      >
        <CodeEditorPanel
          code={code}
          setCode={setCode}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          inputSize={inputSize}
          setInputSize={setInputSize}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Resizable Divider Handle Bar (Desktop) */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={handleResetSplit}
        title="Drag to resize panes (Double click to reset)"
        className="hidden lg:flex w-3 items-center justify-center cursor-col-resize group shrink-0 relative z-10"
      >
        {/* Splitter Line */}
        <div
          className={`w-[2px] h-full transition-colors ${
            isDragging
              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
              : 'bg-slate-800/80 group-hover:bg-cyan-500/60'
          }`}
        />
        {/* Grip Icon */}
        <div
          className={`absolute p-1 rounded bg-[#121522] border transition ${
            isDragging
              ? 'border-cyan-400 text-cyan-400 shadow-md'
              : 'border-slate-800 text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/50'
          }`}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Right Column: Analysis & Results Panel */}
      <div
        className="h-full min-h-[350px] lg:min-h-0 flex-1 transition-all duration-75"
        style={{
          width: window.innerWidth >= 1024 ? `${100 - leftWidthPercent}%` : '100%'
        }}
      >
        <AnalysisPanel
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
          error={error}
          onApplyCode={setCode}
          currentCode={code}
        />
      </div>
    </main>
  );
};