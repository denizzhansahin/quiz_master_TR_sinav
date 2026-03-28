import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/icons/Icon';
import { saveResult, loadQuestions, Question } from '../../utils/storage';
import { getExamConfig, getExamDurationSeconds } from '../../utils/exam-config';

function filterQuestions(allQuestions: Question[], examType: string, subject?: string, topic?: string) {
  let filtered = [...allQuestions];

  // If RASTGELE, we don't apply an exam-specific filter
  if (examType !== 'RASTGELE' && ['YKS', 'KPSS', 'ALES'].includes(examType)) {
    filtered = filtered.filter(q => q.examType === examType);
  }

  if (subject) {
    filtered = filtered.filter(q => q.subject === subject);
  }
  
  if (topic) {
    filtered = filtered.filter(q => q.topic === topic);
  }

  return filtered;
}

// Question limiter: apply exam-specific question count
function limitQuestions(questions: Question[], examType: string) {
  const config = getExamConfig(examType);
  if (config.questionCount > 0 && questions.length > config.questionCount) {
    return questions.slice(0, config.questionCount);
  }
  return questions;
}

export default function QuizEngineWebScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const examType = (params.examType as string) || 'KPSS';
  console.log(params);
  const subject = params.subject as string | undefined;
  const topic = params.topic as string | undefined;

  const examConfig = getExamConfig(examType);
  const totalDurationSeconds = getExamDurationSeconds(examType);
  const hasTimeLimit = totalDurationSeconds > 0;

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions().then(data => {
      setAllQuestions(data);
      setLoading(false);
    });
  }, []);

  const questions = useMemo(() => {
    if (loading || allQuestions.length === 0) return [];
    let filtered = filterQuestions(allQuestions, examType, subject, topic);
    if (examType === 'RASTGELE' || params.mode === 'mixed') {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    return limitQuestions(filtered, examType);
  }, [allQuestions, loading, examType, subject, topic, params.mode]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(hasTimeLimit ? totalDurationSeconds : 0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishCalledRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const completedCount = Object.keys(userAnswers).length;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(e => e + 1);
      if (hasTimeLimit) {
        setTimeLeft(t => {
          const next = t - 1;
          return next >= 0 ? next : 0;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [hasTimeLimit]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex, questions]);

  const handleOptionSelect = (optionLabel: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionLabel }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const calculateAndFinish = useCallback(async (isAutoFinish = false) => {
    if (finishCalledRef.current) return;
    if (questions.length === 0) return;
    finishCalledRef.current = true;
    setFinished(true);

    let correct = 0;
    let wrong = 0;
    let empty = 0;
    const wrongIds: number[] = [];
    const emptyIds: number[] = [];

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        empty++;
        emptyIds.push(q.id);
      } else if (ans === q.correct_option) {
        correct++;
      } else {
        wrong++;
        wrongIds.push(q.id);
      }
    });

    const netScore = parseFloat(Math.max(0, correct - wrong * 0.25).toFixed(2));
    const timeTaken = hasTimeLimit ? (totalDurationSeconds - timeLeft) : elapsed;

    await saveResult({
      examType,
      subject: subject || (questions[0]?.subject as string | undefined),
      topic: topic || (questions[0]?.topic as string | undefined),
      correct, wrong, empty,
      total: totalQuestions,
      netScore,
      wrongIds,
      emptyIds,
      timeTaken,
    });

    if (isAutoFinish) {
      window.alert(`S\u00fcre Doldu! \u23f0\n\nS\u0131nav s\u00fcresi sona erdi. S\u0131nav\u0131n\u0131z otomatik olarak bitirildi.\n\nDo\u011fru: ${correct} | Yanl\u0131\u015f: ${wrong} | Bo\u015f: ${empty}\nNet: ${netScore}`);
    }

    router.replace({
      pathname: '/result_analysis',
      params: { correct, wrong, empty, total: totalQuestions, wrongIds: wrongIds.join(','), emptyIds: emptyIds.join(','), examType, subject: subject || '', topic: topic || '', timeTaken },
    });
  }, [userAnswers, questions, totalQuestions, hasTimeLimit, totalDurationSeconds, timeLeft, elapsed, examType, subject, topic, router]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-finish when time runs out
  useEffect(() => {
    if (hasTimeLimit && timeLeft <= 0 && !finished && questions.length > 0) {
      calculateAndFinish(true);
    }
  }, [timeLeft, hasTimeLimit, finished, calculateAndFinish, questions.length]);

  const progressPercentage = questions.length > 0 ? (completedCount / totalQuestions) * 100 : 0;
  const displayTime = hasTimeLimit ? timeLeft : elapsed;
  const minutes = Math.floor(displayTime / 60).toString().padStart(2, '0');
  const seconds = (displayTime % 60).toString().padStart(2, '0');
  const isTimeLow = hasTimeLimit && timeLeft <= 300;
  const examLabel = examType === 'KONU_TEST' && topic ? `${topic} Testi` : examConfig.label || 'Quiz';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-bold text-primary">Sorular Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-surface p-6 text-center gap-6">
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center">
          <Icon name="search_off" className="text-on-surface-variant" size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Soru Bulunamadı</h2>
          <p className="text-on-surface-variant max-w-xs leading-relaxed">
            Seçtiğiniz "{examLabel}" kategorisinde veya konuda henüz soru eklenmemiş.
          </p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F8F9FF', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Fixed Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8EAF6', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(21,101,192,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 20, display: 'flex' }}>
            <Icon name="arrow-back" color="#1565C0" size={22} />
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1565C0', letterSpacing: -0.3 }}>{examLabel}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#757575', textTransform: 'uppercase', letterSpacing: 0.5 }}>{currentQuestion.topic}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: isTimeLow ? '#FFEBEE' : '#E3F2FD', padding: '6px 14px', borderRadius: 20 }}>
            <Icon name="timer" color={isTimeLow ? '#D32F2F' : '#1565C0'} size={14} />
            <span style={{ fontSize: 13, fontWeight: 800, color: isTimeLow ? '#D32F2F' : '#1565C0' }}>{minutes}:{seconds}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#E8EAF6', padding: '6px 14px', borderRadius: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1565C0' }}>{currentIndex + 1}/{totalQuestions}</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 5, backgroundColor: '#E8EAF6', flexShrink: 0 }}>
        <div style={{ height: '100%', backgroundColor: '#1565C0', width: `${progressPercentage}%`, transition: 'width 0.4s ease', borderRadius: 4 }} />
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Progress text */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.8 }}>İlerleme</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1565C0' }}>{completedCount} / {totalQuestions} tamamlandı — %{Math.round(progressPercentage)}</span>
          </div>

          {/* Question Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(21,101,192,0.08)', borderLeft: '4px solid #1565C0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1565C0', background: '#E3F2FD', padding: '4px 10px', borderRadius: 8 }}>Soru {currentIndex + 1}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#757575', background: '#F5F5F5', padding: '4px 10px', borderRadius: 8 }}>{currentQuestion.subject}</span>
            </div>
            <p style={{ fontSize: 17, fontWeight: 500, color: '#212121', lineHeight: 1.65, margin: 0 }}>{currentQuestion.question_text}</p>
            {currentQuestion.image_url && (
              <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F5F7FF', height: 200 }}>
                <img src={currentQuestion.image_url} alt="Soru görseli" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: 0.85 }} />
              </div>
            )}
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentQuestion.options.map((option: { label: string; text: string }) => {
              const isSelected = userAnswers[currentQuestion.id] === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => handleOptionSelect(option.label)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '14px 16px', borderRadius: 14,
                    border: isSelected ? '2px solid #1565C0' : '2px solid #E8EAF6',
                    backgroundColor: isSelected ? '#1565C0' : '#FFFFFF',
                    cursor: 'pointer', textAlign: 'left', gap: 12,
                    boxShadow: isSelected ? '0 4px 16px rgba(21,101,192,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
                    outline: 'none',
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#E3F2FD', flexShrink: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: isSelected ? '#FFFFFF' : '#1565C0' }}>{option.label}</span>
                  </div>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 15, color: isSelected ? '#FFFFFF' : '#212121', lineHeight: 1.4 }}>{option.text}</span>
                  {isSelected && <Icon name="check-circle" color="#FFFFFF" size={20} />}
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <button onClick={handlePrev} disabled={currentIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 12, border: 'none', background: currentIndex === 0 ? '#F5F5F5' : '#E3F2FD', color: currentIndex === 0 ? '#BDBDBD' : '#1565C0', fontWeight: 700, fontSize: 13, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}>
              <Icon name="chevron-left" color={currentIndex === 0 ? '#BDBDBD' : '#1565C0'} size={18} />
              Önceki
            </button>
            <button onClick={handleNext} disabled={currentIndex === totalQuestions - 1} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 12, border: 'none', background: currentIndex === totalQuestions - 1 ? '#F5F5F5' : '#1565C0', color: currentIndex === totalQuestions - 1 ? '#BDBDBD' : '#FFFFFF', fontWeight: 700, fontSize: 13, cursor: currentIndex === totalQuestions - 1 ? 'not-allowed' : 'pointer', boxShadow: currentIndex === totalQuestions - 1 ? 'none' : '0 4px 14px rgba(21,101,192,0.3)' }}>
              Sonraki
              <Icon name="chevron-right" color={currentIndex === totalQuestions - 1 ? '#BDBDBD' : '#FFFFFF'} size={18} />
            </button>
          </div>

          {/* Question Navigator */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.8 }}>Soru Gezgini</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1565C0' }}>{completedCount}/{totalQuestions} cevaplandı</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentIndex;
                const bg = isCurrent ? '#1565C0' : isAnswered ? '#C8E6C9' : '#F5F5F5';
                const color = isCurrent ? '#FFFFFF' : isAnswered ? '#388E3C' : '#757575';
                return (
                  <button key={q.id} onClick={() => setCurrentIndex(idx)} style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: bg, color, fontWeight: 800, fontSize: 12, border: isCurrent ? '2px solid #1565C0' : '2px solid transparent', cursor: 'pointer', outline: 'none' }}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish button */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 32 }}>
            <button onClick={() => calculateAndFinish(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#388E3C', color: '#FFFFFF', fontWeight: 800, fontSize: 14, padding: '14px 36px', borderRadius: 16, border: 'none', cursor: 'pointer', letterSpacing: 0.5, boxShadow: '0 6px 20px rgba(56,142,60,0.35)' }}>
              <Icon name="check-circle" color="#FFFFFF" size={20} />
              Sınavı Bitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
