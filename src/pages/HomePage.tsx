import React, { useEffect, useState } from 'react';
import { Shield, Users, LifeBuoy, Building2, ArrowRight, PhoneCall, AlertTriangle, Radio, Activity, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { OverviewStats } from '../types';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenTwoLaptopModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenTwoLaptopModal }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<OverviewStats | null>(null);

  useEffect(() => {
    fetch('/api/stats/overview')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const portalCards = [
    {
      id: 'people',
      title: t('peoplePortalCardTitle'),
      desc: t('peoplePortalCardDesc'),
      btnText: t('peoplePortalCardBtn'),
      icon: Users,
      badge: 'Public Access',
      accentColor: 'hover:border-[#E73343]'
    },
    {
      id: 'volunteer',
      title: t('volunteerPortalCardTitle'),
      desc: t('volunteerPortalCardDesc'),
      btnText: t('volunteerPortalCardBtn'),
      icon: LifeBuoy,
      badge: 'Relief Fieldwork',
      accentColor: 'hover:border-blue-600'
    },
    {
      id: 'rescue',
      title: t('rescuePortalCardTitle'),
      desc: t('rescuePortalCardDesc'),
      btnText: t('rescuePortalCardBtn'),
      icon: Shield,
      badge: 'Dispatch Operations',
      accentColor: 'hover:border-[#E73343]'
    },
    {
      id: 'headoffice',
      title: t('headOfficeCardTitle'),
      desc: t('headOfficeCardDesc'),
      btnText: t('headOfficeCardBtn'),
      icon: Building2,
      badge: 'Executive Oversight',
      accentColor: 'hover:border-[#102B55]'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#102B55] to-[#163C72] text-white pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full text-xs font-semibold text-red-200">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>Centralized Disaster Response Coordination</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-base text-slate-200 leading-relaxed max-w-xl">
                {t('heroSubtitle')}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('people')}
                  className="px-6 py-3.5 bg-[#E73343] hover:bg-[#d02434] text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 group whitespace-nowrap shrink-0"
                >
                  <span>{t('heroCtaReport')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('portals-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 backdrop-blur-xs transition-colors whitespace-nowrap shrink-0"
                >
                  {t('heroCtaExplore')}
                </button>
              </div>

              {/* National Helpline Callout */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium bg-red-950/60 border border-red-500/30 px-3 py-2 rounded-lg text-red-200">
                  <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                  <span>National Emergency: <strong>Dial 112</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SQLite Relational Database Persistence</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Disaster Response Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src="/src/assets/images/hero_disaster_response_1791961934580.jpg"
                  alt="Emergency disaster rescue workers and boats in action"
                  className="w-full h-80 sm:h-96 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102B55] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-mono">
                    <span className="font-semibold text-white">Live Incident Command Hub</span>
                    <span className="text-emerald-400 font-medium">Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Multi-agency triage connecting ground rescue units with real-time database updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time KPI Ribbon (Live from Database) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Emergency Requests
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#102B55] font-mono tabular-nums">
              {stats ? stats.totalRequests : '—'}
            </div>
            <span className="text-[11px] text-slate-400 block">Recorded in database</span>
          </div>

          <div className="space-y-1 sm:pl-6 pt-4 sm:pt-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Pending Coordination
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono tabular-nums">
              {stats ? stats.pendingRequests : '—'}
            </div>
            <span className="text-[11px] text-slate-400 block">Awaiting field dispatch</span>
          </div>

          <div className="space-y-1 sm:pl-6 pt-4 sm:pt-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Active Relief Missions
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono tabular-nums">
              {stats ? stats.inProgressRequests : '—'}
            </div>
            <span className="text-[11px] text-slate-400 block">Rescue teams deployed</span>
          </div>

          <div className="space-y-1 sm:pl-6 pt-4 sm:pt-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Citizens Assisted
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono tabular-nums">
              {stats ? stats.peopleAssisted : '—'}
            </div>
            <span className="text-[11px] text-slate-400 block">Evacuated to safety</span>
          </div>
        </div>
      </section>

      {/* Four Major Operational Portals */}
      <section id="portals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B55]">
            {t('portalCardsHeading')}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('portalCardsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portalCards.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-xs transition-all duration-200 hover:shadow-md ${portal.accentColor}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-[#102B55]">
                      <Icon className="w-6 h-6 text-[#E73343]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#102B55]">
                    {portal.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {portal.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate(portal.id)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-[#102B55] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{portal.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Emergency Advisory Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t('safetyNoticeTitle')}</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
              {t('safetyNoticeBody')}
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E73343] hover:bg-[#c92534] text-white text-xs font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 (National Emergency)</span>
            </a>
            <button
              onClick={onOpenTwoLaptopModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              <span>{t('twoLaptopGuide')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
