import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User as UserIcon, AlertCircle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onSuccess: (role: UserRole) => void;
  defaultRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, defaultRole = 'rescue' }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration fields
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regSkills, setRegSkills] = useState('First aid, Food distribution');
  const [regExperience, setRegExperience] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: 'Citizen', role: 'people' as UserRole, login: 'citizen@shield.org', pass: 'citizen123' },
    { label: 'Volunteer', role: 'volunteer' as UserRole, login: 'volunteer@shield.org', pass: 'volunteer123' },
    { label: 'Rescue Team', role: 'rescue' as UserRole, login: 'rescue@shield.org', pass: 'rescue123' },
    { label: 'Head Office', role: 'headoffice' as UserRole, login: 'headoffice@shield.org', pass: 'office123' },
  ];

  const handleAutofill = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setIdentifier(acc.login);
    setPassword(acc.pass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (mode === 'login') {
      const res = await login(identifier, password, selectedRole);
      setLoading(false);
      if (res.success) {
        onSuccess(selectedRole);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } else {
      // Volunteer registration
      const res = await register({
        username: regUsername,
        email: regEmail,
        password,
        role: 'volunteer',
        fullName: regFullName,
        phone: regPhone,
        location: regLocation,
        skills: regSkills,
        experience: regExperience
      });
      setLoading(false);
      if (res.success) {
        onSuccess('volunteer');
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch bg-slate-50">
      {/* Desktop Left Side: High-res photography & message */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#102B55] overflow-hidden text-white flex-col justify-between p-12">
        <img
          src="/src/assets/images/rescue_team_action_1791961934928.jpg"
          alt="Rescue team members coordinating emergency operations"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102B55] via-[#102B55]/70 to-transparent" />

        {/* Top Info */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#E73343] flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">DisasterShield</span>
          </div>
          <span className="text-xs text-slate-300 block font-mono">
            Emergency Response & Incident Coordination
          </span>
        </div>

        {/* Center message */}
        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-3xl font-bold tracking-tight leading-snug">
            Immediate Response. Seamless Triage. Unified Command.
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            Connect citizens in vulnerable disaster zones with certified volunteers and emergency rescue response forces in real time.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Role-based Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>SQLite Persistent Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Multi-Laptop Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom advisory */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-slate-300">
          For real life-threatening emergencies in India, always dial <strong>112</strong> immediately.
        </div>
      </div>

      {/* Right Side: Modern Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#102B55]">
              {mode === 'login' ? t('loginHeading') : 'Register as Volunteer'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'login' ? t('loginSubtitle') : 'Join the community disaster response team.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register Volunteer
            </button>
          </div>

          {/* Quick autofill demo buttons for Viva / evaluation */}
          {mode === 'login' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-slate-600 block">
                {t('quickDemoAccounts')}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleAutofill(acc)}
                    className="px-2.5 py-1.5 text-xs text-left font-medium bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors flex items-center justify-between"
                  >
                    <span>{acc.label}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{acc.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <>
                {/* Portal / Role selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t('selectRole')}
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] bg-white text-slate-800"
                  >
                    <option value="people">{t('rolePeople')}</option>
                    <option value="volunteer">{t('roleVolunteer')}</option>
                    <option value="rescue">{t('roleRescue')}</option>
                    <option value="headoffice">{t('roleHeadOffice')}</option>
                  </select>
                </div>

                {/* Identifier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t('usernameOrEmail')}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. rescue@shield.org"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102B55] text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Volunteer Registration Fields */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Username</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="suresh_vol"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Phone</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98400 12345"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="suresh@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Location / Operational District</label>
                  <input
                    type="text"
                    required
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="e.g. Guindy, Chennai"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Relief Skills</label>
                  <input
                    type="text"
                    value={regSkills}
                    onChange={(e) => setRegSkills(e.target.value)}
                    placeholder="First aid, Food distribution, Logistics"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#102B55] hover:bg-[#163C72] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? t('btnSignIn') : 'Complete Volunteer Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
