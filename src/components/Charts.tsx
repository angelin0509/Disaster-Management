import React from 'react';
import { EmergencyCategory, RequestStatus } from '../types';

interface CategoryBarChartProps {
  data: Array<{ category: EmergencyCategory; count: number }>;
  total: number;
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data, total }) => {
  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        No emergency category data recorded yet.
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    Flood: '#2563EB',
    Fire: '#E73343',
    'Medical Emergency': '#DC2626',
    'Building Damage': '#D97706',
    'Trapped Person': '#7C3AED',
    Cyclone: '#0284C7',
    Earthquake: '#9333EA',
    Other: '#64748B'
  };

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const color = categoryColors[item.category] || '#475569';
        return (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{item.category}</span>
              <div className="flex items-center gap-2 text-slate-500 font-mono tabular-nums">
                <span>{item.count}</span>
                <span className="text-[11px] text-slate-400">({percentage}%)</span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(percentage, 4)}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface StatusDoughnutProps {
  pending: number;
  inProgress: number;
  completed: number;
}

export const StatusDoughnutChart: React.FC<StatusDoughnutProps> = ({ pending, inProgress, completed }) => {
  const total = pending + inProgress + completed;

  if (total === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        No status records available.
      </div>
    );
  }

  const pendingPct = Math.round((pending / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);
  const completedPct = 100 - pendingPct - inProgressPct;

  return (
    <div className="space-y-4">
      {/* Segmented bar */}
      <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
        {pending > 0 && (
          <div
            style={{ width: `${pendingPct}%` }}
            className="bg-amber-500 h-full transition-all duration-500"
            title={`Pending: ${pending}`}
          />
        )}
        {inProgress > 0 && (
          <div
            style={{ width: `${inProgressPct}%` }}
            className="bg-blue-600 h-full transition-all duration-500"
            title={`In Progress: ${inProgress}`}
          />
        )}
        {completed > 0 && (
          <div
            style={{ width: `${completedPct}%` }}
            className="bg-emerald-600 h-full transition-all duration-500"
            title={`Completed: ${completed}`}
          />
        )}
      </div>

      {/* Legend & Breakdown */}
      <div className="grid grid-cols-3 gap-2 text-center pt-2">
        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
          <span className="text-[11px] text-amber-800 font-medium block">Pending</span>
          <span className="text-lg font-bold text-amber-900 font-mono tabular-nums">{pending}</span>
          <span className="text-[10px] text-amber-700 block mt-0.5">{pendingPct}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
          <span className="text-[11px] text-blue-800 font-medium block">In Progress</span>
          <span className="text-lg font-bold text-blue-900 font-mono tabular-nums">{inProgress}</span>
          <span className="text-[10px] text-blue-700 block mt-0.5">{inProgressPct}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
          <span className="text-[11px] text-emerald-800 font-medium block">Completed</span>
          <span className="text-lg font-bold text-emerald-900 font-mono tabular-nums">{completed}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">{completedPct}%</span>
        </div>
      </div>
    </div>
  );
};
