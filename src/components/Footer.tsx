import React from 'react';
import { Shield, PhoneCall, Laptop, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenTwoLaptopModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTwoLaptopModal, setCurrentTab }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#102B55] text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700/60">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E73343] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DisasterShield</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              A comprehensive disaster management and emergency response coordination system built with a unified full-stack architecture, relational database persistence, and synchronized multi-role portals.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-xs">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>National Helpline (India): <strong>112</strong></span>
            </div>
          </div>

          {/* Rapid Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Operational Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('people')} className="hover:text-white transition-colors">
                  {t('navPeople')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('volunteer')} className="hover:text-white transition-colors">
                  {t('navVolunteer')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('rescue')} className="hover:text-white transition-colors">
                  {t('navRescue')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('headoffice')} className="hover:text-white transition-colors">
                  {t('navHeadOffice')}
                </button>
              </li>
            </ul>
          </div>

          {/* Demo & Networking */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">College Viva / Demo</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Demonstrate live coordination across two laptops on the same local Wi-Fi network.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={onOpenTwoLaptopModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#163C72] hover:bg-[#1a498a] text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>{t('twoLaptopGuide')}</span>
              </button>
              <a
                href="/disastershield-project.zip"
                download="disastershield-project.zip"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
              >
                <span>Download Source ZIP</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-red-400" />
            <span>DisasterShield Academic & Hackathon Project — Designed for Public Good</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Emergency Triage Prototype · SQLite Relational Persistence · Multi-Laptop Synchronization
          </div>
        </div>
      </div>
    </footer>
  );
};
