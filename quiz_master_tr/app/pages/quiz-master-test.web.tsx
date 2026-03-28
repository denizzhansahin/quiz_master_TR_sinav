import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import WebHeaderMenu from '@/components/shared/WebHeaderMenu';

export default function quizmastertestPage() {
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
            <h1 className="text-5xl font-black font-headline text-on-surface uppercase italic leading-tight">Quiz Master TR ile Kendinizi Test Edin!</h1>
            <p className="text-2xl text-on-surface-variant font-medium leading-relaxed">Aktif Hatırlama ile Başarınızı Artırın</p>
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
      <h3>Aktif Hatırlama (Active Recall) Nedir?</h3>
      <p>Bilgiyi sadece okumak pasif bir eylemdir. Bilgiyi zihninizden zorla geri çağırmak ise öğrenmenin en etkili yoludur. Quiz Master TR tam olarak bunu yapmanızı sağlar.</p>
      <h3>Nasıl Kullanmalısınız?</h3>
      <ul>
        <li><b>Konu Sonrası Test:</b> Bir konuyu çalıştıktan hemen sonra o konuyla ilgili testi çözün.</li>
        <li><b>Yanlış Odaklı Çalışma:</b> Uygulamadaki istatistiklerinizi inceleyerek en çok hata yaptığınız alt konuları belirleyin.</li>
        <li><b>Kendi Denemenizi Yapın:</b> Rastgele modunu kullanarak sınav stresini simüle edin.</li>
      </ul>
      <p>Öğrendiğiniz her şeyi anında test ederek kalıcı hafızaya aktarın.</p>
</div>
              
              <div className="mt-12 flex justify-center"><a href="https://qmtestsinav.linksphere.tr" target="_blank" className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">Resmi Sayfayı İncele</a></div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
