import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCode, Code2, Copy, Check, Sparkles, ChevronDown, Play, Loader2, AlertTriangle
} from 'lucide-react';

const SAMPLE_ALGORITHMS = {
  binarySearch: `// Binary Search Algorithm
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
  bubbleSort: `// Bubble Sort Algorithm
function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}`,
  fibonacciRecursive: `// Recursive Fibonacci Algorithm
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
};

export const CodeEditorPanel = ({ code, setCode, language, setLanguage, onAnalyze, isLoading }) => {
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

  const isUnsupportedLanguage = language !== 'python';

  return (
    <div className="flex flex-col h-full bg-[#121522] rounded-xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="h-10 bg-[#0f121d] border-b border-slate-800/80 px-3 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#121522] text-cyan-300 border-t-2 border-cyan-400 rounded-t text-xs font-medium">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>algorithm.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'cpp'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              onChange={handleSampleSelect}
              className="bg-slate-900 border border-slate-700/80 text-slate-300 text-xs rounded-md px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:border-cyan-500 appearance-none font-sans"
              defaultValue="binarySearch"
            >
              <option value="binarySearch">Sample: Binary Search O(log N)</option>
              <option value="bubbleSort">Sample: Bubble Sort O(N²)</option>
              <option value="fibonacciRecursive">Sample: Fibonacci O(2ⁿ)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 text-slate-300 text-xs rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onAnalyze}
            disabled={isLoading || isUnsupportedLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-md text-xs font-medium transition cursor-pointer"
            title={isUnsupportedLanguage ? "Only Python is currently supported" : "Analyze code"}
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      {isUnsupportedLanguage && (
        <div className="px-3 py-1.5 bg-amber-950/40 border-b border-amber-900/50 flex items-center space-x-2 text-[11px] text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Only Python is currently supported by the analysis engine. Switch language to Python to analyze.</span>
        </div>
      )}

      <div className="flex-1 relative bg-[#0e101a] overflow-hidden">
        <Editor
          height="100%"
          language={language}
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

      <div className="h-7 bg-[#0b0d14] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono">
        <div className="flex items-center space-x-3">
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <span>Editor Ready (Monaco Engine)</span>
        </div>
      </div>
    </div>
  );
};