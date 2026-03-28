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
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
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

export default function AboutWebScreen() {
  return (
    <SupportPage title="Hakkında" icon="info">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Quiz Master TR Nedir?</h2>
      <p className="mb-6">
        Quiz Master TR, Türkiye'nin eğitim sistemine ve sınav formatlarına (KPSS, YKS, ALES vb.) tam uyumlu, 
        akıllı bir soru çözüm ve gelişim takip platformudur. 
        Amacımız, öğrencilerin eksiklerini veri tabanlı analizlerle belirleyip, sınav maratonunda en verimli yolu izlemelerini sağlamaktır.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
             <Icon name="auto-fix-high" size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Akıllı Analiz</h3>
          <p className="text-sm">Hangi konuda daha çok hata yaptığını biliyoruz ve sana özel geliştirme planları sunuyoruz.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm">
             <Icon name="verified" size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Güncel İçerik</h3>
          <p className="text-sm">Sorularımız en son sınav sistemlerine ve müfredata uygun olarak sürekli güncellenir.</p>
        </div>
      </div>

      <p>
        2026 yılında bir grup yazılımcı tarafından "herkes için kaliteli eğitim" vizyonuyla hayata geçirilmiştir. 
        Milyonlarca adayın sınav kaygısını azaltıp, netlerini artırmak için çalışıyoruz.
      </p>
    </SupportPage>
  );
}
