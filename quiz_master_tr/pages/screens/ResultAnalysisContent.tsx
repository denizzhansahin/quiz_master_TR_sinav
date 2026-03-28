import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/icons/Icon';
import questionsData from '../../assets/data/questions.json';

export default function ResultAnalysisWebScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const correct = parseInt((params.correct as string) || '0');
  const wrong = parseInt((params.wrong as string) || '0');
  const empty = parseInt((params.empty as string) || '0');
  const total = parseInt((params.total as string) || '50');

  const wrongIds = (params.wrongIds as string)?.split(',').filter(Boolean).map(Number) || [];
  const emptyIds = (params.emptyIds as string)?.split(',').filter(Boolean).map(Number) || [];
  const timeTaken = parseInt((params.timeTaken as string) || '0');
  const problemIds = [...wrongIds, ...emptyIds];
  const problemQuestions = questionsData.filter(q => problemIds.includes(q.id));

  const netScore = Math.max(0, correct - (wrong * 0.25)).toFixed(2);
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;
  const wrongPercentage = total > 0 ? (wrong / total) * 100 : 0;
  const emptyPercentage = total > 0 ? (empty / total) * 100 : 0;

  return (
    <div className="bg-surface font-body text-on-surface h-screen flex flex-col overflow-hidden">
      <header className="w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6 h-16 shrink-0 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/(tabs)')} className="text-on-surface-variant hover:bg-blue-50 transition-colors p-2 rounded-full">
            <Icon name="arrow-back" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tighter text-blue-800 dark:text-blue-300 font-headline leading-tight">Deneme Sonucu</h1>
            <span className="text-xs font-medium text-on-surface-variant">Performans Analizi</span>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => {
              const text = `Quiz Sonucum: Net: ${netScore}, Doğru: ${correct}, Yanlış: ${wrong}, Boş: ${empty}`;
              if (navigator.share) {
                navigator.share({ title: 'Quiz Sonucu', text }).catch(() => {});
              } else {
                navigator.clipboard.writeText(text);
                alert('Sonuçlar panoya kopyalandı!');
              }
            }}
            className="scale-95 active:opacity-80 transition-all p-2 rounded-full hover:bg-blue-50"
            title="Hızlı Paylaş"
          >
            <Icon name="share" className="text-on-surface-variant" />
          </button>
          
          <div className="group relative">
            <button className="scale-95 active:opacity-80 transition-all p-2 rounded-full hover:bg-blue-50">
              <Icon name="more-vert" className="text-on-surface-variant" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline-variant/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] overflow-hidden">
              <button onClick={() => window.print()} className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-sm font-bold text-on-surface-variant transition-colors border-b border-outline-variant/5">
                <Icon name="print" size={18} /> Yazdır
              </button>
              <button 
                onClick={() => {
                  const content = `QUIZ MASTER TR - SONUÇ ANALİZİ\nDate: ${new Date().toLocaleDateString()}\nNet Score: ${netScore}\nCorrect: ${correct}\nWrong: ${wrong}\nEmpty: ${empty}\nTime: ${Math.floor(timeTaken/60)}m ${timeTaken%60}s`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `quiz_sonucu_${Date.now()}.txt`;
                  a.click();
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-sm font-bold text-on-surface-variant transition-colors border-b border-outline-variant/5"
              >
                <Icon name="download" size={18} /> İndir (.txt)
              </button>
              <button 
                onClick={() => {
                  const text = `Quiz Sonucum: Net: ${netScore}, Doğru: ${correct}, Yanlış: ${wrong}, Boş: ${empty}`;
                  navigator.clipboard.writeText(text);
                  alert('Kopyalandı!');
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-sm font-bold text-on-surface-variant transition-colors border-b border-outline-variant/5"
              >
                <Icon name="content-copy" size={18} /> Kopyala
              </button>
              <button 
                onClick={() => {
                  const text = `Quiz Sonucum: Net: ${netScore}, Doğru: ${correct}, Yanlış: ${wrong}, Boş: ${empty}`;
                  window.open(`sms:?body=${encodeURIComponent(text)}`);
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-sm font-bold text-on-surface-variant transition-colors"
              >
                <Icon name="sms" size={18} /> SMS Gönder
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="py-12 px-4 max-w-4xl mx-auto flex flex-col gap-12 pb-24">
        {/* Score Summary: Asymmetrical Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-8 md:p-10 rounded-3xl text-on-primary-container flex flex-col justify-between relative overflow-hidden shadow-[0_20px_40px_rgba(25,27,35,0.06)] group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Net Puan</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-on-primary-container">{netScore}</h2>
                </div>
              </div>
              <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-sm self-start md:self-auto shrink-0 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  {correctPercentage > 50 ? (
                     <Icon name="trending-up" className="text-2xl text-on-primary-container" size={24} />
                  ) : (
                     <Icon name="trending-down" className="text-2xl text-error" size={24} />
                  )}
                  <span className="font-bold text-sm tracking-wide">Ortalamanın Üzerinde</span>
                </div>
                <p className="text-xs font-medium opacity-90 max-w-[150px]">Geçen haftaya göre %12 artış gösterdin.</p>
              </div>
            </div>
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-white/20 transition-colors duration-700"></div>
          </div>
          
          <div className="flex flex-row md:flex-col gap-4">
            <div className="flex-1 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between hover:border-primary/20 transition-all">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Süre Analizi</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black font-headline text-on-surface">{Math.floor(timeTaken / 60)}</span>
                <span className="text-sm font-medium text-on-surface-variant">dk</span>
                <span className="text-2xl font-black font-headline text-on-surface ml-1">{(timeTaken % 60).toString().padStart(2, '0')}</span>
                <span className="text-sm font-medium text-on-surface-variant">sn</span>
              </div>
            </div>
            <div className="flex-1 bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between hover:bg-surface-container-high transition-all border border-transparent">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Soru Başına</span>
               <div className="mt-4 flex items-baseline gap-2">
                 <span className="text-4xl font-black font-headline text-primary">{total > 0 ? Math.round(timeTaken / total) : 0}</span>
                 <span className="text-sm font-medium text-on-surface-variant">sn / soru</span>
               </div>
            </div>
          </div>
        </section>

        {/* Question Breakdown Chart */}
        <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-headline">Soru Dağılımı</h3>
            <span className="px-4 py-1.5 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant">Toplam {total} Soru</span>
          </div>

          <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden flex flex-row mb-10">
            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${correctPercentage}%` }}></div>
            <div className="h-full bg-error transition-all duration-1000" style={{ width: `${wrongPercentage}%` }}></div>
            <div className="h-full bg-outline-variant/30 transition-all duration-1000" style={{ width: `${emptyPercentage}%` }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <Icon name="check-circle" size={24} />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Doğru</span>
                <span className="text-3xl font-black text-on-surface">{correct}</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error shrink-0">
                <Icon name="cancel" size={24} />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Yanlış</span>
                <span className="text-3xl font-black text-on-surface">{wrong}</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
              <div className="w-12 h-12 rounded-xl bg-outline-variant/10 flex items-center justify-center text-outline-variant shrink-0">
                <Icon name="horizontal-rule" size={24} />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Boş</span>
                <span className="text-3xl font-black text-on-surface">{empty}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Failed / Empty Question Reviews */}
        <section className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-headline">Hatalı ve Boş Sorular</h3>
            <span className="px-4 py-1.5 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant">{problemQuestions.length} Çözüm Bekliyor</span>
          </div>

          <div className="flex flex-col gap-6">
            {problemQuestions.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-low rounded-3xl opacity-80">
                  <Icon name="emoji-events" className="text-secondary text-5xl mb-4" size={48} />
                  <p className="text-on-surface-variant font-bold text-lg">Kusursuz Performans!</p>
                  <p className="text-on-surface-variant text-sm mt-2">Gözden geçirilecek hatalı veya boş sorun bulunmuyor.</p>
               </div>
            ) : (
               problemQuestions.map(q => {
                 const isWrong = wrongIds.includes(q.id);
                 return (
                   <div key={q.id} className="bg-surface p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">Soru {q.id}</span>
                       <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase ${isWrong ? 'bg-error/10 text-error' : 'bg-outline-variant/10 text-on-surface-variant'}`}>{isWrong ? 'Yanlış' : 'Boş'}</span>
                     </div>
                     <p className="text-on-surface leading-relaxed font-medium mb-4">{q.question_text}</p>
                     
                     {q.image_url && (
                        <div className="w-full max-w-sm h-48 bg-surface-container-low rounded-xl overflow-hidden mb-4">
                          <img src={q.image_url} alt="Soru görseli" className="w-full h-full object-contain p-2 mix-blend-multiply opacity-80" />
                        </div>
                     )}
                     
                     <div className="bg-secondary/10 p-5 rounded-xl border-l-4 border-secondary mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="check-circle" className="text-secondary" size={20} />
                          <span className="font-bold text-secondary text-sm uppercase tracking-wide">Doğru Cevap: {q.correct_option}</span>
                        </div>
                        <p className="text-on-surface-variant text-sm leading-relaxed">{q.explanation || 'Çözüm açıklaması eklenmedi.'}</p>
                     </div>
                   </div>
                 );
               })
            )}
          </div>
        </section>

        <section className="flex justify-center mt-6">
           <button onClick={() => router.replace('/(tabs)')} className="px-10 py-4 bg-primary text-on-primary rounded-xl font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-primary/20">
             Ana Ekrana Dön
           </button>
        </section>
        </div>
      </main>
    </div>
  );
}
