import React, { useEffect, useState } from 'react';
import {
  Building2, Download, BarChart3, PieChart, Activity, ShieldCheck, Users,
  CheckCircle2, Clock, AlertCircle, FileSpreadsheet, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { OverviewStats } from '../types';
import { CategoryBarChart, StatusDoughnutChart } from '../components/Charts';

export const HeadOfficePortal: React.FC = () => {
  const { authFetch } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadData = async () => {
    try {
      const res = await authFetch('/api/stats/overview');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const res = await authFetch('/api/reports/export-csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DisasterShield_Incident_Report_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error('Export CSV error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#102B55] text-white rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[#102B55]">
              {t('headOfficeHeading')}
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Executive disaster command intelligence, cross-district incident metrics, and downloadable regulatory audit data.
          </p>
        </div>

        {/* Action Button: Export CSV */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="px-4 py-2.5 bg-[#102B55] hover:bg-[#163C72] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-2xs whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>{exporting ? 'Generating CSV...' : t('btnExportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Hero Control Room Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
        <img
          src="/src/assets/images/control_room_operations_1791961935864.jpg"
          alt="Emergency Operations Command Center"
          className="w-full h-48 sm:h-56 object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102B55] via-[#102B55]/85 to-transparent p-6 sm:p-8 flex flex-col justify-center text-white space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-400 font-mono">
            State Emergency Operations Center (SEOC)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold max-w-xl leading-tight">
            Comprehensive Disaster Situation Report & Analytics
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            Aggregated real-time metrics dynamically queried from the live relational SQLite database engine.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Emergency Intake</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-[#102B55] font-mono tabular-nums">
            {stats ? stats.totalRequests : '—'}
          </div>
          <span className="text-[11px] text-slate-400 block">All recorded incidents</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-1 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Response</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-amber-600 font-mono tabular-nums">
            {stats ? stats.pendingRequests : '—'}
          </div>
          <span className="text-[11px] text-slate-400 block">Queue awaiting rescue team</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs space-y-1 bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Missions</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-blue-600 font-mono tabular-nums">
            {stats ? stats.inProgressRequests : '—'}
          </div>
          <span className="text-[11px] text-slate-400 block">Field rescue in progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Citizens Rescued</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 font-mono tabular-nums">
            {stats ? stats.peopleAssisted : '—'}
          </div>
          <span className="text-[11px] text-slate-400 block">Evacuated to safety centers</span>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Distribution Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#102B55] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>{t('categoryDistributionTitle')}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Database Aggregate
            </span>
          </div>

          <CategoryBarChart
            data={stats?.categoryDistribution || []}
            total={stats?.totalRequests || 0}
          />
        </div>

        {/* Operational Status Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#102B55] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>{t('statusBreakdownTitle')}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Triage Pipeline
            </span>
          </div>

          <StatusDoughnutChart
            pending={stats?.pendingRequests || 0}
            inProgress={stats?.inProgressRequests || 0}
            completed={stats?.completedRequests || 0}
          />

          <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
              <span>Volunteer Force Mobilization</span>
              <span className="font-mono tabular-nums">{stats?.availableVolunteers || 0} ready</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Total registered field volunteers across all districts: {stats?.totalVolunteers || 0}. Available responders can be deployed through the Rescue Team Portal.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Incident Intake & Live Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Requests Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102B55]">
              Recent Emergency Requests Intake
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Top 6 Latest</span>
          </div>

          {stats?.recentRequests && stats.recentRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold">
                    <th className="py-2 px-2">ID</th>
                    <th className="py-2 px-2">Requester</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2">Area</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-2 font-mono font-bold text-slate-800">{r.id}</td>
                      <td className="py-2.5 px-2 text-slate-700 font-medium">{r.name}</td>
                      <td className="py-2.5 px-2 text-slate-600">{r.emergency_type}</td>
                      <td className="py-2.5 px-2 text-slate-500 max-w-[140px] truncate">{r.area}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">No recent requests recorded.</div>
          )}
        </div>

        {/* Audit Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102B55] flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              <span>{t('recentIncidentLog')}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Status Audit Trail</span>
          </div>

          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivities.map((act) => (
                <div key={act.id} className="text-xs border-l-2 border-slate-200 pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#102B55]">{act.emergency_request_id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(act.changed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-slate-700">
                    <span className="font-semibold text-slate-900">{act.new_status}</span>
                    <span className="text-slate-400 text-[11px]"> (from {act.old_status})</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{act.changed_by}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">No activity records logged.</div>
          )}
        </div>
      </div>
    </div>
  );
};
