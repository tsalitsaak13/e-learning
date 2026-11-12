import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Send,
  Copy,
  Check,
  CreditCard,
  Calendar,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { BIMBEL_INFO } from '../data/mockData';

export const ParentPortal: React.FC = () => {
  const {
    currentStudent,
    submissions,
    invoices,
    generateWhatsAppReport,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [targetPhone, setTargetPhone] = useState(currentStudent.parentPhone);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);

  const studentSubmissions = submissions.filter((s) => s.studentId === currentStudent.id);
  const studentInvoices = invoices.filter((i) => i.studentId === currentStudent.id);
  const unpaidInvoice = studentInvoices.find((i) => i.status !== 'Lunas');

  const avgScore =
    studentSubmissions.length > 0
      ? Math.round(
          studentSubmissions.reduce((acc, curr) => acc + curr.score, 0) /
            studentSubmissions.length
        )
      : 0;

  const { text: reportText, waUrl } = generateWhatsAppReport(currentStudent.id);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const phoneClean = targetPhone.replace(/\D/g, '').replace(/^0/, '62');
    const customUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(reportText)}`;
    window.open(customUrl, '_blank');
  };

  const needsRemedial = studentSubmissions.some((s) => s.score <= 50);

  return (
    <div className="space-y-6">
      {/* Header Parent Hero */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
              <Users className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-400/30">
                Portal Pemantauan Orang Tua / Wali
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Yth. {currentStudent.parentName}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Memantau Ananda: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.grade} - {currentStudent.school})
              </p>
            </div>
          </div>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div>
              <p className="text-[11px] text-emerald-200 font-medium">Kehadiran Les</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {currentStudent.attendanceRate}%
              </p>
              <p className="text-[10px] text-emerald-300">{currentStudent.attendedSessions} dari {currentStudent.totalSessions} sesi</p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-200 font-medium">Rata-rata Nilai</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5">
                {avgScore} <span className="text-xs text-white font-normal">/100</span>
              </p>
              <p className="text-[10px] text-emerald-300">{studentSubmissions.length} modul dievaluasi</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] text-emerald-200 font-medium">Status SPP</p>
              {unpaidInvoice ? (
                <span className="inline-block mt-1 px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-bold">
                  Belum Lunas
                </span>
              ) : (
                <span className="inline-block mt-1 px-2.5 py-1 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-bold">
                  Lunas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Contact Tutor Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Tutor Pendamping: <strong>{BIMBEL_INFO.tutorName}</strong> ({currentStudent.program})
            </span>
          </div>
          <a
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Kak Sarah, saya ${currentStudent.parentName} wali dari ${currentStudent.name}. Saya ingin menanyakan mengenai progres belajar anak saya.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl transition shadow-xs text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat WhatsApp dengan Kak Sarah
          </a>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: WhatsApp Weekly Report Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Notifikasi & Laporan Mingguan
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Laporan Progres Belajar via WhatsApp
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan otomatis terformat siap kirim ke WhatsApp Ayah/Bunda untuk memantau kemajuan ananda secara berkala.
                </p>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap pl-2">
                Nomor WhatsApp Tujuan:
              </span>
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full bg-white px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Formatted Message Preview Box (WhatsApp Style) */}
            <div className="rounded-2xl border border-emerald-300/60 bg-[#efeae2] p-4 relative overflow-hidden shadow-inner">
              <div className="bg-[#075e54] text-white px-4 py-2 rounded-t-xl -m-4 mb-3 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Bimbel Cerdas Mandiri Official Report</span>
                </div>
                <span className="text-[10px] text-emerald-200">Enkripsi End-to-End</span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-xs text-xs text-slate-800 space-y-2 whitespace-pre-line font-sans border border-slate-200 max-h-96 overflow-y-auto leading-relaxed">
                {reportText}
              </div>
            </div>

            {/* Action Buttons for WhatsApp */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Buka & Kirim via WhatsApp
              </button>
              <button
                onClick={handleCopyReport}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition border border-slate-200 flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Remedial 15-Minute Alert if needed */}
          {needsRemedial && (
            <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Pemberitahuan Pendampingan Khusus (Skor ≤ 50)</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                Berdasarkan evaluasi modul terakhir, pemahaman materi ananda membutuhkan penguatan.
                Sesuai rubrik Bimbel Cerdas Mandiri, Kak Sarah telah menyiapkan <strong>sesi review privat gratis 15 menit</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Status Sesi Review:</span>
                  <p className="text-emerald-700 font-medium">Jumat, 16.30 WIB (Google Meet / Tatap Muka)</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-bold text-[11px]">
                  Terjadwal
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Progress & Tuition Payment Center (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tuition Payment Center (Pembayaran Biaya Les) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Administrasi Les
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Pembayaran Biaya Les
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Kelola pembayaran SPP bulanan dengan aman via QRIS, Virtual Account BCA/Mandiri, atau E-wallet.
            </p>

            {/* Invoices List */}
            <div className="space-y-3">
              {studentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    inv.status === 'Lunas'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500">{inv.invoiceNumber}</span>
                      <h4 className="font-bold text-xs text-slate-900 mt-0.5">{inv.period}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{inv.description}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        inv.status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Total Biaya:</span>
                      <p className="font-bold text-sm text-slate-900">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {inv.status === 'Lunas' ? (
                      <button
                        onClick={() => setSelectedInvoiceForReceipt(inv)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Kuitansi
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedInvoiceForPay(inv)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        Bayar Sekarang
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Scorecard Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Rekap Hasil Kuis Ananda
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {studentSubmissions.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Belum ada hasil kuis yang dikumpulkan.
                </div>
              ) : (
                studentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 truncate max-w-[200px]">
                        {sub.moduleTitle}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.score === 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.score >= 67
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sub.score}/100 • {sub.rubricCategory}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {sub.tutorFeedback || sub.rubricNote}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      Dikumpulkan: {sub.submittedAt}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInvoiceForPay && (
        <PaymentModal
          invoice={selectedInvoiceForPay}
          onClose={() => setSelectedInvoiceForPay(null)}
          onSuccess={(paidInv) => {
            setSelectedInvoiceForPay(null);
            setSelectedInvoiceForReceipt(paidInv);
          }}
        />
      )}

      {/* Receipt Modal */}
      {selectedInvoiceForReceipt && (
        <ReceiptModal
          invoice={selectedInvoiceForReceipt}
          onClose={() => setSelectedInvoiceForReceipt(null)}
        />
      )}
    </div>
  );
};
