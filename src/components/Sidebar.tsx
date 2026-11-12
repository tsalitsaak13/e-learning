import React from 'react';
import {
  BookOpen,
  Archive,
  Bot,
  Users,
  CreditCard,
  UserCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Clock,
  Sparkles,
  GraduationCap,
  Calendar,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const {
    currentUser,
    currentRole,
    currentStudent,
    modules,
    activeModuleId,
    setActiveModuleId,
    unreadNotifCount,
    logout,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
  } = useApp();

  const handleNavClick = (tab: string) => {
    onSelectTab(tab);
    setSidebarOpen(false); // Close on mobile
  };

  // Menu items based on role
  const getNavItems = () => {
    if (currentRole === 'student') {
      return [
        {
          id: 'main',
          label: 'Modul & Kuis Belajar',
          icon: <BookOpen className="w-5 h-5 shrink-0" />,
          badge: `${modules.length} Modul`,
        },
        {
          id: 'archive',
          label: 'Arsip Tugas Semester',
          icon: <Archive className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'ai-tutor',
          label: 'Tutor Pintar AI',
          icon: <Bot className="w-5 h-5 shrink-0" />,
          highlight: true,
        },
      ];
    }

    if (currentRole === 'parent') {
      return [
        {
          id: 'main',
          label: 'Laporan WA & Nilai',
          icon: <Users className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'archive',
          label: 'Arsip Tugas Semester',
          icon: <Archive className="w-5 h-5 shrink-0" />,
        },
        {
          id: 'ai-tutor',
          label: 'Tutor Pintar Bimbel',
          icon: <Bot className="w-5 h-5 shrink-0" />,
        },
      ];
    }

    // Teacher
    return [
      {
        id: 'main',
        label: 'Dasbor & Radar Bimbingan',
        icon: <UserCheck className="w-5 h-5 shrink-0" />,
      },
      {
        id: 'archive',
        label: 'Arsip Tugas 1 Semester',
        icon: <Archive className="w-5 h-5 shrink-0" />,
      },
      {
        id: 'ai-tutor',
        label: 'Tutor Pintar AI',
        icon: <Bot className="w-5 h-5 shrink-0" />,
      },
    ];
  };

  const navItems = getNavItems();

  const roleBadgeText =
    currentRole === 'student'
      ? 'Siswa Mandiri'
      : currentRole === 'parent'
      ? 'Wali Murid'
      : 'Pengajar Bimbel';

  const roleBadgeColor =
    currentRole === 'student'
      ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      : currentRole === 'parent'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      : 'bg-amber-500/20 text-amber-300 border-amber-400/30';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-extrabold text-sm text-white tracking-tight leading-none truncate">
                    Cerdas Mandiri
                  </h1>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Portal E-Learning SD & SMP
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={sidebarCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Info Card */}
          <div className="p-3 border-b border-slate-800/60">
            <div
              className={`flex items-center gap-3 p-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 transition ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <img
                src={currentUser?.avatarUrl || currentStudent.avatarUrl}
                alt={currentUser?.name || currentStudent.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-white truncate">
                    {currentUser?.name || currentStudent.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleBadgeColor}`}
                    >
                      {roleBadgeText}
                    </span>
                    {currentRole === 'student' && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        NISN: {currentStudent.nisn}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Navigation Menu */}
          <nav className="p-3 space-y-1">
            <p
              className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 ${
                sidebarCollapsed ? 'text-center' : ''
              }`}
            >
              {!sidebarCollapsed ? 'Menu Utama' : '•••'}
            </p>

            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer group ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                        active ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Module Shortcuts for Students (Strictly Separated SD vs SMP) */}
          {!sidebarCollapsed && (
            <div className="px-3 py-2 border-t border-slate-800/60">
              {currentRole === 'student' ? (
                // For student: strictly show ONLY their registered jenjang
                <>
                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      {currentStudent.gradeLevel === 'SMP' ? '🏫 Modul SMP' : '🎒 Modul SD'}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                      {currentStudent.gradeLevel} Khusus
                    </span>
                  </div>
                  <div className="space-y-1 mt-1 max-h-48 overflow-y-auto pr-1">
                    {modules
                      .filter((m) => m.gradeLevel === currentStudent.gradeLevel)
                      .map((m) => {
                        const isActiveMod = activeModuleId === m.id && currentTab === 'main';
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              setActiveModuleId(m.id);
                              handleNavClick('main');
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center justify-between ${
                              isActiveMod
                                ? currentStudent.gradeLevel === 'SMP'
                                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                  : 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate">
                              M{m.moduleNumber}: {m.subject}
                            </span>
                            <span className="text-[9px] opacity-75 shrink-0 ml-1 font-mono">
                              {m.estimatedMinutes}m
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </>
              ) : (
                // For Teacher & Parent: clear separate groups
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between px-3 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                      <span>🏫 Modul SMP</span>
                      <span>5 Modul</span>
                    </div>
                    <div className="space-y-0.5 mt-1 max-h-24 overflow-y-auto pr-1">
                      {modules
                        .filter((m) => m.gradeLevel === 'SMP')
                        .map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setActiveModuleId(m.id);
                              handleNavClick('main');
                            }}
                            className={`w-full text-left px-2.5 py-1 rounded-md text-[10px] font-medium transition cursor-pointer flex items-center justify-between ${
                              activeModuleId === m.id && currentTab === 'main'
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            <span className="truncate">M{m.moduleNumber}: {m.subject}</span>
                            <span className="text-[9px] text-slate-500">SMP</span>
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/50">
                    <div className="flex items-center justify-between px-3 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                      <span>🎒 Modul SD</span>
                      <span>3 Modul</span>
                    </div>
                    <div className="space-y-0.5 mt-1 max-h-24 overflow-y-auto pr-1">
                      {modules
                        .filter((m) => m.gradeLevel === 'SD')
                        .map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setActiveModuleId(m.id);
                              handleNavClick('main');
                            }}
                            className={`w-full text-left px-2.5 py-1 rounded-md text-[10px] font-medium transition cursor-pointer flex items-center justify-between ${
                              activeModuleId === m.id && currentTab === 'main'
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            <span className="truncate">M{m.moduleNumber}: {m.subject}</span>
                            <span className="text-[9px] text-slate-500">SD</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section: Rule info & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Deadline reminder pill */}
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold leading-tight">Aturan Pengumpulan:</p>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  Maksimal H-1 sebelum pertemuan les berikutnya.
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            title={sidebarCollapsed ? 'Keluar / Ganti Akun' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition cursor-pointer ${
              sidebarCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Keluar / Ganti Akun</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
