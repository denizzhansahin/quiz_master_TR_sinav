// Exam configuration: duration and question counts per exam type

export interface ExamConfig {
  label: string;
  /** Duration in minutes. 0 = unlimited (topic test mode) */
  durationMinutes: number;
  /** Max question count. 0 = unlimited (use all available questions) */
  questionCount: number;
}

export const EXAM_CONFIG: Record<string, ExamConfig> = {
  KPSS: {
    label: 'KPSS Denemesi',
    durationMinutes: 150,
    questionCount: 120,
  },
  YKS: {
    label: 'YKS Denemesi',
    durationMinutes: 135,
    questionCount: 120,
  },
  ALES: {
    label: 'ALES Denemesi',
    durationMinutes: 150,
    questionCount: 100,
  },
  KONU_TEST: {
    label: 'Konu Testi',
    durationMinutes: 0,
    questionCount: 0,
  },
};

/** Get config for an exam type, defaults to KPSS if unknown */
export function getExamConfig(examType: string): ExamConfig {
  return EXAM_CONFIG[examType] || EXAM_CONFIG.KPSS;
}

/** Get total duration in seconds. Returns 0 for unlimited. */
export function getExamDurationSeconds(examType: string): number {
  return getExamConfig(examType).durationMinutes * 60;
}
