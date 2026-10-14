import React, { useEffect, useState } from 'react';
import { LifeBuoy, CheckCircle2, XCircle, Clock, MapPin, AlertCircle, Edit2, Save, User, Shield, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyTask, Volunteer, VolunteerAvailability } from '../types';

export const VolunteerPortal: React.FC = () => {
  const { user, authFetch } = useAuth();
  const { t } = useLanguage();

  const [volunteerProfile, setVolunteerProfile] = useState<Volunteer | null>(null);
  const [tasks, setTasks] = useState<EmergencyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);

  // Edit availability state
  const [editMode, setEditMode] = useState(false);
  const [availability, setAvailability] = useState<VolunteerAvailability>('Available');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const loadData = async () => {
    try {
      // Load profile
      const profRes = await authFetch('/api/volunteers/me');
      if (profRes.ok) {
        const profData = await profRes.json();
        setVolunteerProfile(profData.volunteer);
        setAvailability(profData.volunteer.availability);
        setLocation(profData.volunteer.location);
        setSkills(profData.volunteer.skills);
        setExperience(profData.volunteer.experience || '');
      }

      // Load tasks
      const tasksRes = await authFetch('/api/tasks');
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }
    } catch (err) {
      console.error('Error fetching volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Poll every 3 seconds for live sync
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/volunteers/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability, location, skills, experience })
      });
      if (res.ok) {
        setSuccessNotice('Volunteer profile updated successfully.');
        setEditMode(false);
        setTimeout(() => setSuccessNotice(''), 3000);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskAction = async (taskId: string, status: 'Accepted' | 'Declined' | 'Completed') => {
    setUpdatingTask(taskId);
    try {
      const res = await authFetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: `Status changed to ${status} by volunteer ${user?.fullName}`
        })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTask(null);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical':
        return <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded text-[11px] font-bold">Critical</span>;
      case 'High':
        return <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-bold">High</span>;
      default:
        return <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px] font-bold">Standard</span>;
    }
  };

  const getTaskStatusBadge = (s: string) => {
    switch (s) {
      case 'Completed':
        return <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-semibold">Completed</span>;
      case 'Accepted':
      case 'In Progress':
        return <span className="text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md text-xs font-semibold">In Progress</span>;
      case 'Declined':
        return <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold">Declined</span>;
      default:
        return <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md text-xs font-semibold">Assigned (Action Required)</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[#102B55]">{t('volunteerHeading')}</h1>
          </div>
          <p className="text-xs text-slate-500">
            Field relief task assignments synchronized with Central Rescue Command.
          </p>
        </div>

        {/* Live sync tag */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Task Queue (Polling 3s)</span>
        </div>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Volunteer Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#102B55] flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>{t('volunteerProfile')}</span>
              </h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('availabilityLabel')}</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as VolunteerAvailability)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                  >
                    <option value="Available">{t('availAvailable')}</option>
                    <option value="Busy">{t('availBusy')}</option>
                    <option value="Off-duty">{t('availOffDuty')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Operational District / Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Experience / Certification</label>
                  <textarea
                    rows={2}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('saveChanges')}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Full Name</span>
                  <span className="text-sm font-bold text-slate-900">{volunteerProfile?.full_name || user?.fullName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('availabilityLabel')}</span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded font-semibold text-xs ${
                      volunteerProfile?.availability === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : volunteerProfile?.availability === 'Busy'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {volunteerProfile?.availability || 'Available'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                    <span className="text-slate-800 font-medium block truncate mt-0.5">
                      {volunteerProfile?.location || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('skillsLabel')}</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {(volunteerProfile?.skills || 'First Aid, Logistics').split(',').map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {volunteerProfile?.experience && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Experience</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{volunteerProfile.experience}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Standard Operating Procedures</span>
            </h4>
            <p className="leading-relaxed">
              When a new emergency mission is assigned by Rescue Team dispatchers, click <strong>Accept Mission</strong>. Once you have reached the affected location and rendered assistance, click <strong>Mark Mission Completed</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Assigned Tasks List */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#102B55] flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{t('assignedTasksHeading')}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total Missions: {tasks.length}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No Active Missions Assigned</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {t('noTasksAssigned')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#102B55]">{task.id}</span>
                      {getPriorityBadge(task.priority)}
                      {task.emergency_type && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.emergency_type}
                        </span>
                      )}
                    </div>
                    <div>{getTaskStatusBadge(task.status)}</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Context Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                    {task.emergency_area && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Incident Location</span>
                          <span>{task.emergency_area}</span>
                        </div>
                      </div>
                    )}
                    {task.requester_name && (
                      <div className="flex items-start gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Victim Contact</span>
                          <span>{task.requester_name} ({task.requester_phone})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Assigned: {new Date(task.created_at).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {task.status === 'Assigned' && (
                        <>
                          <button
                            onClick={() => handleTaskAction(task.id, 'Declined')}
                            disabled={updatingTask === task.id}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            {t('btnDeclineTask')}
                          </button>
                          <button
                            onClick={() => handleTaskAction(task.id, 'Accepted')}
                            disabled={updatingTask === task.id}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('btnAcceptTask')}</span>
                          </button>
                        </>
                      )}

                      {(task.status === 'Accepted' || task.status === 'In Progress') && (
                        <button
                          onClick={() => handleTaskAction(task.id, 'Completed')}
                          disabled={updatingTask === task.id}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('btnCompleteTask')}</span>
                        </button>
                      )}

                      {task.status === 'Completed' && (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mission Accomplished</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
