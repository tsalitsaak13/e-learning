import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Invoice } from '../types';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: (invoice: Invoice) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  onClose,
  onSuccess,
}) => {
  const { payInvoice } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'QRIS' | 'BCA Virtual Account' | 'Mandiri VA' | 'GoPay' | 'ShopeePay'>('QRIS');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const vaNumber = '88019' + invoice.studentId.replace(/\D/g, '').padStart(3, '0') + '482910';

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payInvoice(invoice.id, selectedMethod);
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess({
          ...invoice,
          status: 'Lunas',
          paymentMethod: selectedMethod,
        });
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pembayaran Berhasil Diterima!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Terima kasih! Kuitansi digital resmi Bimbel Cerdas Mandiri telah diterbitkan secara otomatis.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                Administrasi Pembayaran Les
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {invoice.description}
              </h3>
              <p className="text-xs text-slate-500">
                Siswa: <strong className="text-slate-800">{invoice.studentName}</strong> • No. Invoice: {invoice.invoiceNumber}
              </p>
            </div>

            {/* Total Amount Tag */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Tagihan SPP</p>
                <p className="text-2xl font-black text-indigo-900">
                  Rp {invoice.amount.toLocaleString('id-ID')}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Jatuh Tempo: {invoice.dueDate}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Pilih Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'QRIS', label: 'QRIS Instan', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'BCA Virtual Account', label: 'BCA VA', icon: <Building2 className="w-4 h-4" /> },
                  { id: 'GoPay', label: 'GoPay / OVO', icon: <Wallet className="w-4 h-4" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      selectedMethod === m.id
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className={selectedMethod === m.id ? 'text-indigo-600' : 'text-slate-400'}>
                      {m.icon}
                    </span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Method Content */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              {selectedMethod === 'QRIS' && (
                <div className="text-center space-y-3">
                  <p className="text-xs text-slate-600">
                    Pindai kode QRIS menggunakan GoPay, OVO, Dana, BCA, atau aplikasi m-Banking apa pun:
                  </p>
                  <div className="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-slate-800 mx-auto shadow-xs flex flex-col items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIMBEL-CERDAS-MANDIRI-${invoice.invoiceNumber}`}
                      alt="QRIS Code"
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    NMID: ID102026BIMBELCERDAS01 • Verifikasi Otomatis
                  </p>
                </div>
              )}

              {selectedMethod.includes('Virtual Account') && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-600 font-medium">Nomor Virtual Account:</p>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900">
                    <span>{vaNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyVA}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-sans"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Nama Akun: <strong>BIMBEL CERDAS - {invoice.studentName}</strong>
                  </p>
                </div>
              )}

              {selectedMethod === 'GoPay' && (
                <div className="space-y-2 text-xs text-slate-600 text-center py-2">
                  <p>Notifikasi pembayaran akan langsung dikirimkan ke aplikasi GoPay/OVO nomor wali murid:</p>
                  <p className="font-mono font-bold text-slate-900 text-sm">0812-9876-5432</p>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transaksi aman terenkripsi & tercatat dalam pembukuan Bimbel Cerdas Mandiri.</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Memverifikasi...' : 'Simulasikan Pembayaran Berhasil'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
