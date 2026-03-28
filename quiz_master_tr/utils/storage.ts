import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuizResult {
  id: string;
  date: string;
  examType: string; // 'KPSS' | 'YKS' | 'ALES' | 'KONU_TEST'
  subject?: string;
  topic?: string;
  correct: number;
  wrong: number;
  empty: number;
  total: number;
  netScore: number;
  wrongIds: number[];
  emptyIds: number[];
  timeTaken?: number; // seconds spent on the quiz
}

export interface Question {
  id: number;
  examType: string;
  subject: string;
  topic: string;
  question_text: string;
  image_url: string | null;
  options: { label: string; text: string }[];
  correct_option: string;
  explanation: string;
}

const STORAGE_KEY = 'quiz_master_results';
const QUESTIONS_KEY = 'quiz_master_questions';
const SYNC_URL_KEY = 'quiz_master_sync_url';

export const DEFAULT_SYNC_URL = 'https://raw.githubusercontent.com/denizzhansahin/quiz_master_TR_sinav/refs/heads/main/sorular/yeniSorular.json';

// For seeding
const getInitialQuestions = (): Question[] => {
  try {
    return require('../assets/data/questions.json');
  } catch (e) {
    return [];
  }
};

// ─── Web (localStorage) ─────────────────────────────────────────────────────
function webSave(results: QuizResult[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(results)); } catch (_) {}
}

function webLoad(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

function webClear(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}

// ─── Web Questions ─────────────────────────────────────────────────────────
function webSaveQuestions(questions: Question[]): void {
  try { localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions)); } catch (_) {}
}

function webLoadQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) {
      const initial = getInitialQuestions();
      webSaveQuestions(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (_) { return getInitialQuestions(); }
}

// ─── Native (AsyncStorage) ───────────────────────────────────────────────
async function nativeSave(results: QuizResult[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (_) {}
}

async function nativeLoad(): Promise<QuizResult[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

async function nativeClear(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

// ─── Native Questions ───────────────────────────────────────────────────────
async function nativeSaveQuestions(questions: Question[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (_) {}
}

async function nativeLoadQuestions(): Promise<Question[]> {
  try {
    const raw = await AsyncStorage.getItem(QUESTIONS_KEY);
    if (!raw) {
      const initial = getInitialQuestions();
      await nativeSaveQuestions(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (_) { return getInitialQuestions(); }
}

// ─── Unified Public API ──────────────────────────────────────────────────────

export async function loadResults(): Promise<QuizResult[]> {
  if (Platform.OS === 'web') return webLoad();
  return nativeLoad();
}

export async function saveResult(result: Omit<QuizResult, 'id' | 'date'>): Promise<void> {
  const full: QuizResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  const existing = await loadResults();
  const updated = [full, ...existing].slice(0, 100);
  if (Platform.OS === 'web') webSave(updated);
  else await nativeSave(updated);
}

export async function clearResults(): Promise<void> {
  if (Platform.OS === 'web') webClear();
  else await nativeClear();
}

// ─── Questions API ──────────────────────────────────────────────────────────

export async function loadQuestions(): Promise<Question[]> {
  if (Platform.OS === 'web') return webLoadQuestions();
  return nativeLoadQuestions();
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  if (Platform.OS === 'web') webSaveQuestions(questions);
  else await nativeSaveQuestions(questions);
}

export async function getSyncUrl(): Promise<string> {
  try {
    const raw = Platform.OS === 'web' 
      ? localStorage.getItem(SYNC_URL_KEY) 
      : await AsyncStorage.getItem(SYNC_URL_KEY);
    return raw || DEFAULT_SYNC_URL;
  } catch (_) {
    return DEFAULT_SYNC_URL;
  }
}

export async function saveSyncUrl(url: string): Promise<void> {
  try {
    if (Platform.OS === 'web') localStorage.setItem(SYNC_URL_KEY, url);
    else await AsyncStorage.setItem(SYNC_URL_KEY, url);
  } catch (_) {}
}

export async function resetQuestions(): Promise<number> {
  const initial = getInitialQuestions();
  if (Platform.OS === 'web') {
    localStorage.removeItem(QUESTIONS_KEY);
    webSaveQuestions(initial);
  } else {
    await AsyncStorage.removeItem(QUESTIONS_KEY);
    await nativeSaveQuestions(initial);
  }
  return initial.length;
}

export async function syncQuestions(url: string): Promise<{ added: number; total: number }> {
  try {
    const response = await fetch(url);
    const remoteQuestions = await response.json();
    
    if (!Array.isArray(remoteQuestions)) {
      throw new Error('Geçersiz veri formatı');
    }

    const currentQuestions = await loadQuestions();
    const existingIds = new Set(currentQuestions.map(q => q.id));
    
    let addedCount = 0;
    let maxId = currentQuestions.reduce((max, q) => Math.max(max, typeof q.id === 'number' ? q.id : 0), 0);

    const newOnes = remoteQuestions.filter(q => {
      // Check if ID exists. If not provided or duplicate, we might need to handle it.
      // But the user said "different from current IDs"
      if (q.id && !existingIds.has(q.id)) {
        addedCount++;
        return true;
      }
      // If no ID, generate one
      if (!q.id) {
        maxId++;
        q.id = maxId;
        addedCount++;
        return true;
      }
      return false;
    });

    if (newOnes.length > 0) {
      const updated = [...currentQuestions, ...newOnes];
      await saveQuestions(updated);
      return { added: addedCount, total: updated.length };
    }

    return { added: 0, total: currentQuestions.length };
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

export function computeStats(results: QuizResult[]) {
  const totalExams = results.length;
  const totalCorrect = results.reduce((s, r) => s + r.correct, 0);
  const totalWrong = results.reduce((s, r) => s + r.wrong, 0);
  const totalEmpty = results.reduce((s, r) => s + r.empty, 0);
  const totalQuestions = results.reduce((s, r) => s + r.total, 0);
  const avgNet = totalExams > 0 ? (results.reduce((s, r) => s + r.netScore, 0) / totalExams) : 0;
  const bestNet = totalExams > 0 ? Math.max(...results.map(r => r.netScore)) : 0;

  // Average time taken (in seconds)
  const resultsWithTime = results.filter(r => r.timeTaken && r.timeTaken > 0);
  const avgTimeTaken = resultsWithTime.length > 0
    ? Math.round(resultsWithTime.reduce((s, r) => s + (r.timeTaken || 0), 0) / resultsWithTime.length)
    : 0;

  const subjectMap: Record<string, { correct: number; wrong: number; empty: number; total: number }> = {};
  results.forEach(r => {
    const key = r.subject || r.examType;
    if (!subjectMap[key]) subjectMap[key] = { correct: 0, wrong: 0, empty: 0, total: 0 };
    subjectMap[key].correct += r.correct;
    subjectMap[key].wrong += r.wrong;
    subjectMap[key].empty += r.empty;
    subjectMap[key].total += r.total;
  });

  return { totalExams, totalCorrect, totalWrong, totalEmpty, totalQuestions, avgNet, bestNet, avgTimeTaken, subjectMap };
}
