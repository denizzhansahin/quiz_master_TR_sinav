import React, { useState, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/icons/Icon';
import { Question, loadQuestions } from '../../utils/storage';
import WebHeaderMenu from '../../components/shared/WebHeaderMenu';

const SUBJECT_COLORS: Record<string, string> = {
  'Matematik': 'bg-primary-fixed',
  'Türkçe': 'bg-primary-fixed-dim',
  'Tarih': 'bg-secondary-fixed',
  'Coğrafya': 'bg-tertiary-fixed',
  'Fen Bilimleri': 'bg-secondary-fixed',
};

export default function SubjectTreeWebScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>((params.examType as string) || 'YKS');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadQuestions().then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const subjectTopics = useMemo(() => {
    const map: Record<string, string[]> = {};
    const filteredQuestions = questions.filter(q => q.examType === selectedExamType);
    filteredQuestions.forEach(q => {
      if (!q.subject || !q.topic) return;
      if (!map[q.subject as string]) map[q.subject as string] = [];
      if (!map[q.subject as string].includes(q.topic as string)) map[q.subject as string].push(q.topic as string);
    });
    return map;
  }, [selectedExamType, questions]);

  const subjects = Object.keys(subjectTopics);

  const subjectIcons: Record<string, string> = {
    'Matematik': 'calculate',
    'Türkçe': 'translate',
    'Tarih': 'history-edu',
    'Coğrafya': 'public',
    'Fen Bilimleri': 'science',
  };

  const toggleSubject = (subject: string) => {
    setOpenSubject(openSubject === subject ? null : subject);
  };

  return (
    <div className="bg-surface font-body text-on-surface h-screen flex flex-col overflow-hidden">
      <WebHeaderMenu />

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="py-8 px-6 w-full max-w-7xl mx-auto pb-24">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-2">
            <span>Sınavlar</span>
            <Icon name="chevron-right" size={14} />
            <span className="text-primary font-semibold">Konu Ağacı</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Çalışma Planını Özelleştir</h1>
          <p className="text-on-surface-variant max-w-xl">Hangi sınava ve derse odaklanmak istediğini seç. Konularını ve ilerlemeni buradan takip edebilirsin.</p>
        </div>

        {/* Exam Type Tabs */}
        <div className="flex bg-surface-container-high p-1 rounded-2xl mb-8 w-full max-w-2xl">
          {['YKS', 'KPSS', 'ALES'].map(type => {
            const isActive = selectedExamType === type;
            console.log(selectedExamType);
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedExamType(type);
                  setOpenSubject(null);
                }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-white/50'}`}
              >
                {type} Sınavı
              </button>
            );
          })}
        </div>

        {/* Quick Start Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-2 bg-primary-container p-6 rounded-xl text-on-primary-container flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-80 mb-1">Hızlı Başlat</p>
              <h2 className="text-3xl font-extrabold font-headline">Sınav Denemesi</h2>
            </div>
            <div className="mt-4 relative z-10 flex gap-3">
              {[
                { label: 'KPSS', examType: 'KPSS', icon: 'work' },
                { label: 'YKS', examType: 'YKS', icon: 'school' },
                { label: 'ALES', examType: 'ALES', icon: 'auto-stories' },
              ].map(item => (
                <button
                  key={item.examType}
                  onClick={() => router.push({ pathname: '/quiz_engine', params: { examType: item.examType } })}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-on-primary-container font-bold text-sm transition-colors"
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(25,27,35,0.06)] flex flex-col items-center justify-center text-center">
            <Icon name="auto-awesome" className="text-primary mb-2" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Seçili Sınav Toplam Soru</p>
            <p className="text-lg font-bold">{questions.filter(q => q.examType === selectedExamType).length}</p>
          </div>
        </div>

        {/* Subject/Topic Tree (Grid Layout for Desktop) */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjects.map(subject => {
              const isOpen = openSubject === subject;
              const bgClass = SUBJECT_COLORS[subject] || 'bg-primary-fixed';
              return (
                <div key={subject} className="group">
                  {/* Subject Header */}
                  <button
                    onClick={() => toggleSubject(subject)}
                    className={`flex items-center justify-between w-full p-5 rounded-xl cursor-pointer transition-all ${isOpen ? 'bg-surface-container-highest hover:bg-surface-container' : 'bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:bg-surface-container'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${bgClass} flex items-center justify-center rounded-xl`}>
                        <Icon name={subjectIcons[subject] || 'school'} size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">{subject}</h3>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {subjectTopics[subject].length} Konu • {questions.filter(q => q.examType === selectedExamType && q.subject === subject).length} Soru
                        </p>
                      </div>
                    </div>
                    <Icon name={isOpen ? 'expand-less' : 'expand-more'} className="text-on-surface-variant" size={24} />
                  </button>

                  {/* Topics list */}
                  {isOpen && (
                    <div className="mt-2 ml-14 space-y-2">
                      {/* Start all for subject */}
                      <button
                        onClick={() => router.push({ pathname: '/quiz_engine', params: { examType: selectedExamType, subject } })}
                        className="w-full flex items-center gap-3 p-3 bg-primary/5 rounded-xl text-primary font-bold text-sm hover:bg-primary/10 transition-colors"
                      >
                        <Icon name="play-circle" size={20} />
                        Tüm {subject} Sorularını Çöz ({questions.filter(q => q.examType === selectedExamType && q.subject === subject).length} soru)
                      </button>

                      {/* Individual Topics */}
                      {subjectTopics[subject].map(topic => {
                        const count = questions.filter(q => q.examType === selectedExamType && q.subject === subject && q.topic === topic).length;
                        return (
                          <div key={topic} className="p-4 bg-surface-container-low rounded-xl flex flex-col gap-3 hover:bg-surface-container-high transition-colors">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-on-surface">{topic}</span>
                              <span className="text-xs font-bold text-on-surface-variant">{count} soru</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full w-full"></div>
                              </div>
                              <button
                                onClick={() => router.push({ pathname: '/quiz_engine', params: { examType: selectedExamType, subject, topic } })}
                                className="text-primary hover:scale-110 transition-transform"
                              >
                                <Icon name="play-circle" size={24} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
            <Icon name="search_off" size={64} className="text-on-surface-variant mb-4" />
            <h3 className="text-xl font-bold text-on-surface">İçerik Bulunamadı</h3>
            <p className="text-on-surface-variant max-w-xs text-center mt-1">Bu sınav tipi için henüz eklenmiş konu bulunmuyor.</p>
          </div>
        )}


        </div>
      </main>
    </div>
  );
}
