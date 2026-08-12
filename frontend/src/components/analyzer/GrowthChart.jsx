import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export const GrowthChart = ({ growthData }) => {
  if (!growthData || growthData.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-lg bg-[#0e101a] border border-slate-800">
      <div className="text-sm font-semibold text-slate-200 mb-3">
        Operations vs. Input Size
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="input_size"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            label={{ value: 'Operations', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f121d', border: '1px solid #1e293b', fontSize: 12 }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="operation_count"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ fill: '#22d3ee', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};