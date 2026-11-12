import React, { useState } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Video,
  FileText,
  UserCheck,
  TrendingUp,
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentProfile, QuizSubmission } from '../types';
import { BIMBEL_INFO } from '../data/mockData';

export const TeacherDashboard: React.FC = () => {
  const {
    students,
    submissions,
    modules,
    scheduleRemedial,
    addNotification,
    generateWhatsAppReport,
  } = useApp();

  const [selectedProgramFilter, setSelectedProgramFilter] = useState<'All' | 'Reguler' | 'Intensif'>('All');
  const [selectedJenjangFilter, setSelectedJenjangFilter] = useState<'All' | 'SMP' | 'SD'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Remedial modal state
  const [selectedSubForRemedial, setSelectedSubForRemedial] = useState<QuizSubmission | null>(null);
  const [remedialDate, setRemedialDate] = useState('2026-11-14 16:30 WIB');
  const [remedialMethod, setRemedialMethod] = useState<'Google Meet' | 'Tatap Muka di Bimbel'>('Google Meet');

  // Broadcast state
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Metrics
  const totalStudents = students.length;
  const regularStudentsCount = students.filter((s) => s.program === 'Reguler').length;
  const intensiveStudentsCount = students.filter((s) => s.program === 'Intensif').length;
  
  const allScores = submissions.map((s) => s.score);
  const avgClassScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  
  // Struggling submissions (score <= 50) needing 15-minute review
  const strugglingSubmissions = submissions.filter((s) => s.score <= 50);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesProgram = selectedProgramFilter === 'All' || s.program === selectedProgramFilter;
    const matchesJenjang = selectedJenjangFilter === 'All' || s.gradeLevel === selectedJenjangFilter;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.school.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesJenjang && matchesQuery;
  });

  const handleConfirmRemedial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForRemedial) return;

    const timeString = `${remedialDate} (${remedialMethod})`;
    scheduleRemedial(selectedSubForRemedial.id, timeString);
    setSelectedSubForRemedial(null);
  };

  const handleSendH1ReminderBroadcast = () => {
    setBroadcastSent(true);
    addNotification({
      title: 'Pengingat Deadline Tugas (H-1) Dikirim!',
      message: 'Kak Sarah mengirimkan notifikasi pengingat pengumpulan modul e-learning maksimal H-1 ke seluruh siswa & orang tua.',
      type: 'deadline_warning',
      targetRoles: ['student', 'parent', 'teacher'],
    });
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-400/30">
                Dasbor Pengajar & Tutor Akademik
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {BIMBEL_INFO.tutorName}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                {BIMBEL_INFO.tutorRole} • Memantau Keterlibatan Siswa Real-Time
              </p>
            </div>
          </div>

          {/* Broadcast reminder action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleSendH1ReminderBroadcast}
              disabled={broadcastSent}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {broadcastSent ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  Broadcast H-1 Terkirim!
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Kirim Pengingat Tugas H-1
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time stats row */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-400 font-medium">Total Siswa Binaan</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{totalStudents}</p>
            <p className="text-[10px] text-slate-400">
              {regularStudentsCount} Reguler (Maks 5) • {intensiveStudentsCount} Privat 1-on-1
            </p>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-400 font-medium">Rata-rata Nilai Kelas</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5">{avgClassScore} / 100</p>
            <p className="text-[10px] text-slate-400">Dari {submissions.length} kuis terkumpul</p>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-400 font-medium">Kepatuhan Deadline H-1</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-0.5">94%</p>
            <p className="text-[10px] text-slate-400">Pengumpulan sebelum sesi kelas</p>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-400 font-medium">Perlu Review 15 Menit</p>
            <p className="text-xl sm:text-2xl font-bold text-rose-400 mt-0.5">
              {strugglingSubmissions.length} <span className="text-xs font-normal text-slate-400">siswa</span>
            </p>
            <p className="text-[10px] text-slate-400">Skor ≤ 50 butuh pendampingan</p>
          </div>
        </div>
      </div>

      {/* Alert Radar: Siswa Perlu Bimbingan (Skor <= 50) */}
      {strugglingSubmissions.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-rose-950">
                  Radar Siswa Perlu Bimbingan Tambahan (Skor ≤ 50)
                </h3>
                <p className="text-xs text-rose-700">
                  Sesuai rubrik Bimbel Cerdas Mandiri, jadwalkan review privat 15 menit bersama siswa berikut:
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-200/80 text-rose-900 px-3 py-1 rounded-full w-fit">
              {strugglingSubmissions.length} Kasus Membutuhkan Penanganan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {strugglingSubmissions.map((sub) => {
              const student = students.find((s) => s.id === sub.studentId);

              return (
                <div
                  key={sub.id}
                  className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={student?.avatarUrl}
                          alt={sub.studentName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{sub.studentName}</h4>
                          <p className="text-[10px] text-slate-400">{student?.grade} • {student?.program}</p>
                        </div>
                      </div>
                      <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                        Skor: {sub.score}/100
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mt-2">
                      Modul: {sub.moduleTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Catatan Rubrik: {sub.rubricNote}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {sub.remedialScheduled && sub.remedialTime ? (
                      <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terjadwal: {sub.remedialTime}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold text-[11px] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Belum Dijadwalkan
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedSubForRemedial(sub)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      {sub.remedialScheduled ? 'Ubah Jadwal' : 'Jadwalkan 15 Menit'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Student Roster & Live Engagement Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Manajemen Kelas
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Keterlibatan Siswa & Pengumpulan Modul (Real-Time)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau kepatuhan tenggat H-1, kehadiran, serta kirim laporan WhatsApp orang tua dalam satu klik.
            </p>
          </div>

          {/* Jenjang & Program Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Jenjang: SMP vs SD */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {(['All', 'SMP', 'SD'] as const).map((jenjang) => (
                <button
                  key={jenjang}
                  onClick={() => setSelectedJenjangFilter(jenjang)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    selectedJenjangFilter === jenjang
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {jenjang === 'All' ? 'Semua Jenjang' : jenjang === 'SMP' ? '🏫 SMP' : '🎒 SD'}
                </button>
              ))}
            </div>

            {/* Program: Reguler vs Intensif */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {(['All', 'Reguler', 'Intensif'] as const).map((prog) => (
                <button
                  key={prog}
                  onClick={() => setSelectedProgramFilter(prog)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    selectedProgramFilter === prog
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {prog === 'All' ? 'Semua Paket' : prog}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Siswa</th>
                <th className="pb-3">Paket & Jadwal</th>
                <th className="pb-3">Kehadiran</th>
                <th className="pb-3">Modul Selesai</th>
                <th className="pb-3">Rata-rata</th>
                <th className="pb-3">Status Kuis Terakhir</th>
                <th className="pb-3 text-right pr-2">Aksi Pengajar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => {
                const stdSubs = submissions.filter((s) => s.studentId === std.id);
                const stdAvg =
                  stdSubs.length > 0
                    ? Math.round(stdSubs.reduce((a, b) => a + b.score, 0) / stdSubs.length)
                    : 0;
                const lastSub = stdSubs[0];

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatarUrl}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{std.name}</p>
                          <p className="text-[10px] text-slate-400">{std.grade} • {std.school}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          std.program === 'Reguler'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {std.program} (Maks {std.program === 'Reguler' ? '5 Siswa' : '1 Siswa'})
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{std.schedule}</p>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{std.attendanceRate}%</span>
                        <span className="text-[10px] text-slate-400">({std.attendedSessions}/{std.totalSessions})</span>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-slate-900">{stdSubs.length}</span>
                      <span className="text-slate-400"> / {modules.length}</span>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-amber-600 font-mono text-sm">
                        {stdAvg > 0 ? stdAvg : '-'}
                      </span>
                    </td>

                    <td className="py-3.5">
                      {lastSub ? (
                        <div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              lastSub.score === 100
                                ? 'bg-emerald-100 text-emerald-800'
                                : lastSub.score >= 67
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Skor {lastSub.score} • {lastSub.rubricCategory}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                            {lastSub.moduleTitle}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Belum ada submission</span>
                      )}
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => {
                          const { waUrl } = generateWhatsAppReport(std.id);
                          window.open(waUrl, '_blank');
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                        title="Kirim Laporan WA ke Orang Tua"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        Kirim Laporan WA
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remedial Scheduling Modal */}
      {selectedSubForRemedial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sesi Khusus Review Privat 15 Menit
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Atur Jadwal Bimbingan
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa: <strong>{selectedSubForRemedial.studentName}</strong> • {selectedSubForRemedial.moduleTitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmRemedial} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Waktu Pertemuan (15 Menit):</label>
                <input
                  type="text"
                  value={remedialDate}
                  onChange={(e) => setRemedialDate(e.target.value)}
                  placeholder="Contoh: Jumat, 16.30 - 16.45 WIB"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Metode Pertemuan:</label>
                <select
                  value={remedialMethod}
                  onChange={(e) => setRemedialMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Google Meet">Google Meet (Online Video Call)</option>
                  <option value="Tatap Muka di Bimbel">Tatap Muka di Bimbel Cerdas Mandiri</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">Info Konfirmasi Otomatis:</p>
                <p className="leading-relaxed">
                  Setelah disimpan, notifikasi langsung diteruskan ke dasbor Siswa & Orang Tua.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubForRemedial(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Simpan & Terbitkan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
