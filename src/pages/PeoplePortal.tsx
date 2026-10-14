import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Search, Send, Clock, Phone, MapPin, Users, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { EmergencyCategory, RequestStatus } from '../types';
import { EmergencyNotice } from '../components/EmergencyNotice';

export const PeoplePortal: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Submission Form State
  const [name, setName] = useState(user ? user.fullName : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [area, setArea] = useState('');
  const [emergencyType, setEmergencyType] = useState<EmergencyCategory>('Flood');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Status Check State
  const [searchId, setSearchId] = useState('');
  const [searchedRequest, setSearchedRequest] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ requestId: string; status: string; createdAt: string } | null>(null);
  const [formError, setFormError] = useState('');

  const emergencyCategories: EmergencyCategory[] = [
    'Flood',
    'Fire',
    'Medical Emergency',
    'Building Damage',
    'Trapped Person',
    'Cyclone',
    'Earthquake',
    'Other'
  ];

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(5)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(5)));
        },
        () => {
          // Fallback approximate coordinates
          setLatitude(13.0827);
          setLongitude(80.2707);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !phone.trim() || !area.trim()) {
      setFormError('Please fill in your name, contact phone, and affected area address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: user?.id || null,
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          emergencyType,
          peopleCount,
          details: details.trim(),
          latitude,
          longitude
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (res.ok && data.success) {
        setSubmittedResult({
          requestId: data.requestId,
          status: data.status,
          createdAt: data.createdAt
        });
        // Clear optional inputs to prevent accidental duplicates
        setDetails('');
      } else {
        setFormError(data.error || 'Failed to submit emergency request.');
      }
    } catch (err) {
      setSubmitting(false);
      setFormError('Network communication error. Please try again.');
    }
  };

  const handleTrackRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setSearchedRequest(null);

    try {
      const res = await fetch(`/api/requests/${encodeURIComponent(searchId.trim())}`);
      const data = await res.json();
      setSearchLoading(false);

      if (res.ok && data.request) {
        setSearchedRequest(data);
      } else {
        setSearchError(data.error || 'No matching emergency request found with this ID.');
      }
    } catch (err) {
      setSearchLoading(false);
      setSearchError('Error connecting to database.');
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md text-xs font-semibold">Pending Triage</span>;
      case 'In Progress':
        return <span className="text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md text-xs font-semibold">Rescue Team Dispatched</span>;
      case 'Completed':
        return <span className="text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-semibold">Mission Completed</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Safety Notice */}
      <EmergencyNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Emergency Request Submission Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#102B55]">
                {t('peopleFormHeading')}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('peopleFormSubheading')}
              </p>
            </div>

            {/* Submission Success Dialog */}
            {submittedResult ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">{t('requestConfirmedTitle')}</h4>
                    <p className="text-xs text-emerald-700">Information logged into centralized rescue database.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-100 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    {t('requestIdLabel')}
                  </span>
                  <div className="font-mono text-xl font-bold text-[#102B55] select-all">
                    {submittedResult.requestId}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-600">Current Status:</span>
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {submittedResult.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-emerald-800 leading-relaxed">
                  {t('keepIdNote')} Rescue teams and nearby verified volunteers can now view this alert on their dispatch boards.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmittedResult(null)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Submit Another Emergency Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <span>{t('fullName')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Sundar"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <span>{t('contactPhone')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800"
                    />
                  </div>
                </div>

                {/* Location / Area */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <span>{t('locationArea')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{latitude ? `GPS: ${latitude}, ${longitude}` : 'Attach Device GPS'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Ward 142, AGS Colony, Velachery, Chennai"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800"
                  />
                </div>

                {/* Emergency Category & People Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <span>{t('emergencyCategory')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={emergencyType}
                      onChange={(e) => setEmergencyType(e.target.value as EmergencyCategory)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] bg-white text-slate-800"
                    >
                      {emergencyCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <span>{t('peopleAffectedCount')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      required
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t('additionalDetails')}
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={t('detailsPlaceholder')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#E73343] hover:bg-[#d02434] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? t('submitting') : t('btnSubmitEmergency')}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Track Request Status & Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tracker Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#102B55] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#E73343]" />
                <span>{t('trackHeading')}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Check dispatch updates and volunteer notes for an existing request.
              </p>
            </div>

            <form onSubmit={handleTrackRequest} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. REQ-2026-1001"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] font-mono text-slate-800 uppercase"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-4 py-2 bg-[#102B55] hover:bg-[#163C72] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  {searchLoading ? 'Checking...' : t('btnTrack')}
                </button>
              </div>
            </form>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {searchedRequest && (
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">
                    {searchedRequest.request.id}
                  </span>
                  {getStatusBadge(searchedRequest.request.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Category</span>
                    <span className="font-semibold text-slate-800">{searchedRequest.request.emergency_type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">People Count</span>
                    <span className="font-semibold text-slate-800">{searchedRequest.request.people_count}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 block uppercase">Location Area</span>
                    <span className="text-slate-800">{searchedRequest.request.area}</span>
                  </div>
                </div>

                {/* Audit Timeline */}
                {searchedRequest.history && searchedRequest.history.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      Status Audit Trail
                    </span>
                    <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
                      {searchedRequest.history.map((h: any) => (
                        <div key={h.id} className="text-[11px] text-slate-600 pl-2">
                          <span className="font-medium text-slate-800">{h.new_status}</span>
                          <span className="text-slate-400"> · {new Date(h.changed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <p className="text-[10px] text-slate-500">{h.changed_by}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-[#102B55] text-white rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-red-300">
              <ShieldAlert className="w-4 h-4" />
              <span>What happens after you submit?</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Request is directly committed to the centralized SQLite database.</li>
              <li>Rescue dispatchers evaluate urgency and place location coordinates on map.</li>
              <li>Nearby certified volunteers are mobilized with first-aid and relief supplies.</li>
              <li>Status transitions from <strong>Pending</strong> to <strong>In Progress</strong> and <strong>Completed</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
