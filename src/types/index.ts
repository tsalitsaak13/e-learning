export type UserRole = 'student' | 'parent' | 'teacher';

export type Subject = 'Matematika' | 'Bahasa Inggris' | 'IPA' | 'IPAS';

export type ProgramType = 'Reguler' | 'Intensif';

export interface QuizQuestion {
  id: string;
  question: string;
  questionType: 'multiple-choice' | 'short-answer';
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface LearningModule {
  id: string;
  moduleNumber: number;
  title: string;
  subject: Subject;
  gradeLevel: 'SD' | 'SMP';
  targetAudience: string;
  learningObjectives: string[];
  summary: {
    heading: string;
    points: { label?: string; content: string }[];
  }[];
  examples: {
    problem: string;
    steps: string[];
    solution: string;
  }[];
  questions: QuizQuestion[];
  estimatedMinutes: number;
  deadlineDay: string;
}

export interface QuizSubmission {
  id: string;
  moduleId: string;
  moduleTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> answer
  score: number; // 0 - 100
  rubricCategory: 'Sangat Baik' | 'Cukup Baik' | 'Perlu Bimbingan';
  rubricNote: string;
  tutorFeedback?: string;
  remedialScheduled?: boolean;
  remedialTime?: string;
  timeSpentSeconds: number;
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  studentId?: string; // linked student if student or parent
  password?: string;
  avatarUrl: string;
  email: string;
  nisn?: string;
}

export interface StudentProfile {
  id: string;
  username: string;
  password?: string;
  nisn: string;
  name: string;
  grade: string;
  gradeLevel: 'SD' | 'SMP';
  school: string;
  program: ProgramType;
  schedule: string;
  parentName: string;
  parentPhone: string;
  avatarUrl: string;
  attendanceRate: number; // e.g. 96%
  totalSessions: number;
  attendedSessions: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  parentName: string;
  description: string;
  period: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Bayar' | 'Menunggu Konfirmasi';
  paidAt?: string;
  paymentMethod?: 'QRIS' | 'BCA Virtual Account' | 'Mandiri VA' | 'GoPay' | 'ShopeePay' | 'Transfer Bank';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'quiz_submitted' | 'grade_alert' | 'payment_reminder' | 'payment_success' | 'remedial_schedule' | 'deadline_warning';
  targetRoles: UserRole[];
  read: boolean;
  actionUrl?: string;
}
