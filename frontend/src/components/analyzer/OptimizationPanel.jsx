import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Zap, 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  Copy
} from 'lucide-react';

const SUGGESTIONS_DATABASE = {
  quadratic: {
    title: 'High Complexity Detected: O(N²)',
    impact: 'High Impact',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    summary: 'Nested loops cause quadratic time growth. Replacing Bubble Sort or nested iterations with Divide & Conquer (QuickSort/MergeSort) or Hash Table lookups reduces execution time drastically.',
    currentComplexityLabel: 'O(N²)',
    suggestedComplexityLabel: 'O(N log N)',
    refactoredCode: `# Optimized O(n log n) Timsort / Merge Sort
def optimized_sort(arr):
    # Built-in Timsort algorithm operating in O(n log n) time
    return sorted(arr)

# Usage
# arr = [64, 34, 25, 12, 22, 11, 90]
# sorted_arr = optimized_sort(arr)`
  },

  exponential: {
    title: 'Exponential Complexity Detected: O(2ⁿ)',
    impact: 'Critical Impact',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    summary: 'Naive recursive calls lead to repetitive subproblem computations. Implementing Memoization (Top-down DP) or Tabulation reduces complexity from O(2ⁿ) to O(N).',
    currentComplexityLabel: 'O(2ⁿ)',
    suggestedComplexityLabel: 'O(N)',
    refactoredCode: `# Optimized O(n) Fibonacci using Memoization / Dynamic Programming
def fibonacci_dp(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_dp(n - 1, memo) + fibonacci_dp(n - 2, memo)
    return memo[n]`
  },

  linear: {
    title: 'Linear Time Complexity: O(N)',
    impact: 'Medium Impact',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    summary: 'Linear search loops across arrays can often be optimized to O(1) constant time lookups by using a Hash Set or Hash Map dictionary for data lookups.',
    currentComplexityLabel: 'O(N)',
    suggestedComplexityLabel: 'O(1) lookup',
    refactoredCode: `# Optimized O(1) Lookup using Hash Set
def find_element_fast(arr, target):
    # Pre-hash set lookup in O(1) average time
    lookup_set = set(arr)
    return target in lookup_set`
  },

  optimal: {
    title: 'Optimal Complexity: O(1) / O(log N)',
    impact: 'Optimal',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    summary: 'Great job! Your algorithm already runs in optimal logarithmic or constant time complexity.',
    currentComplexityLabel: 'O(log N)',
    suggestedComplexityLabel: 'O(log N)',
    refactoredCode: `# Code is already optimal!
# No major refactoring required.`
  }
};

export const OptimizationPanel = ({ complexity = 'O(n)', onApplyCode, currentCode }) => {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const norm = (complexity || '').toLowerCase().replace(/\s+/g, '');
  let suggestionKey = 'linear';

  if (norm.includes('n^2') || norm.includes('n2')) {
    suggestionKey = 'quadratic';
  } else if (norm.includes('2^n') || norm.includes('2n')) {
    suggestionKey = 'exponential';
  } else if (norm.includes('1') || norm.includes('log')) {
    suggestionKey = 'optimal';
  } else {
    suggestionKey = 'linear';
  }

  const suggestion = SUGGESTIONS_DATABASE[suggestionKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyCode) {
      onApplyCode(suggestion.refactoredCode);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e101a] rounded-lg border border-slate-800 p-4 space-y-4 font-sans">
      {/* Header Info Card */}
      <div className="p-4 rounded-lg bg-[#121522] border border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm text-slate-200">{suggestion.title}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-mono border font-medium ${suggestion.badgeColor}`}>
            {suggestion.impact}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {suggestion.summary}
        </p>

        {/* Complexity Gain Metric */}
        <div className="flex items-center space-x-3 pt-2 font-mono text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">Current:</span>
            <span className="text-rose-400 font-bold">{suggestion.currentComplexityLabel}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">Target:</span>
            <span className="text-emerald-400 font-bold">{suggestion.suggestedComplexityLabel}</span>
          </div>
        </div>
      </div>

      {/* Suggested Code Refactoring Viewer */}
      <div className="flex-1 flex flex-col rounded-lg border border-slate-800 overflow-hidden bg-[#0b0d14]">
        <div className="h-9 bg-[#0f121d] border-b border-slate-800 px-3 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Suggested Refactored Code</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition cursor-pointer"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="flex-1 p-3 overflow-y-auto">
          <pre className="font-mono text-xs text-cyan-300 bg-slate-900/80 p-3 rounded border border-slate-800/80 leading-relaxed overflow-x-auto">
            {suggestion.refactoredCode}
          </pre>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-[#0f121d] border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>1-Click Editor Refactor</span>
          </div>
          <button
            onClick={handleApply}
            disabled={suggestionKey === 'optimal'}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded transition shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            {applied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Applied to Editor!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Apply Code to Editor</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
