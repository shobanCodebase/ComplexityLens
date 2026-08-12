import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCode, 
  Code2, 
  Copy, 
  Check, 
  Play,
  ChevronDown,
  Loader2
} from 'lucide-react';

const SAMPLE_ALGORITHMS = {
  pythonLinear: `# Linear Time Algorithm O(n)
def find_element(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,

  pythonQuadratic: `# Quadratic Time Algorithm O(n^2)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,

  pythonConstant: `# Constant Time Algorithm O(1)
def get_first_element(arr):
    x = 100
    y = 200
    return arr[0] if len(arr) > 0 else None`
};

export const CodeEditorPanel = ({
  code,
  setCode,
  selectedLanguage,
  setSelectedLanguage,
  inputSize,
  setInputSize,
  onAnalyze,
  isAnalyzing
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSampleSelect = (e) => {
    const key = e.target.value;
    if (SAMPLE_ALGORITHMS[key]) {
      setCode(SAMPLE_ALGORITHMS[key]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121522] rounded-xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Editor Header Bar */}
      <div className="h-10 bg-[#0f121d] border-b border-slate-800/80 px-3 flex items-center justify-between shrink-0 font-mono text-xs">
        {/* Left: Active File Tab */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#121522] text-cyan-300 border-t-2 border-cyan-400 rounded-t text-xs font-medium">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>algorithm.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : 'cpp'}</span>
          </div>
        </div>

        {/* Right Controls: Sample Picker, Language, Input Size & Copy */}
        <div className="flex items-center space-x-2">
          {/* Preset Algorithm Dropdown */}
          <div className="relative">
            <select
              onChange={handleSampleSelect}
              className="bg-slate-900 border border-slate-700/80 text-slate-300 text-xs rounded-md px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:border-cyan-500 appearance-none font-sans"
              defaultValue="pythonLinear"
            >
              <option value="pythonLinear">Sample: Linear O(N)</option>
              <option value="pythonQuadratic">Sample: Bubble Sort O(N²)</option>
              <option value="pythonConstant">Sample: Constant O(1)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Input Size Control */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded-md text-[11px] font-sans">
            <span className="text-slate-400">N =</span>
            <input
              type="number"
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value) || 100)}
              className="w-14 bg-transparent text-cyan-300 text-xs focus:outline-none font-mono"
              min="1"
              max="1000000"
            />
          </div>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 text-slate-300 text-xs rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 relative bg-[#0e101a] overflow-hidden">
        <Editor
          height="100%"
          language={selectedLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
          }}
          loading={
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
              <Code2 className="w-6 h-6 mb-2 animate-bounce text-cyan-400" />
              <span>Loading Monaco Code Editor...</span>
            </div>
          }
        />
      </div>

      {/* Editor Action Footer */}
      <div className="h-9 bg-[#0b0d14] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono">
        <div className="flex items-center space-x-3">
          <span>Lines: {code.split('\n').length}</span>
          <span>Chars: {code.length}</span>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded transition shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer font-sans"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-slate-950" />
              <span>Analyze with Backend</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};