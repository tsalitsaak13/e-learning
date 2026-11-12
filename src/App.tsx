import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { StudentPortal } from './components/StudentPortal';
import { ParentPortal } from './components/ParentPortal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TaskArchiveView } from './components/TaskArchiveView';
import { AiTutorAssistant } from './components/AiTutorAssistant';
import {
  BookOpen,
  Archive,
  Bot,
  Users,
  CreditCard,
  UserCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { BIMBEL_INFO } from './data/mockData';

const MainAppContent: React.FC = () => {
  const { currentUser, currentRole, sidebarCollapsed } = useApp();
  const [navTab, setNavTab] = useState<string>('main');

  // If not logged in, show AuthScreen for dedicated student/parent/teacher login
  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-indigo-500 selection:text-white">
      {/* Side Navigation Bar */}
      <Sidebar currentTab={navTab} onSelectTab={setNavTab} />

      {/* Main Content Area with Dynamic Margin matching Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Dynamic Nav Sub-strip for quick view confirmation */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Halaman Aktif:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              {navTab === 'main'
                ? currentRole === 'student'
                  ? 'Modul & Kuis Belajar'
                  : currentRole === 'parent'
                  ? 'Laporan WhatsApp & Pemantauan Nilai'
                  : 'Dasbor Keterlibatan Real-Time & Radar'
                : navTab === 'archive'
                ? 'Arsip Tugas 1 Semester'
                : 'Tutor Pintar AI'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="hidden sm:inline">Pengguna Aktif:</span>
            <strong className="text-slate-800">{currentUser.name}</strong>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-mono text-[11px]">
              @{currentUser.username}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {navTab === 'main' && (
            <>
              {currentRole === 'student' && <StudentPortal />}
              {currentRole === 'parent' && <ParentPortal />}
              {currentRole === 'teacher' && <TeacherDashboard />}
            </>
          )}

          {navTab === 'archive' && <TaskArchiveView />}

          {navTab === 'ai-tutor' && <AiTutorAssistant />}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Bimbel Cerdas Mandiri</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Bimbingan belajar SD & SMP dengan sistem e-learning mandiri, pemantauan orang tua via WhatsApp, dan bimbingan privat 1-on-1.
                </p>
              </div>

              <div className="space-y-1.5 text-slate-400">
                <p className="font-bold text-white text-xs">Jadwal & Program Les:</p>
                <p>• Paket Reguler (Maks 5 Siswa): Senin & Rabu (16.00 – 17.30 WIB)</p>
                <p>• Paket Intensif (Privat 1-on-1): Selasa / Kamis / Sabtu</p>
                <p className="text-amber-400 font-medium">⚠️ Tenggat Tugas Modul: Maksimal H-1</p>
              </div>

              <div className="space-y-1.5 text-slate-400">
                <p className="font-bold text-white text-xs">Hubungi Bimbel:</p>
                <p>📍 {BIMBEL_INFO.address}</p>
                <p>📞 Hotline / WA: {BIMBEL_INFO.contactPhone}</p>
                <p>👩‍🏫 Tutor: {BIMBEL_INFO.tutorName}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-slate-500 text-[11px]">
              © {new Date().getFullYear()} Bimbel Cerdas Mandiri • Sistem E-Learning Terintegrasi
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
