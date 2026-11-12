import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  Bell,
  Sparkles,
  BookOpen,
  Calendar,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  Menu,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    currentStudentId,
    setCurrentStudentId,
    students,
    unreadNotifCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetAllData,
    setSidebarOpen,
    logout,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const activeStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const roleLabels: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      title: 'Portal Siswa',
      subtitle: activeStudent.name.split(' ')[0],
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      role: 'parent',
      title: 'Portal Orang Tua',
      subtitle: `Wali ${activeStudent.name.split(' ')[0]}`,
      icon: <Users className="w-4 h-4" />,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      role: 'teacher',
      title: 'Dasbor Pengajar',
      subtitle: 'Kak Sarah, S.Pd.',
      icon: <UserCheck className="w-4 h-4" />,
      color: 'from-amber-600 to-orange-600',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Program & Rule quick-strip */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Aturan Pengumpulan: Maksimal H-1
          </span>
          <span className="hidden md:inline text-slate-300">
            Kelompok Kecil (Maks. 5 Siswa/Kelas) & Privat 1-on-1 • Jenjang SD & SMP
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="hidden sm:inline">📞 WA Hotline: 0812-3456-7890</span>
          <button
            onClick={() => {
              if (confirm('Reset seluruh data kuis, tagihan, dan notifikasi ke kondisi awal?')) {
                resetAllData();
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset data demo"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            title="Buka Navigasi Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-none">
                  Bimbel Cerdas Mandiri
                </h1>
                <span className="bg-indigo-50 text-indigo-700 font-bold text-[9px] px-1.5 py-0.5 rounded border border-indigo-200">
                  SD & SMP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                Portal E-Learning, Pemantauan Nilai & Administrasi
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: Role Switcher & Student Selector */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Active Student Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowStudentPicker(!showStudentPicker)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
              title="Ganti Siswa yang Dipantau"
            >
              <img
                src={activeStudent.avatarUrl}
                alt={activeStudent.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-300"
              />
              <span className="max-w-[100px] sm:max-w-[140px] truncate">{activeStudent.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showStudentPicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Pilih Profil Siswa
                </div>
                {students.map((std) => (
                  <button
                    key={std.id}
                    onClick={() => {
                      setCurrentStudentId(std.id);
                      setShowStudentPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-indigo-50/70 transition cursor-pointer ${
                      std.id === currentStudentId ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={std.avatarUrl}
                        alt={std.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <p className="leading-tight">{std.name}</p>
                        <p className="text-[10px] text-slate-400">{std.grade} • {std.program}</p>
                      </div>
                    </div>
                    {std.id === currentStudentId && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher Tabs */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {roleLabels.map((r) => {
              const active = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentRole(r.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                    {r.icon}
                  </span>
                  <span>{r.title}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Role Switcher */}
          <div className="sm:hidden flex bg-slate-100 p-1 rounded-lg">
            {roleLabels.map((r) => {
              const active = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentRole(r.role)}
                  className={`p-2 rounded-md text-xs cursor-pointer ${
                    active ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title={r.title}
                >
                  {r.icon}
                </button>
              );
            })}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Notifikasi Otomatis"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Notifikasi Otomatis</h3>
                    <p className="text-[11px] text-slate-400">Pemberitahuan untuk {roleLabels.find(r => r.role === currentRole)?.title}</p>
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.filter(n => n.targetRoles.includes(currentRole)).length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Tidak ada notifikasi saat ini.
                    </div>
                  ) : (
                    notifications
                      .filter(n => n.targetRoles.includes(currentRole))
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'grade_alert' ? (
                              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            ) : n.type === 'remedial_schedule' ? (
                              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            ) : n.type === 'deadline_warning' ? (
                              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                              <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
            title="Keluar ke Halaman Login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ganti Akun</span>
          </button>
        </div>
      </div>
    </header>
  );
};
