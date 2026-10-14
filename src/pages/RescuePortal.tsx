import React, { useEffect, useState } from 'react';
import {
  Shield, Search, Filter, RefreshCw, MapPin, Phone, Users, CheckCircle2,
  AlertTriangle, Clock, ArrowUpDown, UserCheck, Plus, X, Radio, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyRequest, Volunteer, OverviewStats, RequestStatus, EmergencyCategory } from '../types';
import { EmergencyMap } from '../components/EmergencyMap';

export const RescuePortal: React.FC = () => {
  const { authFetch } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Request detail & action modal
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [requestHistory, setRequestHistory] = useState<any[]>([]);
  const [requestTasks, setRequestTasks] = useState<any[]>([]);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  // Assign volunteer task modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [assigningTask, setAssigningTask] = useState(false);
  const [assignError, setAssignError] = useState('');

  const fetchDashboardData = async () => {
    try {
      // 1. Stats
      const statsRes = await fetch('/api/stats/overview');
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s);
      }

      // 2. Requests
      const reqRes = await authFetch('/api/requests');
      if (reqRes.ok) {
        const rData = await reqRes.json();
        setRequests(rData.requests || []);
      }

      // 3. Volunteers
      const volRes = await authFetch('/api/volunteers');
      if (volRes.ok) {
        const vData = await volRes.json();
        setVolunteers(vData.volunteers || []);
      }
    } catch (err) {
      console.error('Error fetching rescue command data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Live synchronization polling every 3 seconds
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const openRequestDetail = async (req: EmergencyRequest) => {
    setSelectedRequest(req);
    setStatusNote('');
    try {
      const res = await authFetch(`/api/requests/${req.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequestHistory(data.history || []);
        setRequestTasks(data.tasks || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (newStatus: RequestStatus) => {
    if (!selectedRequest) return;
    setStatusUpdating(true);
    try {
      const res = await authFetch(`/api/requests/${selectedRequest.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: statusNote })
      });
      if (res.ok) {
        // Refresh request
        openRequestDetail({ ...selectedRequest, status: newStatus });
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleOpenAssign = (req: EmergencyRequest) => {
    setSelectedRequest(req);
    setTaskTitle(`Dispatch: Immediate relief for ${req.emergency_type} at ${req.area.slice(0, 30)}`);
    setTaskDescription(`Evacuate / assist ${req.people_count} individuals. Special details: ${req.details || 'None specified'}`);
    setTaskPriority(req.emergency_type === 'Trapped Person' || req.emergency_type === 'Medical Emergency' ? 'Critical' : 'High');
    // Default to first available volunteer
    const available = volunteers.find((v) => v.availability === 'Available');
    setSelectedVolunteerId(available ? available.id : (volunteers[0]?.id || ''));
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !selectedVolunteerId) {
      setAssignError('Please select an authorized volunteer.');
      return;
    }

    setAssigningTask(true);
    setAssignError('');
    try {
      const res = await authFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyRequestId: selectedRequest.id,
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          volunteerId: selectedVolunteerId
        })
      });

      if (res.ok) {
        setAssignModalOpen(false);
        fetchDashboardData();
        if (selectedRequest) {
          openRequestDetail(selectedRequest);
        }
      } else {
        const d = await res.json();
        setAssignError(d.error || 'Failed to dispatch task.');
      }
    } catch (err) {
      setAssignError('Network error dispatching task.');
    } finally {
      setAssigningTask(false);
    }
  };

  // Filter & search logic
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || r.emergency_type === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const getStatusBadge = (s: RequestStatus) => {
    switch (s) {
      case 'Pending':
        return <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-bold">Pending</span>;
      case 'In Progress':
        return <span className="text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[11px] font-bold">In Progress</span>;
      case 'Completed':
        return <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold">Completed</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E73343] text-white rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[#102B55]">
              {t('rescueDashboardTitle')}
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time emergency request triage, volunteer resource dispatching, and field status synchronization.
          </p>
        </div>

        {/* Live sync pill-less indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t('liveSyncNotice')}</span>
        </div>
      </div>

      {/* Real Database KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">{t('statTotalRequests')}</span>
          <span className="text-2xl font-bold text-[#102B55] font-mono tabular-nums">{stats ? stats.totalRequests : '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs bg-amber-50/20">
          <span className="text-[11px] font-semibold text-amber-700 uppercase block">{t('statPendingRequests')}</span>
          <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{stats ? stats.pendingRequests : '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs bg-blue-50/20">
          <span className="text-[11px] font-semibold text-blue-700 uppercase block">{t('statInProgress')}</span>
          <span className="text-2xl font-bold text-blue-600 font-mono tabular-nums">{stats ? stats.inProgressRequests : '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs bg-emerald-50/20">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block">{t('statCompleted')}</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">{stats ? stats.completedRequests : '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">{t('statAvailableVolunteers')}</span>
          <span className="text-2xl font-bold text-slate-800 font-mono tabular-nums">{stats ? `${stats.availableVolunteers} / ${stats.totalVolunteers}` : '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">{t('statPeopleAssisted')}</span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{stats ? stats.peopleAssisted : '—'}</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#102B55] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#E73343]" />
            <span>{t('interactiveIncidentMap')}</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click pins to inspect victim coordinates and dispatch relief units
          </span>
        </div>
        <EmergencyMap requests={requests} onSelectRequest={openRequestDetail} />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#102B55]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
          >
            <option value="All">{t('filterStatus')}: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
          >
            <option value="All">{t('filterCategory')}: All</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Medical Emergency">Medical Emergency</option>
            <option value="Building Damage">Building Damage</option>
            <option value="Trapped Person">Trapped Person</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Requests Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#102B55]">
            Emergency Assistance Queue ({filteredRequests.length} records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Direct SQLite Relation
          </span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            {t('noRecordsFound')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">{t('thRequestId')}</th>
                  <th className="py-3 px-4">{t('thRequester')}</th>
                  <th className="py-3 px-4">{t('thCategory')}</th>
                  <th className="py-3 px-4">{t('thArea')}</th>
                  <th className="py-3 px-4 text-center">{t('thPeople')}</th>
                  <th className="py-3 px-4">{t('thStatus')}</th>
                  <th className="py-3 px-4">{t('thTime')}</th>
                  <th className="py-3 px-4 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => openRequestDetail(req)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#102B55]">
                      {req.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{req.name}</div>
                      <div className="text-slate-400 text-[11px]">{req.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {req.emergency_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={req.area}>
                      {req.area}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      {req.people_count}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenAssign(req)}
                        title="Assign volunteer mission"
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        {t('btnAssignVolunteer')}
                      </button>
                      <button
                        onClick={() => openRequestDetail(req)}
                        title="View details & triage"
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        Triage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Details & Status Update Modal */}
      {selectedRequest && !assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Emergency Incident</span>
                <h3 className="text-base font-bold text-[#102B55] flex items-center gap-2">
                  <span>{selectedRequest.id}</span>
                  {getStatusBadge(selectedRequest.status)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Requester Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRequest.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Phone</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRequest.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Emergency Category</span>
                  <span className="font-semibold text-red-600">{selectedRequest.emergency_type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Persons Trapped / Affected</span>
                  <span className="font-bold text-slate-900">{selectedRequest.people_count} individuals</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/50">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location / Address</span>
                  <span className="text-slate-800">{selectedRequest.area}</span>
                </div>
                {selectedRequest.details && (
                  <div className="col-span-2 pt-2 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Incident Description</span>
                    <p className="text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                      {selectedRequest.details}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Actions */}
              <div className="p-4 bg-slate-100/60 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block">
                  Advance Incident Status (Dispatches across all dashboards)
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus('Pending')}
                    disabled={statusUpdating || selectedRequest.status === 'Pending'}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      selectedRequest.status === 'Pending'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Set Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('In Progress')}
                    disabled={statusUpdating || selectedRequest.status === 'In Progress'}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      selectedRequest.status === 'In Progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Set In Progress (Rescue Dispatched)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Completed')}
                    disabled={statusUpdating || selectedRequest.status === 'Completed'}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      selectedRequest.status === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Set Completed (Evacuated / Resolved)
                  </button>
                </div>
                <div className="pt-2">
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Optional audit note (e.g. Lifeboat dispatched with medical kit)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Related Tasks */}
              {requestTasks.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 block">Dispatched Volunteer Tasks</span>
                  <div className="space-y-2">
                    {requestTasks.map((t) => (
                      <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{t.title}</div>
                          <div className="text-[11px] text-slate-500">
                            Volunteer: <strong>{t.volunteer_name || 'Assigned'}</strong> · Status: {t.status}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{t.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status History Audit Trail */}
              {requestHistory.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 block">Status Transition Audit Trail</span>
                  <div className="space-y-1 pl-3 border-l-2 border-slate-200">
                    {requestHistory.map((h) => (
                      <div key={h.id} className="text-[11px] text-slate-600 pl-2">
                        <span className="font-semibold text-slate-800">{h.old_status} &rarr; {h.new_status}</span>
                        <span className="text-slate-400"> · {new Date(h.changed_at).toLocaleString()}</span>
                        <p className="text-slate-500">{h.changed_by}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => handleOpenAssign(selectedRequest)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('btnAssignVolunteer')}</span>
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Volunteer Modal */}
      {assignModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-[#102B55] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Assign Volunteer to Incident</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Target Incident: <strong className="font-mono">{selectedRequest.id}</strong> ({selectedRequest.emergency_type})
                </p>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs text-slate-700">
              {assignError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{assignError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Select Qualified Volunteer</label>
                <select
                  value={selectedVolunteerId}
                  onChange={(e) => setSelectedVolunteerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                >
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.full_name || v.username} — [{v.availability}] ({v.skills})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Mission Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Mission Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                >
                  <option value="Critical">Critical (Immediate Life-Safety)</option>
                  <option value="High">High (Urgent Evacuation / Relief)</option>
                  <option value="Medium">Medium (Shelter & Provisions)</option>
                  <option value="Low">Low (Post-Disaster Assessment)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Operational Instructions</label>
                <textarea
                  rows={3}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={assigningTask}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{assigningTask ? 'Dispatching...' : 'Dispatch Mission'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
