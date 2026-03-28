import React, { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from '../../components/icons/Icon';
import { loadResults, computeStats, QuizResult } from '../../utils/storage';
import WebHeaderMenu from '../../components/shared/WebHeaderMenu';
import BilgiLogo from '../../assets/images/bilgi.png';
import { Image } from 'expo-image';

const GUIDES = [
  { slug: 'yks-maratonu', title: 'YKS Maratonu', sub: 'Derece Yapmanın Formülü', color: 'from-blue-600 via-blue-700 to-indigo-800', icon: 'school' },
  { slug: 'kpss-denge', title: 'KPSS Dengesi', sub: 'Puanınızı Maximize Edin', color: 'from-emerald-600 via-emerald-700 to-teal-800', icon: 'account-balance' },
  { slug: 'ales-taktikler', title: 'ALES Taktikleri', sub: 'Sözel ve Sayısal Mantık', color: 'from-amber-600 via-amber-700 to-orange-800', icon: 'history-edu' },
  { slug: 'quiz-master-test', title: 'Aktif Hatırlama', sub: 'Kendinizi Test Edin', color: 'from-rose-600 via-rose-700 to-pink-800', icon: 'quiz' },
  { slug: 'odaklanma-sanati', title: 'Odaklanma Sanatı', sub: 'Pomodoro Tekniği', color: 'from-cyan-600 via-cyan-700 to-blue-800', icon: 'timer' },
  { slug: 'sinav-kazandiran-ikili', title: 'Sınav Kazandıran İkili', sub: 'Birlikte Kullanma Rehberi', color: 'from-violet-600 via-violet-700 to-purple-800', icon: 'auto-awesome' },
  { slug: 'sinav-kaygisi', title: 'Sınav Kaygısı', sub: 'Zihninizi Başarıya Programlayın', color: 'from-sky-600 via-sky-700 to-blue-900', icon: 'psychology' },
  { slug: 'verimli-ders-calisma', title: 'Bilimsel Çalışma', sub: 'Feynman ve Cornell Teknikleri', color: 'from-orange-600 via-orange-700 to-red-800', icon: 'biotech' },
  { slug: 'dogru-dinlenme', title: 'Doğru Dinlenme', sub: 'Mola Verme Teknikleri', color: 'from-slate-600 via-slate-700 to-slate-900', icon: 'coffee' },
  { slug: 'yol-haritasi', title: 'Yol Haritası', sub: 'Hedef ve Plan Hazırlama', color: 'from-fuchsia-600 via-fuchsia-700 to-pink-900', icon: 'map' },
] as const;


export default function HomeWebScreen() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadResults().then(setResults);
    }, [])
  );

  const stats = computeStats(results);
  const totalSolved = stats.totalCorrect + stats.totalWrong + stats.totalEmpty;
  const successRate = totalSolved > 0 ? Math.round((stats.totalCorrect / totalSolved) * 100) : 0;

  return (
    <div className="bg-surface font-body text-on-surface h-screen flex flex-col overflow-hidden">
      {/* TopAppBar */}
      <WebHeaderMenu />

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="py-8 px-6 w-full max-w-7xl mx-auto space-y-10 pb-24">
          {/* Welcome Hero & Stats */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] shadow-[0_20px_40px_rgba(25,27,35,0.06)] relative overflow-hidden group">
              <div className="relative z-10">
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-3">Hoş Geldiniz</h1>
                <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">Zihinsel kapasitenizi artırın ve sınavlara stressiz hazırlanın.</p>
                <div className="mt-8 flex gap-4">
                  <button onClick={() => router.push('/exam')} className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                    <Icon name="play-arrow" color="#FFFFFF" />
                    Rastgele Test Çöz
                  </button>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl group-hover:bg-primary-container/10 transition-colors"></div>
            </div>
            {/* Desktop Stats Panel */}
            <div className="bg-surface-container-low p-8 rounded-[2rem] flex flex-col justify-between border border-outline-variant/15">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Genel İstatistik</p>
                  <h2 className="font-headline text-2xl font-bold text-on-surface">Performans Özeti</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                      <Icon name="task-alt" className="text-primary text-lg" size={20} />
                      Toplam Soru
                    </span>
                    <span className="font-bold text-lg text-on-surface">{totalSolved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                      <Icon name="insights" className="text-secondary text-lg" size={20} />
                      Başarı Oranı
                    </span>
                    <span className="font-bold text-lg text-secondary">%{successRate}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-outline-variant/15">
                <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-primary to-primary-container rounded-full" style={{ width: `${successRate}%` }}></div>
                </div>
              </div>
            </div>
          </section>



          {/* Exam Selection Cards */}
          <section>
            <div className="flex items-end justify-between mb-8 px-1">
              <div>
                <h3 className="font-headline text-2xl font-extrabold tracking-tight">Sınav Seçimi</h3>
                <p className="text-on-surface-variant text-sm mt-1">Hangi hedefe odaklanmak istersiniz?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* YKS Card */}
              <button onClick={() => router.push({ pathname: '/mode_selection', params: { examType: 'YKS' } })} className="group flex flex-col text-left focus:outline-none">
                <div className="w-full aspect-[4/2] bg-surface-container rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:bg-white border border-transparent group-hover:border-primary/10">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon name="school" size={32} />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Yükseköğretim</span>
                    <h4 className="font-headline text-4xl font-extrabold mb-4">YKS</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">TYT, AYT ve YDT kapsamlı çalışma setleri ve denemeler.</p>
                  </div>
                </div>
              </button>
              {/* ALES Card */}
              <button onClick={() => router.push({ pathname: '/mode_selection', params: { examType: 'ALES' } })} className="group flex flex-col text-left focus:outline-none">
                <div className="w-full aspect-[4/2] bg-surface-container rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:bg-white border border-transparent group-hover:border-primary/10">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon name="auto-stories" size={32} />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Akademik Kariyer</span>
                    <h4 className="font-headline text-4xl font-extrabold mb-4">ALES</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Sayısal ve sözel mantık odaklı gelişmiş soru bankası.</p>
                  </div>
                </div>
              </button>
              {/* KPSS Card */}
              <button onClick={() => router.push({ pathname: '/mode_selection', params: { examType: 'KPSS' } })} className="group flex flex-col text-left focus:outline-none">
                <div className="w-full aspect-[4/2] bg-surface-container rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:bg-white border border-transparent group-hover:border-primary/10">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon name="account-balance" size={32} />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Kamu Personeli</span>
                    <h4 className="font-headline text-4xl font-extrabold mb-4">KPSS</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Genel Kültür ve Genel Yetenek üzerine binlerce güncel soru.</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Feature Promotion */}
          <section className="bg-primary/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Icon name="auto-awesome" size={16} />
                Hoş Geldiniz!
              </div>
              <h3 className="font-headline text-3xl font-bold leading-tight">Ücretsiz ve Hızlı Test Çöz  ve Sınavlar ile Hatalarını Tespit Et</h3>
              <p className="text-on-surface-variant leading-relaxed">Hatalarını analiz ediyor, sana özel istatistikler sunuyoruz. Hiçbir konuyu eksik bırakma.</p>
              <button onClick={() => router.push('/pages/tanitim' as any)} className="text-primary font-bold flex items-center gap-2 group">
                Daha Fazla Bilgi
                <Icon name="arrow-forward" className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="flex-1 w-full max-w-xs aspect-square bg-white/50 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
              <Image
                alt="Abstract visualization of data and AI"
                source={BilgiLogo}
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>
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

          {/* New Topics/Guides Area */}
          <div className="pt-8 border-t border-outline-variant/15">
            <h3 className="font-headline text-2xl font-extrabold tracking-tight mb-8">Bilgi Köşesi & Rehberler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GUIDES.map((guide) => (
                <button
                  key={guide.slug}
                  onClick={() => router.push(`/pages/${guide.slug}` as any)}
                  className={`bg-gradient-to-r ${guide.color} rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-black/5 group hover:scale-[1.02] transition-all duration-300 text-left`}
                >
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                      <Icon name={guide.icon} color="#FFFFFF" size={30} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black font-headline tracking-tight uppercase italic flex items-center gap-2">
                        {guide.title}
                        <span className="bg-white/20 text-[8px] py-1 px-2 rounded-md not-italic font-bold">REHBER</span>
                      </h4>
                      <p className="text-white/80 text-xs font-medium leading-relaxed max-w-[200px]">
                        {guide.sub}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-[-10px] right-[-10px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Icon name={guide.icon} size={100} color="#FFFFFF" />
                  </div>
                </button>
              ))}
            </div>
          </div>


        </div>
      </main>
    </div>
  );
}
