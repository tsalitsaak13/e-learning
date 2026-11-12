import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, BookOpen, Lightbulb, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiTutorAssistant: React.FC = () => {
  const { modules, activeModuleId, currentStudent } = useApp();
  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<{
    id: string;
    sender: 'user' | 'tutor';
    text: string;
    timestamp: string;
  }[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Halo ${currentStudent.name}! 👋 Saya asisten Tutor Cerdas Mandiri. Kamu sedang mempelajari "${activeModule.title}". Ada konsep atau rumus yang ingin kamu tanyakan atau butuh cara mudah menghafalnya?`,
      timestamp: '10:00',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const smartAnswers: Record<string, string> = {
    'plsv': 'Pada PLSV (Persamaan Linear Satu Variabel), kuncinya adalah **Prinsip Keseimbangan**!\n\n1. Kumpulkan semua suku yang punya variabel x di ruas kiri.\n2. Pindahkan konstanta angka ke ruas kanan (tanda berubah: + jadi -, - jadi +).\n3. Bagi kedua ruas dengan angka di depan x (koefisien). Contoh: 3x - 5 = 16 -> 3x = 16 + 5 -> 3x = 21 -> x = 7.',
    'present': 'Aturan Simple Present Tense:\n• Untuk **I, You, They, We**: Kata kerja tetap Verb 1 tanpa akhiran apa pun, dan gunakan kata bantu **Do** untuk kalimat tanya/negatif.\n• Untuk **He, She, It**: Tambahkan akhiran **-s / -es** pada kata kerja (misal: drinks, goes), dan gunakan kata bantu **Does**!\n• Jika sudah ada kata **does / doesn\'t**, kata kerjanya kembali ke bentuk dasar tanpa -s.',
    'pencernaan': 'Alur Saluran Pencernaan Utama:\n1. **Mulut**: Ada enzim ptialin untuk memecah amilum.\n2. **Kerongkongan**: Gerak peristaltik mendorong bolus.\n3. **Lambung**: Asam HCl membunuh bakteri & enzim pepsin memecah protein jadi pepton.\n4. **Usus Halus**: Tempat penyerapan sari makanan secara maksimal (ada vili).\n5. **Usus Besar**: Menyerap kelebihan air & pembusukan sisa makanan.\n6. **Anus**: Pengeluaran feses.',
    'kalor': 'Rumus utama kalor adalah **Q = m × c × ΔT**\n• Q = Kalor (Joule)\n• m = Massa (kg)\n• c = Kalor jenis (J/kg°C)\n• ΔT = Kenaikan suhu (°C)\n\nTiga cara perpindahan:\n• **Konduksi**: Tanpa partikel berpindah (sendok panas).\n• **Konveksi**: Partikel fluida ikut berputar (air mendidih, angin laut).\n• **Radiasi**: Tanpa perantara (panas matahari, api unggun).',
    'ekosistem': 'Dalam rantai makanan:\n• **Produsen**: Tumbuhan hijau (membuat makanan sendiri lewat fotosintesis).\n• **Konsumen I**: Herbivora (pemakan tumbuhan: kelinci, zebra, belalang).\n• **Konsumen II / Puncak**: Karnivora pemangsa.\n• **Pengurai (Dekomposer)**: Jamur dan bakteri yang menguraikan bangkai menjadi zat hara untuk tanah.',
    'descriptive': 'Descriptive Text memiliki 2 struktur utama:\n1. **Identification**: Memperkenalkan siapa atau apa yang dibahas (di paragraf awal).\n2. **Description**: Menggambarkan ciri-ciri fisik, sifat khusus, atau karakteristik objek secara detail.\nBiasanya menggunakan Simple Present Tense dan kata sifat (Adjectives) seperti kind, diligent, soft, and tall!',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = 'Pertanyaan yang bagus! Kak Sarah sarankan kamu membaca kembali ringkasan materi dan mencoba contoh soal di modul. Ingat rumus dan prinsip dasar ya!';

      if (lower.includes('plsv') || lower.includes('variabel') || lower.includes('x') || lower.includes('ruas')) {
        reply = smartAnswers['plsv'];
      } else if (lower.includes('present') || lower.includes('tense') || lower.includes('does') || lower.includes('verb')) {
        reply = smartAnswers['present'];
      } else if (lower.includes('cerna') || lower.includes('lambung') || lower.includes('pepsin') || lower.includes('usus') || lower.includes('peristaltik')) {
        reply = smartAnswers['pencernaan'];
      } else if (lower.includes('kalor') || lower.includes('konduksi') || lower.includes('konveksi') || lower.includes('radiasi') || lower.includes('suhu')) {
        reply = smartAnswers['kalor'];
      } else if (lower.includes('ekosistem') || lower.includes('rantai') || lower.includes('produsen') || lower.includes('tikus') || lower.includes('ular')) {
        reply = smartAnswers['ekosistem'];
      } else if (lower.includes('descriptive') || lower.includes('sifat') || lower.includes('identification') || lower.includes('adjective')) {
        reply = smartAnswers['descriptive'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'tutor',
          text: reply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const quickPrompts = [
    'Jelaskan cara pindah ruas PLSV',
    'Kapan pakai Do dan Does?',
    'Fungsi enzim pepsin di lambung?',
    'Beda konduksi dan konveksi?',
    'Apa peran produsen di rantai makanan?',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Tutor Pintar Cerdas Mandiri
            </h3>
            <p className="text-xs text-slate-500">
              Asisten belajar mandiri untuk mendampingi pemahaman 6 modul kurikulum bimbel
            </p>
          </div>
        </div>

        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
          Siap Membantu 24/7
        </span>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pb-2">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => setInputQuestion(qp)}
            className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-3 py-1.5 rounded-xl transition border border-slate-200 cursor-pointer"
          >
            💡 {qp}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 font-bold'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs whitespace-pre-line'
              }`}
            >
              {m.text}
              <span
                className={`block text-[9px] mt-1 text-right ${
                  m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-9 italic">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Tutor Pintar sedang mengetik penjelasan...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Tanyakan rumus, cara hitung, atau konsep materi..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Kirim
        </button>
      </form>
    </div>
  );
};
