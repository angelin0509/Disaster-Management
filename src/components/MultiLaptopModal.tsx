import React, { useState, useEffect } from 'react';
import { X, Laptop, Wifi, CheckCircle2, ShieldAlert, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MultiLaptopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiLaptopModal: React.FC<MultiLaptopModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [networkInfo, setNetworkInfo] = useState<{ localIp: string; port: number; serverUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/network-info')
        .then((res) => res.json())
        .then((data) => setNetworkInfo(data))
        .catch(() => setNetworkInfo({ localIp: '192.168.1.15', port: 3000, serverUrl: 'http://192.168.1.15:3000' }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const displayIpUrl = networkInfo ? networkInfo.serverUrl : `${currentOrigin}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#102B55] text-white rounded-lg">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Multi-Laptop Wi-Fi Demonstration Guide
              </h3>
              <p className="text-xs text-slate-500">
                Demonstrate live multi-role coordination across 2 laptops during your project viva
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* IP Callout Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                Host Server Local Address
              </span>
              <div className="font-mono text-base font-bold text-[#102B55] select-all">
                {displayIpUrl}
              </div>
              <p className="text-xs text-blue-800">
                Enter this URL in the browser on Laptop 2 (connected to the same Wi-Fi).
              </p>
            </div>
            <button
              onClick={() => copyUrl(displayIpUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-blue-800 hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-semibold shrink-0 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>

          {/* Demonstration Architecture Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-[#102B55] text-white flex items-center justify-center text-xs font-mono">1</span>
                <span>Laptop 1 (Host Server)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>Runs the backend Express server & SQLite database.</li>
                <li>Bound to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">0.0.0.0:3000</code>.</li>
                <li>Opens <strong>Rescue Team Portal</strong> & <strong>Head Office</strong>.</li>
                <li>Monitors real-time incoming emergencies & dispatches tasks.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-[#E73343] text-white flex items-center justify-center text-xs font-mono">2</span>
                <span>Laptop 2 (Client / Field)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>Connected to the <strong>same Wi-Fi network or Mobile Hotspot</strong>.</li>
                <li>Opens browser to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{displayIpUrl}</code>.</li>
                <li>Logs into <strong>Volunteer Portal</strong> or <strong>People Portal</strong>.</li>
                <li>Accepts and completes tasks; updates sync to Laptop 1 within 3 seconds!</li>
              </ul>
            </div>
          </div>

          {/* Step-by-Step Viva Demo Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Step-by-Step Viva Demonstration Workflow</span>
            </h4>
            <ol className="text-xs space-y-2 list-decimal pl-5 text-slate-600">
              <li>
                <strong>Connect both laptops to the same Wi-Fi router</strong> (or turn on mobile phone hotspot and connect both laptops to it).
              </li>
              <li>
                On Laptop 1, run <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">npm run dev</code>.
              </li>
              <li>
                On Laptop 1, open browser to <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">http://localhost:3000</code> and sign in as <strong>Rescue Team</strong> (<code className="font-mono">rescue@shield.org</code> / <code className="font-mono">rescue123</code>).
              </li>
              <li>
                On Laptop 2, open browser and navigate to the Host URL: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">{displayIpUrl}</code>.
              </li>
              <li>
                On Laptop 2, submit a new emergency request from the <strong>People Portal</strong> or log in as a <strong>Volunteer</strong> (<code className="font-mono">volunteer@shield.org</code> / <code className="font-mono">volunteer123</code>).
              </li>
              <li>
                Watch Laptop 1: within 3 seconds, the new emergency request pops up in the Rescue dashboard automatically without page reload!
              </li>
            </ol>
          </div>

          {/* Troubleshooting Accordion */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Troubleshooting: Cannot connect from Laptop 2?</span>
            </div>
            <p>
              1. <strong>Windows Defender Firewall</strong>: On Laptop 1, temporarily allow Node.js through Windows Firewall, or open port 3000 (Inbound Rule &gt; Port 3000 TCP &gt; Allow).
            </p>
            <p>
              2. <strong>AP Isolation</strong>: Some college Wi-Fi routers block client-to-client traffic (Client Isolation). If this occurs, create a personal Wi-Fi Hotspot on a smartphone and connect both laptops to it.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="/disastershield-project.zip"
            download="disastershield-project.zip"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <span>Download Project ZIP</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#102B55] hover:bg-[#163C72] rounded-lg transition-colors"
          >
            {t('closeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
