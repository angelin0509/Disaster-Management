import React, { useState } from 'react';
import { Shield, Globe, Menu, X, LogOut, Laptop } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenTwoLaptopModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenTwoLaptopModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('navHome') },
    { id: 'people', label: t('navPeople') },
    { id: 'volunteer', label: t('navVolunteer') },
    { id: 'rescue', label: t('navRescue') },
    { id: 'headoffice', label: t('navHeadOffice') },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  const getLanguageLabel = (code: SupportedLanguage) => {
    switch (code) {
      case 'ta': return 'தமிழ்';
      case 'hi': return 'हिन्दी';
      default: return 'English';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E73343] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#102B55] block leading-none">
                DisasterShield
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block mt-0.5">
                Coordination System
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean text) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#E73343] font-semibold'
                      : 'hover:text-[#102B55]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E73343] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language, 2-Laptop Guide, User/Login) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Multi-laptop button */}
            <button
              onClick={onOpenTwoLaptopModal}
              title="Two-laptop Wi-Fi Demo Guide"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('twoLaptopGuide')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap shrink-0"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{getLanguageLabel(language)}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50 text-xs"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors ${
                      language === 'en' ? 'font-bold text-[#E73343]' : 'text-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ta')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors ${
                      language === 'ta' ? 'font-bold text-[#E73343]' : 'text-slate-700'
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors ${
                      language === 'hi' ? 'font-bold text-[#E73343]' : 'text-slate-700'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              )}
            </div>

            {/* User Session Profile / Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#102B55] hover:bg-[#163C72] rounded-lg transition-colors shadow-2xs whitespace-nowrap shrink-0"
              >
                {t('navLogin')}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === link.id
                  ? 'bg-red-50 text-[#E73343] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenTwoLaptopModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{t('twoLaptopGuide')}</span>
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 font-medium"
              >
                {t('navLogout')} ({user.username})
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs text-[#102B55] font-semibold"
              >
                {t('navLogin')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
