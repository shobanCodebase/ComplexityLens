import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Layers, Eye, Info } from 'lucide-react';

/**
 * Computes theoretical operations for various Big-O growth classes
 */
function generateChartData(currentComplexity = 'O(n)', maxN = 1000) {
  const samplePoints = [10, 50, 100, 250, 500, 750, 1000];

  return samplePoints.map((n) => {
    // Standard baseline curves
    const o1 = 1;
    const oLogN = Math.round(Math.log2(n));
    const oN = n;
    const oNLogN = Math.round(n * Math.log2(n));
    const oN2 = Math.min(n * n, 1000000); // Cap for clean charting

    // Current analyzed algorithm curve value
    let currentVal = oN;
    const norm = (currentComplexity || '').toLowerCase().replace(/\s+/g, '');
    
    if (norm.includes('1')) {
      currentVal = o1;
    } else if (norm.includes('log')) {
      currentVal = oLogN;
    } else if (norm.includes('n^2') || norm.includes('n2')) {
      currentVal = oN2;
    } else if (norm.includes('nlogn')) {
      currentVal = oNLogN;
    } else if (norm.includes('2^n') || norm.includes('2n')) {
      currentVal = Math.min(Math.pow(2, Math.min(n, 20)), 1000000);
    } else {
      currentVal = oN;
    }

    return {
      n: `N=${n}`,
      rawN: n,
      'O(1)': o1,
      'O(log N)': oLogN,
      'O(N)': oN,
      'O(N log N)': oNLogN,
      'O(N²)': oN2,
      'Analyzed Code': currentVal
    };
  });
}

// Custom Tooltip for Dark IDE aesthetics
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f121d] border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs font-mono">
        <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-2">
          Input Size: <span className="text-cyan-400">{label}</span>
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-4">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="text-slate-300 font-bold">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value} ops
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ComplexityChart = ({ complexity = 'O(n)' }) => {
  const [scaleType, setScaleType] = useState('linear');
  const [visibleSeries, setVisibleSeries] = useState({
    'Analyzed Code': true,
    'O(1)': false,
    'O(log N)': true,
    'O(N)': true,
    'O(N log N)': true,
    'O(N²)': true
  });

  const chartData = generateChartData(complexity);

  const toggleSeries = (key) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0e101a] rounded-lg border border-slate-800 p-4 space-y-3">
      {/* Chart Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            Big-O Growth Curve Comparison
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
            {complexity}
          </span>
        </div>

        {/* Controls: Scale Toggle */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-md p-0.5 font-sans">
            <button
              onClick={() => setScaleType('linear')}
              className={`px-2 py-0.5 text-[11px] rounded transition cursor-pointer ${
                scaleType === 'linear'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linear Scale
            </button>
            <button
              onClick={() => setScaleType('log')}
              className={`px-2 py-0.5 text-[11px] rounded transition cursor-pointer ${
                scaleType === 'log'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log Scale
            </button>
          </div>
        </div>
      </div>

      {/* Series Toggle Filters */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
        <span className="text-slate-500 text-[10px] uppercase font-sans mr-1">Toggle Bounds:</span>
        {Object.keys(visibleSeries).map((key) => {
          const isAnalyzed = key === 'Analyzed Code';
          return (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              className={`px-2 py-0.5 rounded border transition flex items-center space-x-1 cursor-pointer ${
                visibleSeries[key]
                  ? isAnalyzed
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-800 border-slate-600 text-slate-200'
                  : 'bg-slate-900/50 border-slate-800 text-slate-600 line-through'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{key}</span>
            </button>
          );
        })}
      </div>

      {/* Recharts Container */}
      <div className="flex-1 w-full min-h-[260px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2336" />
            <XAxis dataKey="n" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis
              scale={scaleType === 'log' ? 'log' : 'auto'}
              domain={scaleType === 'log' ? [1, 'auto'] : [0, 'auto']}
              allowDataOverflow
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              iconType="circle"
            />

            {/* Analyzed Code Highlight Line */}
            {visibleSeries['Analyzed Code'] && (
              <Line
                type="monotone"
                dataKey="Analyzed Code"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 4, fill: '#22d3ee' }}
                activeDot={{ r: 7, stroke: '#06b6d4', strokeWidth: 2 }}
              />
            )}

            {/* Standard Comparison Lines */}
            {visibleSeries['O(1)'] && (
              <Line type="monotone" dataKey="O(1)" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
            )}
            {visibleSeries['O(log N)'] && (
              <Line type="monotone" dataKey="O(log N)" stroke="#38bdf8" strokeDasharray="4 4" dot={false} />
            )}
            {visibleSeries['O(N)'] && (
              <Line type="monotone" dataKey="O(N)" stroke="#818cf8" strokeDasharray="4 4" dot={false} />
            )}
            {visibleSeries['O(N log N)'] && (
              <Line type="monotone" dataKey="O(N log N)" stroke="#c084fc" strokeDasharray="4 4" dot={false} />
            )}
            {visibleSeries['O(N²)'] && (
              <Line type="monotone" dataKey="O(N²)" stroke="#f43f5e" strokeDasharray="4 4" dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Legend Note */}
      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-800/60 font-sans">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          The cyan line highlights your current algorithm's theoretical growth compared to benchmark Big-O bounds.
        </span>
      </div>
    </div>
  );
};
