import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import WebHeaderMenu from '@/components/shared/WebHeaderMenu';

export default function kpssdengePage() {
  const router = useRouter();
  return (
    <div className="bg-surface font-body text-on-surface h-screen flex flex-col overflow-hidden">
      <WebHeaderMenu />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="py-12 px-6 w-full max-w-4xl mx-auto space-y-12 pb-24">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-primary font-bold hover:underline transition-all">
            <Icon name="arrow-back" /> Geri Dön
          </button>
          <header className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
               REHBERLİK & STRATEJİ
            </div>
            <h1 className="text-5xl font-black font-headline text-on-surface uppercase italic leading-tight">KPSS'de Genel Kültür ve Genel Yetenek Dengesi</h1>
            <p className="text-2xl text-on-surface-variant font-medium leading-relaxed">Puanınızı Nasıl Maximize Edersiniz?</p>
          </header>
          
          <article className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed space-y-8">
            <div className="p-10 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/15 shadow-2xl shadow-black/[0.02] content-area">
              <style>
                {`.content-area h3 { font-family: 'Outfit', sans-serif; font-weight: 800; color: #1a1c1e; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: -0.02em; }\n` +
                 `.content-area p { margin-bottom: 1.25rem; font-size: 1.125rem; color: #44474e; }\n` +
                 `.content-area ul, .content-area ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }\n` +
                 `.content-area li { margin-bottom: 0.75rem; font-size: 1.125rem; color: #44474e; }\n` +
                 `.content-area b { color: #1a1c1e; }`}
              </style>
                <div>
      <h3>Denge Her Şeydir</h3>
      <p>KPSS'de sadece tek bir alana yüklenmek hata olabilir. GY (Genel Yetenek) ve GK (Genel Kültür) arasındaki dengeyi kurmalısınız.</p>
      <ul>
        <li><b>GY Stratejisi:</b> Türkçe ve Matematik'te hız kazanmak, GK kısmına daha fazla zaman ayırmanızı sağlar.</li>
        <li><b>GK Stratejisi:</b> Tarih ve Coğrafya'yı ezberlemek yerine kronolojik ve harita üzerinden çalışarak kalıcılığı artırın.</li>
      </ul>
      <h3>Vatandaşlık ve Güncel Bilgiler</h3>
      <p>Sınava yakın zamanda en çok puan getiren kısımlardan biri olan güncel bilgilere her gün 15 dakikanızı ayırın.</p>
      <h3>Çıkmış Soruların Gücü</h3>
      <p>ÖSYM'nin soru dilini anlamak için son 10 yılın KPSS sorularını en az 2 kez çözmüş olmalısınız.</p>
</div>
              
              
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
