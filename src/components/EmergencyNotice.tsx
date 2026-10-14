import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyNotice: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="bg-[#102B55] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-[#E73343] shrink-0" />
          <span className="font-semibold">{t('helplineCallout')}</span>
          <span className="hidden md:inline text-slate-300">· {t('prototypeNotice')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6 text-slate-800">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">{t('safetyNoticeTitle')}</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            {t('safetyNoticeBody')}
          </p>
          <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-red-700">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>National Emergency Helpline: 112 (Police, Fire, Medical Ambulances)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
