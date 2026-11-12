import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  LearningModule,
  StudentProfile,
  QuizSubmission,
  Invoice,
  NotificationItem,
  UserAccount,
} from '../types';
import {
  LEARNING_MODULES,
  INITIAL_STUDENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  DEMO_ACCOUNTS,
  calculateRubric,
} from '../data/mockData';

interface AppContextType {
  currentUser: UserAccount | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: StudentProfile;
  students: StudentProfile[];
  modules: LearningModule[];
  submissions: QuizSubmission[];
  invoices: Invoice[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  // Auth methods
  login: (identifier: string, password?: string) => { success: boolean; error?: string };
  loginAsAccount: (account: UserAccount) => void;
  logout: () => void;
  // Actions
  submitQuiz: (moduleId: string, answers: Record<string, string>, timeSpentSeconds: number) => {
    score: number;
    rubric: ReturnType<typeof calculateRubric>;
    submission: QuizSubmission;
  };
  scheduleRemedial: (submissionId: string, time: string) => void;
  payInvoice: (invoiceId: string, method: NonNullable<Invoice['paymentMethod']>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  generateWhatsAppReport: (studentId: string) => { text: string; waUrl: string };
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SUBMISSIONS: 'bimbel_cerdas_submissions_v3',
  INVOICES: 'bimbel_cerdas_invoices_v3',
  NOTIFICATIONS: 'bimbel_cerdas_notifs_v3',
  STUDENT_ID: 'bimbel_cerdas_std_id_v3',
  ROLE: 'bimbel_cerdas_role_v3',
  AUTH_USER: 'bimbel_cerdas_auth_user_v3',
  SIDEBAR_COLLAPSED: 'bimbel_cerdas_sidebar_collapsed_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [modules] = useState<LearningModule[]>(LEARNING_MODULES);

  // Auth User state: defaults to Budi's account
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default to Budi Santoso
    return DEMO_ACCOUNTS[0];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || currentUser?.role || 'student';
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
    return saved || currentUser?.studentId || 'std-1';
  });

