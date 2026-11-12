import React, { useState } from 'react';
import {
  Archive,
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizSubmission } from '../types';

export const TaskArchiveView: React.FC = () => {
  const { submissions, modules, currentStudent, currentRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Semua');
  const [rubricFilter, setRubricFilter] = useState('Semua');
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);

  const [jenjangFilter, setJenjangFilter] = useState<'Semua' | 'SMP' | 'SD'>(() => {
    return currentRole === 'student' ? currentStudent.gradeLevel : 'Semua';
  });

  // If student role, show currentStudent's submissions. If teacher, show all or filtered.
  const baseSubmissions =
    currentRole === 'teacher'
      ? submissions
      : submissions.filter((s) => s.studentId === currentStudent.id);

  const filteredSubmissions = baseSubmissions.filter((sub) => {
    const mod = modules.find((m) => m.id === sub.moduleId);
    const matchesJenjang =
      jenjangFilter === 'Semua' || (mod && mod.gradeLevel === jenjangFilter);
    const matchesSubject = subjectFilter === 'Semua' || (mod && mod.subject === subjectFilter);
    const matchesRubric = rubricFilter === 'Semua' || sub.rubricCategory === rubricFilter;
    const matchesSearch =
      sub.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesJenjang && matchesSubject && matchesRubric && matchesSearch;
  });

  const selectedModule = selectedSubmission
    ? modules.find((m) => m.id === selectedSubmission.moduleId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Penyimpanan Portofolio Akademik
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <Archive className="w-6 h-6 text-indigo-600" />
              Arsip Tugas & Hasil Pengerjaan Siswa (1 Semester)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menyimpan seluruh rekam jejak lembar jawaban, nilai, dan umpan balik pengajar selama semester ganjil/genap.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-700 border border-slate-200">
              Total Arsip: {filteredSubmissions.length} Tugas
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Jenjang Filter: SMP vs SD */}
            <select
              value={jenjangFilter}
              onChange={(e) => setJenjangFilter(e.target.value as any)}
              className="p-2 rounded-xl border border-slate-200 bg-indigo-50/60 font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Jenjang (SD & SMP)</option>
              <option value="SMP">🏫 Khusus Jenjang SMP</option>
              <option value="SD">🎒 Khusus Jenjang SD</option>
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="IPA">IPA</option>
              <option value="IPAS">IPAS SD</option>
            </select>

            {/* Rubric Category */}
            <select
              value={rubricFilter}
              onChange={(e) => setRubricFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Kategori Nilai</option>
              <option value="Sangat Baik">Sangat Baik (100)</option>
              <option value="Cukup Baik">Cukup Baik (67-75)</option>
              <option value="Perlu Bimbingan">Perlu Bimbingan (≤ 50)</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tugas / nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Archived Submissions */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <Archive className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">Tidak ada arsip tugas yang cocok</h4>
          <p className="text-xs text-slate-400">Silakan sesuaikan filter pencarian atau kerjakan modul kuis terlebih dahulu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub) => {
            const mod = modules.find((m) => m.id === sub.moduleId);

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {mod?.subject || 'Modul'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        sub.score === 100
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : sub.score >= 67
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      Skor {sub.score} • {sub.rubricCategory}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition line-clamp-2">
                    {sub.moduleTitle}
                  </h3>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>Siswa: <strong className="text-slate-700">{sub.studentName}</strong></span>
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 leading-relaxed border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[10px] uppercase tracking-wide">
                      Umpan Balik Tutor:
                    </span>
                    {sub.tutorFeedback || sub.rubricNote}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sub.submittedAt}
                  </span>
                  <span className="text-indigo-600 font-bold group-hover:underline flex items-center gap-1">
                    Buka Lembar Jawaban
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  Lembar Evaluasi Tugas Terarsip
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSubmission.moduleTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa: <strong>{selectedSubmission.studentName}</strong> • Diserahkan: {selectedSubmission.submittedAt}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-extrabold px-3 py-1 rounded-xl border ${
                    selectedSubmission.score === 100
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : selectedSubmission.score >= 67
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}
                >
                  Nilai: {selectedSubmission.score} / 100
                </span>
                <p className="text-[11px] font-bold text-slate-600 mt-1">
                  {selectedSubmission.rubricCategory}
                </p>
              </div>
            </div>

            {/* Rubric Evaluation Note */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Catatan Evaluasi Rubrik:</span>
              <p className="text-slate-700">{selectedSubmission.rubricNote}</p>
              {selectedSubmission.tutorFeedback && (
                <p className="text-indigo-800 font-medium pt-1 border-t border-slate-200/60 mt-1">
                  Komentar Tambahan Tutor: "{selectedSubmission.tutorFeedback}"
                </p>
              )}
            </div>

            {/* Question by question answers */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Rincian Lembar Jawaban Siswa:
              </h4>

              {selectedModule?.questions.map((q, idx) => {
                const answer = selectedSubmission.answers[q.id];
                const isCorrect =
                  (answer || '').trim().toLowerCase() ===
                  q.correctAnswer.trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">
                        {idx + 1}. {q.question}
                      </p>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-700 shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Benar ({q.points} Poin)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-bold text-rose-700 shrink-0">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Kurang Tepat (0 Poin)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-400 block font-medium">Jawaban Siswa:</span>
                        <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {answer || '(Tidak dijawab)'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-400 block font-medium">Kunci Pembahasan:</span>
                        <span className="font-semibold text-slate-800">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded border border-slate-200">
                      <strong>Penjelasan:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Modal actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Arsip Tersimpan Aman di Database Bimbel Cerdas Mandiri
              </span>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Tutup Arsip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
