import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  FileText,
  RotateCcw,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LearningModule, Subject } from '../types';
import { calculateRubric } from '../data/mockData';

export const StudentPortal: React.FC = () => {
  const {
    currentStudent,
    modules,
    activeModuleId,
    setActiveModuleId,
    submissions,
    submitQuiz,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'study' | 'quiz' | 'archive'>('study');
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [selectedJenjang, setSelectedJenjang] = useState<'SMP' | 'SD'>(() => {
    return currentStudent.gradeLevel || 'SMP';
  });
  
  // Sync whenever student changes
  React.useEffect(() => {
    if (currentStudent.gradeLevel) {
      setSelectedJenjang(currentStudent.gradeLevel);
      setSelectedSubject('Semua');
    }
  }, [currentStudent.id, currentStudent.gradeLevel]);

  // Quiz state for active module
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<{
    score: number;
    rubric: ReturnType<typeof calculateRubric>;
  } | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Separation: SMP vs SD
  const smpModules = modules.filter((m) => m.gradeLevel === 'SMP');
  const sdModules = modules.filter((m) => m.gradeLevel === 'SD');
  const currentJenjangModules = selectedJenjang === 'SMP' ? smpModules : sdModules;

  // Ensure active module is from the selected jenjang
  React.useEffect(() => {
    const isModuleInCurrentJenjang = currentJenjangModules.some((m) => m.id === activeModuleId);
    if (!isModuleInCurrentJenjang && currentJenjangModules.length > 0) {
      setActiveModuleId(currentJenjangModules[0].id);
      setQuizSubmittedResult(null);
      setShowExplanation(false);
      setUserAnswers({});
    }
  }, [selectedJenjang, activeModuleId, currentJenjangModules]);

  const activeModule = modules.find((m) => m.id === activeModuleId) || currentJenjangModules[0] || modules[0];

  // Available subjects for the selected jenjang only
  const availableSubjects = [
    'Semua',
    ...Array.from(new Set(currentJenjangModules.map((m) => m.subject))),
  ];

  // Filter modules strictly within the selected jenjang
  const filteredModules = currentJenjangModules.filter((m) => {
    if (selectedSubject === 'Semua') return true;
    return m.subject === selectedSubject;
  });

  // Check if current student has a submission for activeModule
  const existingSubmission = submissions.find(
    (s) => s.studentId === currentStudent.id && s.moduleId === activeModule.id
  );

  const studentSubmissions = submissions.filter((s) => s.studentId === currentStudent.id);
  const completedModulesCount = studentSubmissions.length;
  const avgScore =
    studentSubmissions.length > 0
      ? Math.round(
          studentSubmissions.reduce((acc, curr) => acc + curr.score, 0) /
            studentSubmissions.length
        )
      : 0;

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const result = submitQuiz(activeModule.id, userAnswers, elapsedSeconds);
    setQuizSubmittedResult({
      score: result.score,
      rubric: result.rubric,
    });
    setShowExplanation(true);
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setQuizSubmittedResult(null);
    setShowExplanation(false);
  };

  const isMatchingStudentJenjang = currentStudent.gradeLevel === selectedJenjang;

  return (
    <div className="space-y-6">
      {/* Student Welcome & Program Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-400/30 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-300/30">
                  {currentStudent.program} • {currentStudent.grade}
                </span>
                <span className="bg-amber-400/30 text-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-300/30">
                  Jenjang {currentStudent.gradeLevel}
                </span>
                <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-400/30">
                  Kehadiran {currentStudent.attendanceRate}%
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Halo, {currentStudent.name}! 👋
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
                Jadwal: <strong className="text-white">{currentStudent.schedule}</strong> • {currentStudent.school}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div>
              <p className="text-[11px] text-indigo-200 font-medium">Modul Jenjang {currentStudent.gradeLevel}</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {completedModulesCount} <span className="text-xs text-indigo-300 font-normal">/ {currentJenjangModules.length}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-indigo-200 font-medium">Rata-rata Nilai</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5">
                {avgScore} <span className="text-xs text-indigo-200 font-normal">/100</span>
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] text-indigo-200 font-medium">Status Tugas</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Maks. H-1
              </span>
            </div>
          </div>
        </div>

        {/* Rule reminder bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-100">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Aturan Bimbel Cerdas Mandiri:</strong> Kerjakan tugas modul e-learning maksimal <strong>H-1</strong> sebelum pertemuan kelas berikutnya.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Skor ≤ 50 mendapat pendampingan review 15 menit gratis dengan Kak Sarah.</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Module Navigation List + Active Module View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Module List Picker (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
            {/* Dedicated Jenjang Segregation Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pemisahan Jenjang Pendidikan
                </span>
                {isMatchingStudentJenjang ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Sesuai Jenjang Anda ({currentStudent.gradeLevel})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    👁️ Pratinjau Jenjang {selectedJenjang}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJenjang('SMP');
                    setSelectedSubject('Semua');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedJenjang === 'SMP'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>🏫 Jenjang SMP</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedJenjang === 'SMP'
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {smpModules.length} Modul
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedJenjang('SD');
                    setSelectedSubject('Semua');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedJenjang === 'SD'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>🎒 Jenjang SD</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedJenjang === 'SD'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sdModules.length} Modul
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Modul {selectedJenjang === 'SMP' ? 'SMP (Kelas 7–9)' : 'SD (Kelas 5)'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {filteredModules.length} dari {currentJenjangModules.length}
              </span>
            </div>

            {/* Subject Filters (Dynamic according to selected Jenjang) */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
              {availableSubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    selectedSubject === sub
                      ? selectedJenjang === 'SMP'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Module cards list */}
            <div className="space-y-2 mt-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredModules.map((mod) => {
                const sub = submissions.find(
                  (s) => s.studentId === currentStudent.id && s.moduleId === mod.id
                );
                const isSelected = mod.id === activeModule.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      setActiveModuleId(mod.id);
                      setQuizSubmittedResult(null);
                      setShowExplanation(false);
                      setUserAnswers({});
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? selectedJenjang === 'SMP'
                          ? 'bg-indigo-50/90 border-indigo-500 shadow-xs ring-2 ring-indigo-500/30'
                          : 'bg-emerald-50/90 border-emerald-500 shadow-xs ring-2 ring-emerald-500/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        Modul {mod.moduleNumber} • {mod.subject}
                      </span>
                      {sub ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            sub.score === 100
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : sub.score >= 67
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          Nilai: {sub.score}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Belum Dikerjakan
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-2">
                      {mod.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mod.estimatedMinutes} menit
                      </span>
                      <span className="text-slate-500 text-[10px] font-medium">
                        {mod.targetAudience}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rubric Reference Widget */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Rubrik Penilaian Bimbel Cerdas Mandiri
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                <span className="font-bold text-emerald-300">Skor 100: Sangat Baik</span>
                <p className="text-[11px] text-slate-300">Lanjut ke modul berikutnya secara mandiri.</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
                <span className="font-bold text-amber-300">Skor 67 - 75: Cukup Baik</span>
                <p className="text-[11px] text-slate-300">Ulangi dan pelajari kembali soal yang belum tepat.</p>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30">
                <span className="font-bold text-rose-300">Skor ≤ 50: Perlu Bimbingan</span>
                <p className="text-[11px] text-slate-300">Jadwalkan review 15 menit privat bersama Kak Sarah.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Active Module Detail View (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Module Header Bar */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                    Modul {activeModule.moduleNumber}
                  </span>
                  <span className="bg-slate-200 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-lg">
                    {activeModule.subject}
                  </span>
                  <span className="bg-indigo-100 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded-lg">
                    Jenjang {activeModule.gradeLevel}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Est. {activeModule.estimatedMinutes} Menit</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-rose-600 font-semibold">Tenggat: {activeModule.deadlineDay}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 leading-snug">
                {activeModule.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sasaran: {activeModule.targetAudience}
              </p>

              {/* Learning Objectives */}
              <div className="mt-4 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                <p className="font-bold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                  Tujuan Pembelajaran:
                </p>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {activeModule.learningObjectives.map((obj, i) => (
                    <li key={i} className="leading-relaxed">{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Mode Tabs: Materi vs Kuis Interaktif */}
              <div className="flex border-b border-slate-200 mt-6 -mb-6">
                <button
                  onClick={() => setActiveTab('study')}
                  className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                    activeTab === 'study'
                      ? 'border-indigo-600 text-indigo-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Ringkasan Materi & Contoh Soal
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer relative ${
                    activeTab === 'quiz'
                      ? 'border-indigo-600 text-indigo-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Kuis Mandiri ({activeModule.questions.length} Soal)
                  {existingSubmission && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>
            </div>

            {/* TAB CONTENT: STUDY */}
            {activeTab === 'study' && (
              <div className="p-6 space-y-8">
                {/* Ringkasan Materi */}
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
                    B. Ringkasan Materi
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {activeModule.summary.map((section, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5"
                      >
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          {section.heading}
                        </h4>
                        <div className="space-y-1.5 pl-8">
                          {section.points.map((pt, pIdx) => (
                            <div key={pIdx} className="text-xs text-slate-700 leading-relaxed">
                              {pt.label ? (
                                <span>
                                  <strong className="text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold mr-1">
                                    {pt.label}:
                                  </strong>{' '}
                                  {pt.content}
                                </span>
                              ) : (
                                <span>{pt.content}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contoh Soal & Pembahasan */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-600 pl-3">
                    C. Contoh Soal & Pembahasan
                  </h3>

                  {activeModule.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          Soal Contoh
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {ex.problem}
                        </h4>
                      </div>

                      <div className="pl-3 border-l-2 border-emerald-400 space-y-1 text-xs text-slate-700">
                        <p className="font-semibold text-emerald-900">Langkah Pembahasan:</p>
                        {ex.steps.map((st, sIdx) => (
                          <p key={sIdx} className="font-mono bg-white/80 p-1.5 rounded border border-emerald-100">
                            {st}
                          </p>
                        ))}
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-emerald-950">
                          Solusi / Kesimpulan: {ex.solution}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to action to take Quiz */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                  <div>
                    <h4 className="font-bold text-base">Sudah Paham Materinya?</h4>
                    <p className="text-xs text-indigo-100 mt-0.5">
                      Uji pemahamanmu sekarang lewat Kuis Modul {activeModule.moduleNumber} ({activeModule.questions.length} soal).
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    Kerjakan Kuis Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: QUIZ */}
            {activeTab === 'quiz' && (
              <div className="p-6 space-y-6">
                {/* Previous submission status bar if any */}
                {existingSubmission && !quizSubmittedResult && (
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      existingSubmission.score === 100
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : existingSubmission.score >= 67
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-sm">
                          Hasil Terakhir: Skor {existingSubmission.score}/100 ({existingSubmission.rubricCategory})
                        </span>
                      </div>
                      <p className="text-xs">{existingSubmission.rubricNote}</p>
                      <p className="text-[11px] opacity-75">
                        Dikerjakan pada: {existingSubmission.submittedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRetakeQuiz}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Kerjakan Ulang
                      </button>
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        {showExplanation ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Score Alert & Rubric Celebration if just submitted */}
                {quizSubmittedResult && (
                  <div
                    className={`p-6 rounded-3xl border-2 text-center space-y-3 animate-in zoom-in-95 ${
                      quizSubmittedResult.score === 100
                        ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                        : quizSubmittedResult.score >= 67
                        ? 'bg-amber-50/90 border-amber-400 text-amber-950'
                        : 'bg-rose-50/90 border-rose-400 text-rose-950'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto">
                      {quizSubmittedResult.score === 100 ? (
                        <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
                      ) : quizSubmittedResult.score >= 67 ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Nilai Akhir Kuis
                      </span>
                      <h3 className="text-4xl font-extrabold mt-0.5">
                        {quizSubmittedResult.score} <span className="text-lg font-medium text-slate-500">/ 100</span>
                      </h3>
                      <p className="font-bold text-base mt-1">
                        Kategori: {quizSubmittedResult.rubric.category}
                      </p>
                      <p className="text-xs max-w-md mx-auto mt-1 leading-relaxed">
                        {quizSubmittedResult.rubric.note}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center gap-2">
                      <button
                        onClick={handleRetakeQuiz}
                        className="px-4 py-2 bg-white text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Coba Lagi
                      </button>
                      {quizSubmittedResult.score === 100 && (
                        <button
                          onClick={() => {
                            // Find next module
                            const currentIndex = modules.findIndex((m) => m.id === activeModule.id);
                            if (currentIndex < modules.length - 1) {
                              setActiveModuleId(modules[currentIndex + 1].id);
                              setActiveTab('study');
                              setQuizSubmittedResult(null);
                            }
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1.5"
                        >
                          Lanjut Modul Berikutnya
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* The Interactive Quiz Form */}
                <form onSubmit={handleSubmitQuiz} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      D. Latihan Mandiri (Kuis Modul {activeModule.moduleNumber})
                    </h3>
                    <span className="text-xs text-slate-400">
                      Total: {activeModule.questions.length} Pertanyaan
                    </span>
                  </div>

                  <div className="space-y-6">
                    {activeModule.questions.map((q, qIndex) => {
                      const selected = userAnswers[q.id];
                      const isSubmitted = !!quizSubmittedResult || showExplanation;
                      const isCorrect = selected === q.correctAnswer;

                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300/40'
                                : 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-300/40'
                              : 'bg-slate-50/60 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {qIndex + 1}
                              </span>
                              <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                                {q.question}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                              {q.points} Poin
                            </span>
                          </div>

                          {/* Options */}
                          {q.options && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                              {q.options.map((opt, optIdx) => {
                                const isOptionChosen = selected === opt;
                                const isThisCorrect = opt === q.correctAnswer;

                                let optionClass = 'border-slate-200 bg-white text-slate-700 hover:bg-indigo-50/50';

                                if (isSubmitted) {
                                  if (isThisCorrect) {
                                    optionClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                                  } else if (isOptionChosen && !isThisCorrect) {
                                    optionClass = 'border-rose-500 bg-rose-100 text-rose-950 line-through';
                                  } else {
                                    optionClass = 'border-slate-200 bg-white text-slate-400 opacity-60';
                                  }
                                } else if (isOptionChosen) {
                                  optionClass = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs';
                                }

                                return (
                                  <label
                                    key={optIdx}
                                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${optionClass}`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={selected === opt}
                                        onChange={() => handleAnswerSelect(q.id, opt)}
                                        disabled={isSubmitted}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <span>{opt}</span>
                                    </div>
                                    {isSubmitted && isThisCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                    {isSubmitted && isOptionChosen && !isThisCorrect && (
                                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {/* Explanation Box (Visible after submission or if toggled) */}
                          {isSubmitted && (
                            <div className="mt-4 pl-8 pt-3 border-t border-slate-200/60 text-xs">
                              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                                  Kunci Jawaban & Pembahasan:
                                </p>
                                <p className="text-emerald-700 font-semibold">
                                  Kunci: {q.correctAnswer}
                                </p>
                                <p className="text-slate-600 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  {!quizSubmittedResult && (
                    <div className="pt-4 flex items-center justify-between gap-4">
                      <p className="text-xs text-slate-500">
                        Sudah dijawab: {Object.keys(userAnswers).length} dari {activeModule.questions.length} soal
                      </p>
                      <button
                        type="submit"
                        disabled={Object.keys(userAnswers).length === 0}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Kirim Jawaban & Dapatkan Nilai
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
