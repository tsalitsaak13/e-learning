import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  User,
  GraduationCap,
  Users,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_ACCOUNTS, BIMBEL_INFO } from '../data/mockData';
import { UserRole } from '../types';

export const AuthScreen: React.FC = () => {
  const { login, loginAsAccount, students } = useApp();
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('budi');
  const [password, setPassword] = useState('123');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Harap masukkan Username atau NISN.');
      return;
    }

    const res = login(identifier, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Login gagal. Periksa kembali NISN/Username.');
    }
  };

  const handleRoleTabClick = (role: UserRole) => {
    setSelectedRoleTab(role);
    setErrorMessage('');
    if (role === 'student') setIdentifier('budi');
    else if (role === 'parent') setIdentifier('wali_budi');
    else if (role === 'teacher') setIdentifier('guru');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background glow ornaments */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/20 mb-3">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Bimbel Cerdas Mandiri
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Portal E-Learning Terpadu untuk Siswa, Orang Tua, dan Pengajar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100 space-y-6">
          {/* Role Tabs */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Pilih Jenis Akun Anda
            </p>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleTabClick('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedRoleTab === 'student'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabClick('parent')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedRoleTab === 'parent'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Orang Tua</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabClick('teacher')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedRoleTab === 'teacher'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pengajar</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRoleTab === 'student'
                  ? 'Username Siswa atau Nomor Induk Siswa (NISN)'
                  : selectedRoleTab === 'parent'
                  ? 'Username Akun Wali Murid'
                  : 'Username / Email Pengajar'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRoleTab === 'student'
                      ? 'contoh: budi atau 20260701'
                      : selectedRoleTab === 'parent'
                      ? 'contoh: wali_budi'
                      : 'contoh: guru'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi (PIN)
                </label>
                <span className="text-[11px] text-slate-400">Default: 123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Masuk ke Portal E-Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Login Selection (Instant Demo) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Masuk Cepat 1-Klik (Setiap Siswa Memiliki Akun Terpisah)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => loginAsAccount(acc)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition flex items-center gap-2.5 cursor-pointer group"
                >
                  <img
                    src={acc.avatarUrl}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-600">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {acc.badge}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white px-2 py-0.5 rounded font-mono font-bold transition">
                    @{acc.username}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Academic Info note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              Tenggat Pengumpulan Modul: <strong>H-1 sebelum kelas</strong>
            </span>
            <span className="text-indigo-600 font-bold">SD & SMP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
