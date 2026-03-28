import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import { loadResults, clearResults, computeStats, QuizResult } from '../../utils/storage';
import WebHeaderMenu from '../../components/shared/WebHeaderMenu';

const EXAM_LABEL: Record<string, string> = {
  KPSS: 'KPSS Denemesi',
  YKS: 'YKS Denemesi',
  ALES: 'ALES Denemesi',
  KONU_TEST: 'Konu Testi',
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

export default function StatisticsWebScreen() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults().then(r => {
      setResults(r);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => computeStats(results), [results]);
  const totalSolved = stats.totalCorrect + stats.totalWrong + stats.totalEmpty;
  const overallRate = totalSolved > 0 ? Math.round((stats.totalCorrect / totalSolved) * 100) : 0;

  const handleClear = () => {
    if (window.confirm('Tüm sınav sonuçları ve istatistikler silinecektir. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
      clearResults().then(() => setResults([]));
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface h-screen flex flex-col overflow-hidden">
      {/* TopAppBar */}
      <WebHeaderMenu/>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-8 px-6 w-full max-w-7xl mx-auto pb-24">
        {/* Dashboard Header */}
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight text-on-surface mb-2">Gelişim Analizi</h1>
            <p className="text-on-surface-variant font-medium text-sm md:text-base">Performansın ve öğrenme eğrin.</p>
          </div>
          {results.length > 0 && (
            <button
              onClick={handleClear}
              className="group flex items-center self-start md:self-auto gap-2 px-4 py-2.5 rounded-2xl bg-white text-red-600 text-[10px] font-extrabold uppercase tracking-widest hover:bg-red-50 border border-red-100 transition-all shadow-sm hover:shadow-red-200/50 active:scale-95"
            >
              <Icon name="delete-sweep" color="#DC2626" size={18} className="group-hover:rotate-12 transition-transform" />
              Geçmişi Temizle
            </button>
          )}
        </section>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Yükleniyor...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <Icon name="quiz" className="text-outline-variant" size={64} />
            <h2 className="text-xl font-bold text-on-surface-variant">Henüz Sınav Yok</h2>
            <p className="text-sm text-outline-variant">İlk sınavını çöz ve istatistiklerin burada görünsün!</p>
            <button onClick={() => router.push('/mode_selection')} className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm">
              Sınav Başlat
            </button>
          </div>
        ) : (
          <>
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Main Chart Card */}
              <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_40px_rgba(25,27,35,0.06)] relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-headline font-bold text-lg">Performans Özeti</h3>
                    <p className="text-xs text-on-surface-variant font-medium">Toplam {totalSolved} Soru Çözüldü</p>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{stats.totalExams} Sınav</span>
                  </div>
                </div>
                {/* Simple visualization */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Doğru', value: stats.totalCorrect, color: 'bg-green-500', textColor: 'text-green-700' },
                    { label: 'Yanlış', value: stats.totalWrong, color: 'bg-red-500', textColor: 'text-red-700' },
                    { label: 'Boş', value: stats.totalEmpty, color: 'bg-gray-400', textColor: 'text-gray-600' },
                    { label: 'Başarı', value: `${overallRate}%`, color: 'bg-primary', textColor: 'text-primary' },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className={`text-2xl font-extrabold ${item.textColor}`}>{item.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-3 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                  {totalSolved > 0 && (
                    <>
                      <div className="h-full bg-green-500 transition-all" style={{ width: `${(stats.totalCorrect / totalSolved) * 100}%` }}></div>
                      <div className="h-full bg-red-500 transition-all" style={{ width: `${(stats.totalWrong / totalSolved) * 100}%` }}></div>
                      <div className="h-full bg-gray-300 transition-all" style={{ width: `${(stats.totalEmpty / totalSolved) * 100}%` }}></div>
                    </>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-primary-container p-6 rounded-xl text-on-primary-container flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="z-10">
                  <Icon name="auto-awesome" size={32} className="mb-4" />
                  <h3 className="font-headline font-bold text-xl mb-1">
                    {overallRate >= 70 ? 'Harika Gidiyorsun!' : overallRate >= 50 ? 'İyi Gidiyorsun!' : 'Devam Et!'}
                  </h3>
                  <p className="text-sm opacity-90">{stats.totalExams} sınav tamamlandı</p>
                </div>
                <div className="mt-6 z-10">
                  <div className="text-4xl font-extrabold tracking-tighter">{stats.totalCorrect}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Doğru Yanıt</div>
                </div>
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                  <Icon name="bubble-chart" size={96} />
                </div>
              </div>
            </div>

            {/* Net Score Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Ort. Net', value: stats.avgNet.toFixed(1), color: 'border-l-primary' },
                { label: 'En İyi Net', value: stats.bestNet.toFixed(1), color: 'border-l-orange-500' },
                { label: 'Ort. Süre', value: stats.avgTimeTaken > 0 ? `${Math.floor(stats.avgTimeTaken / 60)}dk` : '-', color: 'border-l-purple-600' },
              ].map(item => (
                <div key={item.label} className={`bg-surface-container-lowest p-5 rounded-xl shadow-sm border-l-[3px] ${item.color}`}>
                  <div className="text-2xl font-extrabold text-on-surface">{item.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Course Based Analysis */}
            {Object.keys(stats.subjectMap).length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-headline tracking-tight">Ders Bazlı Analiz</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.subjectMap).map(([subject, data]) => {
                    const rate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    const barColor = rate >= 70 ? 'bg-green-600' : rate >= 50 ? 'bg-orange-500' : 'bg-red-500';
                    const textColor = rate >= 70 ? 'text-green-600' : rate >= 50 ? 'text-orange-500' : 'text-red-500';
                    return (
                      <div key={subject} className="bg-surface-container-low p-5 rounded-xl flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                            <Icon name="functions" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface">{subject}</h4>
                            <p className="text-xs text-on-surface-variant">{data.correct + data.wrong + data.empty} Soru • {rate}% Başarı</p>
                          </div>
                        </div>
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${rate}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Recent Exams */}
            <section className="mb-12">
              <h2 className="text-xl font-bold font-headline tracking-tight mb-6">Son Sınavlar</h2>
              <div className="flex flex-col gap-3">
                {results.slice(0, 15).map(r => (
                  <div key={r.id} className="bg-surface-container-lowest p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="text-sm font-bold text-on-surface">
                        {r.examType === 'KONU_TEST' && r.topic ? r.topic : EXAM_LABEL[r.examType] || r.examType}
                      </div>
                      <div className="text-xs text-on-surface-variant mt-1">{formatDate(r.date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-3 text-xs font-bold">
                        <span className="text-green-600">✓{r.correct}</span>
                        <span className="text-red-600">✗{r.wrong}</span>
                        <span className="text-gray-400">—{r.empty}</span>
                      </div>
                      <div className="text-xs text-primary mt-1 font-semibold">Net: {r.netScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Error Pool CTA */}
            <section className="bg-surface-container rounded-3xl p-8 relative overflow-hidden mb-12">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h2 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface mb-3">Hatalarım Havuzu</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    Yanlış çözdüğün sorular tekrar edilmek üzere seni bekliyor. Zayıf noktalarını güçlendirmek için en iyi zaman.
                  </p>
                  <button 
                  onClick={() => router.push('/subject_tree')}
                  className="bg-gradient-to-br from-primary to-primary-container text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-3 active:scale-95 transition-transform">
                    <Icon name="play-circle" color="#FFFFFF" size={20} />
                    Tekrar Etmeye Başla
                  </button>
                </div>
                <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 border-4 border-surface flex items-center justify-center text-red-500">
                    <Icon name="close" size={24} />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-orange-100 border-4 border-surface flex items-center justify-center text-orange-500">
                    <Icon name="priority-high" size={24} />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center text-on-surface-variant font-bold text-sm">
                    +{stats.totalWrong}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            {/* Efficiency Guide Info Area */}
            <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white relative overflow-hidden mb-12 shadow-2xl shadow-indigo-900/20 group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Icon name="auto-awesome" color="#FFFFFF" size={40} className="animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-black font-headline tracking-tight mb-2 uppercase italic flex items-center justify-center md:justify-start gap-2">
                    Verimli Çalışma Rehberi
                    <span className="bg-white/20 text-[10px] py-1 px-2 rounded-lg not-italic font-bold tracking-normal">İPUCU</span>
                  </h2>
                  <p className="text-indigo-100/90 text-sm font-medium leading-relaxed max-w-2xl">
                    Başarı sadece çok çalışmak değil, doğru çalışmaktır. Pomodoro tekniğinden aktif hatırlamaya kadar en güncel teknikleri hemen keşfet!
                  </p>
                </div>
                <a 
                  href="https://www.google.com/search?q=verimli+ders+%C3%A7al%C5%9Fma+teknikleri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-black/10 active:scale-95 whitespace-nowrap"
                >
                  Teknikleri İncele
                </a>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Icon name="rocket-launch" size={180} color="#FFFFFF" />
              </div>
            </section>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
