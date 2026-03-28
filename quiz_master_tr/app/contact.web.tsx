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
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
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

export default function ContactWebScreen() {
  return (
    <SupportPage title="İletişim" icon="mail">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Bize Yazın</h2>
          <p className="text-sm">Sorularınız, iş birliği teklifleri veya sadece bir "merhaba" için her zaman buradayız.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex gap-4 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                <Icon name="email" size={48} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">E-posta</span>
                <a href="mailto:mobilhaber2025@gmail.com" className="text-slate-900 font-bold block mt-1 hover:text-indigo-600 transition-colors">
                  mobilhaber2025@gmail.com
                </a>
              </div>
           </div>

           <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                <Icon name="public" size={48} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sosyal Medya</span>
                <a 
                  href="https://instagram.com/spaceteknopoli" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-900 font-bold block mt-1 hover:text-blue-600 transition-colors"
                >
                  @spaceteknopoli
                </a>
              </div>
           </div>
        </div>


      </div>
    </SupportPage>
  );
}
