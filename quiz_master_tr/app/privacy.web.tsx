import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '../components/icons/Icon';
import WebHeaderMenu from '@/components/shared/WebHeaderMenu';

const SupportPage = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <div className="bg-[#F8F9FF] font-body text-slate-800 h-screen flex flex-col overflow-hidden">
      <WebHeaderMenu />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-12 px-6 w-full max-w-3xl mx-auto pb-24">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 mb-8 text-blue-600 font-bold text-sm tracking-tight hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors w-fit"
          >
            <Icon name="arrow-back" size={20} />
            Ayarlara Dön
          </button>
          
          <div className="mb-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-blue-100">
               <Icon name={icon} size={32} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline">{title}</h1>
          </div>

          <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-slate-100 text-slate-600 leading-relaxed font-medium">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function PrivacyWebScreen() {
  return (
    <SupportPage title="Gizlilik" icon="security">
      <div className="flex flex-col gap-6 text-sm text-slate-500">
        <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-widest text-[14px]">Veri İşleme Beyanı</h2>
        <a 
          href="https://www.denizhansahin.com/2026/03/quiz-master-tr-yks-ales-kpss-gizlilik.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-sm text-center transform hover:scale-[1.02] transition-all shadow-lg shadow-blue-100"
        >
          Güncel Yasal Metinler İçin Tıklayınız
        </a>
        
        <section>
          <h3 className="font-bold text-slate-800 mb-2">1. Hangi Verileri Topluyoruz?</h3>
          <p>
            Platformumuzu kullanırken, sadece kullanıcı deneyiminizi geliştirmek ve istatistiklerinizi tutmak adına cihazınızda (local storage) quiz sonuçlarınızı saklıyoruz. 
            Herhangi bir sunucuya şahsi bilginizi şimdilik göndermiyoruz.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-slate-800 mb-2">2. Verilerin Saklanması</h3>
          <p>
            Çözdüğünüz testlerin sonuçları, yanlış cevaplarınız ve başarı oranlarınız sadece sizin tarayıcınızda saklanır. 
            "Verileri Temizle" seçeneğine bastığınızda tüm bu veriler kalıcı olarak silinir.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-slate-800 mb-2">3. Cookieler (Çerezler)</h3>
          <p>
             Web sürümünde, uygulama tercihlerini (örneğin seçilen sınav tipi) hatırlamak adına geçici seans verileri kullanılabilir.
          </p>
        </section>

        <section className="bg-slate-50 p-6 rounded-2xl md:mt-10 border border-slate-100">
          <p className="font-bold text-slate-900 mb-1">Sorularınız İçin:</p>
          <p>Gizlilik beyanımız ile ilgili her türlü sorunuzda bize 
            <a href="mailto:mobilhaber2025@gmail.com" className="text-slate-900 font-bold block mt-1 hover:text-indigo-600 transition-colors">
                  mobilhaber2025@gmail.com
                </a>
             üzerinden ulaşabilirsiniz.</p>
          <p className="mt-4 opacity-50 text-[10px] font-bold uppercase tracking-widest">Son Güncelleme: 24 Mart 2026</p>
        </section>
      </div>
    </SupportPage>
  );
}
