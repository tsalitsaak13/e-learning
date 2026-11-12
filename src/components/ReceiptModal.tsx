import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download, BookOpen } from 'lucide-react';
import { Invoice } from '../types';
import { BIMBEL_INFO } from '../data/mockData';

interface ReceiptModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="print:hidden absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Paper */}
        <div className="border border-slate-300 p-6 rounded-2xl bg-white shadow-xs relative overflow-hidden">
          {/* Watermark LUNAS */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
            <span className="text-8xl font-black text-emerald-800 rotate-[-25deg]">
              LUNAS
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
                  {BIMBEL_INFO.name}
                </h3>
                <p className="text-[11px] text-slate-500">{BIMBEL_INFO.address}</p>
                <p className="text-[10px] text-slate-400">Telp/WA: {BIMBEL_INFO.contactPhone}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300">
                KUITANSI LUNAS
              </span>
              <p className="text-[11px] font-mono font-bold text-slate-600 mt-1">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-4 space-y-3 text-xs border-b border-slate-200">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500">Telah Terima Dari:</span>
              <span className="col-span-2 font-bold text-slate-900">{invoice.parentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500">Nama Siswa:</span>
              <span className="col-span-2 font-semibold text-slate-800">{invoice.studentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500">Untuk Pembayaran:</span>
              <span className="col-span-2 text-slate-700 leading-relaxed">{invoice.description}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500">Metode Pembayaran:</span>
              <span className="col-span-2 font-medium text-slate-800">
                {invoice.paymentMethod || 'QRIS Instan'} (Lunas)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500">Waktu Transaksi:</span>
              <span className="col-span-2 font-mono text-slate-600">
                {invoice.paidAt || '2026-11-12 10:00 WIB'}
              </span>
            </div>
          </div>

          {/* Nominal box */}
          <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-700 text-xs">Jumlah Terbayar:</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-900 font-mono">
              Rp {invoice.amount.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Signature and Digital Stamp */}
          <div className="pt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sah & Terverifikasi Sistem Bimbel Cerdas Mandiri</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400">Koordinator Administrasi,</p>
              <div className="my-1 py-1 text-indigo-700 font-serif font-bold text-sm tracking-wider italic">
                Sarah Amalia
              </div>
              <p className="font-bold text-slate-800 text-[11px]">{BIMBEL_INFO.tutorName}</p>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="print:hidden mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </div>
  );
};
