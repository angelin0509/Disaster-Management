import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyNotice } from './components/EmergencyNotice';
import { MultiLaptopModal } from './components/MultiLaptopModal';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PeoplePortal } from './pages/PeoplePortal';
import { VolunteerPortal } from './pages/VolunteerPortal';
import { RescuePortal } from './pages/RescuePortal';
import { HeadOfficePortal } from './pages/HeadOfficePortal';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import { UserRole } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [twoLaptopModalOpen, setTwoLaptopModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'volunteer') {
      setCurrentTab('volunteer');
    } else if (role === 'rescue') {
      setCurrentTab('rescue');
    } else if (role === 'headoffice') {
      setCurrentTab('headoffice');
    } else {
      setCurrentTab('people');
    }
  };

  // Render Access Denied Guard
  const renderAccessDenied = (requiredRole: string) => (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
        This portal requires <strong>{requiredRole}</strong> authorization credentials.
        {user ? (
          <> You are currently signed in as <strong>{user.fullName}</strong> with role <strong>{user.role}</strong>.</>
        ) : (
          <> Please sign in with an authorized account to access this operational console.</>
        )}
      </p>
      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setCurrentTab('login')}
          className="px-4 py-2 bg-[#102B55] hover:bg-[#163C72] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <LogIn className="w-4 h-4" />
          <span>Switch or Sign In to Authorized Account</span>
        </button>
        <button
          onClick={() => setCurrentTab('home')}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenTwoLaptopModal={() => setTwoLaptopModalOpen(true)}
          />
        );

      case 'people':
        return <PeoplePortal />;

      case 'volunteer':
        if (!user) {
          return <LoginPage onSuccess={handleLoginSuccess} defaultRole="volunteer" />;
        }
        if (user.role !== 'volunteer' && user.role !== 'rescue' && user.role !== 'headoffice') {
          return renderAccessDenied('Volunteer');
        }
        return <VolunteerPortal />;

      case 'rescue':
        if (!user) {
          return <LoginPage onSuccess={handleLoginSuccess} defaultRole="rescue" />;
        }
        if (user.role !== 'rescue' && user.role !== 'headoffice') {
          return renderAccessDenied('Rescue Team');
        }
        return <RescuePortal />;

      case 'headoffice':
        if (!user) {
          return <LoginPage onSuccess={handleLoginSuccess} defaultRole="headoffice" />;
        }
        if (user.role !== 'headoffice') {
          return renderAccessDenied('Head Office');
        }
        return <HeadOfficePortal />;

      case 'login':
        return <LoginPage onSuccess={handleLoginSuccess} defaultRole="rescue" />;

      default:
        return (
          <HomePage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenTwoLaptopModal={() => setTwoLaptopModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      {/* Top Helpline Callout */}
      <EmergencyNotice compact />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenTwoLaptopModal={() => setTwoLaptopModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer
        onOpenTwoLaptopModal={() => setTwoLaptopModalOpen(true)}
        setCurrentTab={setCurrentTab}
      />

      {/* Two-Laptop Guide Modal */}
      <MultiLaptopModal
        isOpen={twoLaptopModalOpen}
        onClose={() => setTwoLaptopModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