  const [activeModuleId, setActiveModuleId] = useState<string>('mod-1');
  const [activeTab, setActiveTab] = useState<string>('main');

  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true';
  });

  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const unreadNotifCount = notifications.filter(
    (n) => !n.read && n.targetRoles.includes(currentRole)
  ).length;

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Login handler
  const login = (identifier: string, password = '123') => {
    const trimmed = identifier.trim().toLowerCase();

    // Check student accounts by username, NISN, or name
    const foundStudent = students.find(
      (s) =>
        s.username.toLowerCase() === trimmed ||
        s.nisn.toLowerCase() === trimmed ||
        s.name.toLowerCase() === trimmed
    );

    if (foundStudent) {
      const account: UserAccount = {
        id: `acc-${foundStudent.id}`,
        username: foundStudent.username,
        name: foundStudent.name,
        role: 'student',
        studentId: foundStudent.id,
        nisn: foundStudent.nisn,
        email: `${foundStudent.username}@siswa.cerdasmandiri.id`,
        avatarUrl: foundStudent.avatarUrl,
      };
      setCurrentUser(account);
      setCurrentRole('student');
      setCurrentStudentId(foundStudent.id);
      return { success: true };
    }

    // Check demo accounts (Teacher or Parent)
    const foundDemo = DEMO_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === trimmed ||
        acc.email.toLowerCase() === trimmed ||
        acc.name.toLowerCase() === trimmed
    );

    if (foundDemo) {
      setCurrentUser(foundDemo);
      setCurrentRole(foundDemo.role);
      if (foundDemo.studentId) {
        setCurrentStudentId(foundDemo.studentId);
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Username / NISN tidak ditemukan. Gunakan budi, siti, kevin, wali_budi, atau guru.',
    };
  };

  const loginAsAccount = (account: UserAccount) => {
    setCurrentUser(account);
    setCurrentRole(account.role);
    if (account.studentId) {
      setCurrentStudentId(account.studentId);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.targetRoles.includes(currentRole) ? { ...n, read: true } : n
      )
    );
  };

  const submitQuiz = (
    moduleId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) throw new Error('Module not found');

    let totalPoints = 0;
    let earnedPoints = 0;

    mod.questions.forEach((q) => {
      totalPoints += q.points;
      const studentAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();

      if (studentAns === correctAns || (correctAns.includes(studentAns) && studentAns.length > 2)) {
        earnedPoints += q.points;
      }
    });

    const rawScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    let score = rawScore;
    if (score >= 95) score = 100;
    else if (score >= 60 && score <= 75) score = 67;
    else if (score < 40 && score > 0) score = 33;

    const rubric = calculateRubric(score);

    if (score === 100) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        console.error(e);
      }
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSubmission: QuizSubmission = {
      id: `sub-${Date.now()}`,
      moduleId,
      moduleTitle: mod.title,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      submittedAt: formattedDate,
      answers,
      score,
      rubricCategory: rubric.category,
      rubricNote: rubric.note,
      tutorFeedback:
        score === 100
          ? 'Kinerja istimewa! Pemahaman konsep sangat kuat.'
          : score >= 67
          ? 'Sudah bagus, periksa satu soal yang keliru sebelum lanjut.'
          : 'Perlu penguatan materi. Jadwalkan sesi 15 menit dengan tutor.',
      remedialScheduled: score <= 50,
      remedialTime: score <= 50 ? 'Belum ditentukan (Menunggu Konfirmasi Tutor)' : undefined,
      timeSpentSeconds,
    };

    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.studentId === currentStudent.id && s.moduleId === moduleId)
      );
      return [newSubmission, ...filtered];
    });

    addNotification({
      title: `Hasil Kuis: ${currentStudent.name}`,
      message: `${currentStudent.name} menyelesaikan kuis "${mod.title}" dengan skor ${score} (${rubric.category}).`,
      type: 'grade_alert',
      targetRoles: ['parent', 'teacher', 'student'],
    });

    if (score <= 50) {
      addNotification({
        title: `Perlu Review 15 Menit: ${currentStudent.name}`,
        message: `Skor ${score} pada ${mod.title}. Sistem merekomendasikan sesi 15 menit review bersama tutor.`,
        type: 'remedial_schedule',
        targetRoles: ['teacher', 'parent'],
      });
    }

    return { score, rubric, submission: newSubmission };
  };

  const scheduleRemedial = (submissionId: string, time: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, remedialScheduled: true, remedialTime: time }
          : s
      )
    );

    const sub = submissions.find((s) => s.id === submissionId);
    if (sub) {
      addNotification({
        title: 'Jadwal Review 15 Menit Ditetapkan!',
        message: `Sesi bimbingan intensif 15 menit untuk ${sub.studentName} pada materi "${sub.moduleTitle}" dijadwalkan pada ${time}.`,
        type: 'remedial_schedule',
        targetRoles: ['student', 'parent', 'teacher'],
      });
    }
  };

  const payInvoice = (
    invoiceId: string,
    method: NonNullable<Invoice['paymentMethod']>
  ) => {
    const now = new Date();
    const paidAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Lunas',
              paidAt,
              paymentMethod: method,
            }
          : inv
      )
    );

    const inv = invoices.find((i) => i.id === invoiceId);
    if (inv) {
      addNotification({
        title: 'Pembayaran Les Berhasil!',
        message: `Kuitansi digital telah terbit untuk ${inv.studentName} - ${inv.description} sebesar Rp ${inv.amount.toLocaleString('id-ID')} via ${method}.`,
        type: 'payment_success',
        targetRoles: ['parent', 'teacher'],
      });
    }
  };

  const generateWhatsAppReport = (studentId: string) => {
    const student = students.find((s) => s.id === studentId) || currentStudent;
    const studentSubs = submissions.filter((s) => s.studentId === student.id);
    const avgScore =
      studentSubs.length > 0
        ? Math.round(
            studentSubs.reduce((acc, curr) => acc + curr.score, 0) /
              studentSubs.length
          )
        : 0;

    const completedCount = studentSubs.length;
    const unpaidInvoice = invoices.find(
      (i) => i.studentId === student.id && i.status !== 'Lunas'
    );

    const dateToday = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let moduleBreakdown = '';
    studentSubs.forEach((sub, idx) => {
      const icon = sub.score === 100 ? '🌟' : sub.score >= 67 ? '✅' : '⚠️';
      moduleBreakdown += `${idx + 1}. *${sub.moduleTitle}*\n   Nilai: *${sub.score}/100* (${icon} ${sub.rubricCategory})\n   Catatan: ${sub.tutorFeedback || sub.rubricNote}\n`;
    });

    if (studentSubs.length === 0) {
      moduleBreakdown = 'Belum ada pengerjaan kuis pada semester ini.\n';
    }

    const needsRemedial = studentSubs.some((s) => s.score <= 50);
    const remedialNote = needsRemedial
      ? `\n⚠️ *Perhatian Khusus:*\nTerdapat materi dengan pemahaman perlu ditingkatkan. Kak Sarah telah mengalokasikan sesi gratis review privat 15 menit.`
      : `\n✨ *Catatan Tutor:*\nAnanda menunjukkan perkembangan pemahaman dan kemandirian belajar yang sangat baik!`;

    const paymentInfo = unpaidInvoice
      ? `\n💳 *Info Administrasi:*\nTagihan SPP (${unpaidInvoice.period}): Rp ${unpaidInvoice.amount.toLocaleString('id-ID')} (Status: Belum Lunas - Jatuh Tempo: ${unpaidInvoice.dueDate}). Bayar praktis melalui portal e-learning.`
      : `\n💳 *Info Administrasi:*\nAdministrasi SPP bulan ini: *LUNAS*. Terima kasih atas kerjasamanya, Ayah/Bunda! 🙏`;

    const message = `*LAPORAN PERKEMBANGAN BELAJAR MINGGUAN*
*BIMBINGAN BELAJAR CERDAS MANDIRI*
📅 Tanggal: ${dateToday}

Kepada Yth. *${student.parentName}* (Wali Murid)
Berikut adalah rekapitulasi progres belajar ananda:

👤 *Nama Siswa:* ${student.name}
🏫 *Jenjang / Sekolah:* ${student.grade} - ${student.school}
📚 *Paket Belajar:* ${student.program} (${student.schedule})
🎯 *Tingkat Kehadiran:* ${student.attendanceRate}% (${student.attendedSessions}/${student.totalSessions} sesi)
📊 *Rata-Rata Nilai Tugas:* *${avgScore}/100* (${completedCount} modul selesai)

━━━━━━━━━━━━━━━━━━━━
📝 *DETAIL PENGERJAAN MODUL & KUIS:*
${moduleBreakdown}━━━━━━━━━━━━━━━━━━━━
${remedialNote}
${paymentInfo}

Silakan buka Portal E-Learning Cerdas Mandiri untuk melihat arsip tugas lengkap & kuitansi:
🌐 ${window.location.origin}

Salam hangat,
*Kak Sarah Amalia, S.Pd.*
_Head Tutor Bimbel Cerdas Mandiri_
📞 Telp/WA: 0812-3456-7890`;

    const phoneClean = student.parentPhone.replace(/^0/, '62');
    const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;

    return { text: message, waUrl };
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setSubmissions(INITIAL_SUBMISSIONS);
    setInvoices(INITIAL_INVOICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_ACCOUNTS[0]);
    setCurrentRole('student');
    setCurrentStudentId('std-1');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        students,
        modules,
        submissions,
        invoices,
        notifications,
        unreadNotifCount,
        activeModuleId,
        setActiveModuleId,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        login,
        loginAsAccount,
        logout,
        submitQuiz,
        scheduleRemedial,
        payInvoice,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        generateWhatsAppReport,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
