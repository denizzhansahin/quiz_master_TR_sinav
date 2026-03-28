import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import WebHeaderMenu from '@/components/shared/WebHeaderMenu';
import BilgiLogo from '../../assets/images/bilgi.png';
import { Image } from 'expo-image';

export default function TanitimWebPage() {
  const router = useRouter();

  return (
    <div className="bg-surface font-body text-on-surface h-screen flex flex-col overflow-hidden">
      <WebHeaderMenu />

      <main className="flex-1 overflow-y-auto w-full">
        <div className="py-12 px-6 w-full max-w-5xl mx-auto space-y-16 pb-24">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-primary font-bold hover:underline transition-all">
            <Icon name="arrow-back" /> Geri Dön
          </button>

          {/* Hero Section */}
          <header className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              UYGULAMA TANITIMI
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-headline text-on-surface uppercase italic leading-tight tracking-tighter">
              Quiz Master TR<br />
              <span className="text-primary">Başarıya Giden Yol</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
              Türkiye'nin en kapsamlı ve kullanıcı dostu sınav hazırlık platformuyla tanışın.
            </p>
          </header>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/15 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 mb-6">
                <Icon name="auto-stories" size={32} />
              </div>
              <h3 className="text-xl font-bold font-headline mb-3">Geniş Soru Havuzu</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                YKS, KPSS ve ALES için binlerce güncel soru ve detaylı çözümler tek bir yerde.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/15 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 mb-6">
                <Icon name="insights" size={32} />
              </div>
              <h3 className="text-xl font-bold font-headline mb-3">Detaylı İstatistikler</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Hatalarınızı analiz edin, zayıf noktalarınızı keşfedin ve gelişiminizi grafiklerle izleyin.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/15 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-6">
                <Icon name="timer" size={32} />
              </div>
              <h3 className="text-xl font-bold font-headline mb-3">Süre Yönetimi</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Gerçek sınav süresiyle pratik yapın ve soru başına harcadığınız zamanı optimize edin.
              </p>
            </div>
          </section>

          {/* CTA / App Promotion */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-8 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight">Cebindeki Özel Ders Hocası</h2>
                <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl">
                  Yapay zeka detekli analizlerimiz ve kişiselleştirilmiş önerilerimizle sınav maratonunda rakiplerinin önüne geç.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <button onClick={() => router.replace('/subject_tree')} className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl">
                    Hemen Başla
                  </button>
                  <button onClick={() => router.replace('/statistics')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95">
                    İstatistikleri Gör
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full max-w-sm aspect-video bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                <Image
                  alt="Abstract visualization of data and AI"
                  source={BilgiLogo}
                  // object-contain: Görselin tamamını kutuya sığdırır, kırpmaz.
                  className="w-full h-full object-contain opacity-90"
                />
              </div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </section>

          {/* Download Links Placeholder */}
          <section className="text-center space-y-8 pt-12">
            <h3 className="text-3xl font-black font-headline uppercase italic text-on-surface">Uygulamamızı Keşfedin</h3>
            <div className="flex justify-center gap-6">
              <a
                href="https://play.google.com/store/apps/dev?id=9221158722118390923"
                target="_blank"
                rel="noopener noreferrer"
                className="w-64 h-20 bg-black rounded-2xl border border-white/10 flex items-center justify-center gap-4 cursor-pointer hover:bg-zinc-900 transition-all hover:scale-105 shadow-2xl"
              >
                <Icon name="play-arrow" color="white" size={32} />
                <div className="text-left"><p className="text-[10px] text-white/70 uppercase tracking-widest font-black">Google Play'de</p><p className="text-lg font-black text-white">KEŞFEDİN</p></div>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
