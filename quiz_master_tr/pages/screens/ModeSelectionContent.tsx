import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/icons/Icon';
import questionsData from '../../assets/data/questions.json';

export default function ModeSelectionWebScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const examType = (params.examType as string) || 'KPSS';
  const [selectedMode, setSelectedMode] = useState('focused');

  const examLabels: Record<string, { title: string; desc: string; icon: string }> = {
    YKS: { title: 'YKS Sınavı', desc: 'TYT-AYT müfredatına uygun tüm derslerden sorular', icon: 'school' },
    KPSS: { title: 'KPSS Sınavı', desc: 'Genel Yetenek ve Genel Kültür sorularından oluşan test', icon: 'work' },
    ALES: { title: 'ALES Sınavı', desc: 'Sözel ve Sayısal yetenek sorularından oluşan test', icon: 'history-edu' },
    RASTGELE: { title: 'Genel Test', desc: 'Tüm derslerden karışık sorular', icon: 'shuffle' },
  };
  const currentExam = examLabels[examType] || { title: 'Genel Test', desc: 'Tüm derslerden karışık sorular', icon: 'quiz' };
  const totalQuestions = questionsData.length;


  return (
    <div className="bg-surface font-body text-on-surface antialiased h-screen flex flex-col overflow-hidden">
      <header className="w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6 h-16 shrink-0 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tighter text-blue-800 dark:text-blue-300">Quiz Master TR</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors scale-95 active:opacity-80">
            <Icon name="timer" className="text-blue-700 dark:text-blue-400" />
          </button>
          <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors scale-95 active:opacity-80 relative">
            <Icon name="notifications-active" className="text-blue-700 dark:text-blue-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full border-2 border-primary-container p-0.5 overflow-hidden">
            <img alt="User profile avatar" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxK8DnsdoqHJl213ltiJJSTR9Aa1Ig14IoPkGf9u7kLDkh8f0QW-bZqUYpIZ7loUhGD0WvB4bmwCwnCJUhBOPPbl6yR78Uv5uBONXZapWN12q0SstX1levnkUib7cBpEMZ0x6MDDHvSvH72IF9NVC_aOIW50LswQLcov7HxJyD0Y8LcNaR704TXgq2eTcZK1CrDmIqAOeNZ0aJ3WYEe8sdr53VqgTd0DfGgpDPbnZqc7EHdTWMPohET1oS5VY3Rz0KeSJdUHQJQ8zH" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="py-12 px-6 max-w-5xl mx-auto relative z-0 pb-32">
        <header className="mb-10">
          <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface mb-2">Konu Seçimi</h1>
          <p className="text-on-surface-variant font-medium">Hazırlanmak istediğiniz dersi ve konuyu belirleyin.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 select-none pointer-events-none">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/15">
            <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-primary-fixed rounded-2xl">
                <Icon name="functions" className="text-primary text-3xl" size={32} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">MATEMATİK</span>
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4">Türev ve Uygulamaları</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full premium-gradient w-[65%]"></div>
              </div>
              <span className="text-sm font-bold text-primary">65%</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/15">
            <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-secondary-fixed rounded-2xl">
                <Icon name="biotech" className="text-secondary text-3xl" size={32} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">BİYOLOJİ</span>
            </div>
            <h3 className="text-2xl font-headline font-bold mb-4">Hücre Bölünmeleri</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full premium-gradient w-[22%]"></div>
              </div>
              <span className="text-sm font-bold text-primary">22%</span>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm">
        <div className="w-full max-w-xl bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(25,27,35,0.12)] overflow-hidden relative border border-white/40">
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Sınav Modu Seçimi</h2>
              <p className="text-on-surface-variant mt-2 font-medium">{currentExam.title} — {currentExam.desc}</p>
            </div>
            <button onClick={() => router.back()} className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95">
              <Icon name="close" className="text-on-surface-variant" />
            </button>
          </div>

          <div className="p-8 pt-4 space-y-4">
            <label className="group relative flex flex-col p-6 rounded-[1.5rem] bg-surface-container-low cursor-pointer transition-all duration-300 hover:bg-surface-container-high">
              <input checked={selectedMode === 'focused'} onChange={() => setSelectedMode('focused')} className="hidden peer" name="exam_mode" type="radio" />
              <div className="absolute inset-0 rounded-[1.5rem] ring-2 ring-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-fixed text-primary group-hover:scale-110 transition-transform">
                    <Icon name="track-changes" />
                  </div>
                  <span className="text-lg font-bold font-headline">Konu Odaklı Çöz</span>
                </div>
                <div className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-extrabold uppercase tracking-tighter text-on-surface-variant">
                  {totalQuestions} SORU
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed pr-8">
                {currentExam.title} kapsamında odaklanmış uzmanlık soruları.
              </p>
              <div className="mt-4 flex justify-end">
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                </div>
              </div>
            </label>

            <label className="group relative flex flex-col p-6 rounded-[1.5rem] bg-surface-container-low cursor-pointer transition-all duration-300 hover:bg-surface-container-high">
              <input checked={selectedMode === 'mixed'} onChange={() => setSelectedMode('mixed')} className="hidden peer" name="exam_mode" type="radio" />
              <div className="absolute inset-0 rounded-[1.5rem] ring-2 ring-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary-fixed text-secondary group-hover:scale-110 transition-transform">
                    <Icon name="shuffle" />
                  </div>
                  <span className="text-lg font-bold font-headline">Karışık Çöz</span>
                </div>
                <div className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-extrabold uppercase tracking-tighter text-on-surface-variant">
                  {totalQuestions} SORU
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed pr-8">
                Tüm derslerden harmanlanmış dengeli test.
              </p>
              <div className="mt-4 flex justify-end">
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:bg-secondary peer-checked:border-secondary flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                </div>
              </div>
            </label>
          </div>

          <div className="p-8 pt-0">
            <button onClick={() => router.push({ pathname: '/quiz_engine', params: { examType, mode: selectedMode } })} className="w-full premium-gradient text-white font-label font-bold py-5 rounded-2xl uppercase tracking-widest text-sm shadow-[0_10px_25px_rgba(0,88,190,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
              Sınavı Başlat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
