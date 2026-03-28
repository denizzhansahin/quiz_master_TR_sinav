import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import WebHeaderMenu from '@/components/shared/WebHeaderMenu';

export default function verimliderscalismaPage() {
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
            <h1 className="text-5xl font-black font-headline text-on-surface uppercase italic leading-tight">Verimli Ders Çalışmanın 5 Bilimsel Yolu</h1>
            <p className="text-2xl text-on-surface-variant font-medium leading-relaxed">Feynman ve Cornell Tekniklerini Keşfedin</p>
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
      <h3>1. Feynman Tekniği</h3>
      <p>Bir konuyu gerçekten öğrenmek istiyorsanız, onu 10 yaşındaki bir çocuğa anlatıyormuş gibi basitçe açıklayın. Tıkandığınız yerler, bilginizin eksik olduğu yerlerdir.</p>
      <h3>2. Cornell Not Alma Sistemi</h3>
      <p>Kağıdınızı üç bölüme ayırın: Notlar, Anahtar Kelimeler ve Özet. Bu sistem, dersten sonra konuyu tekrar etmenizi çok kolaylaştırır.</p>
      <h3>3. Aralıklı Tekrar (Spaced Repetition)</h3>
      <p>Öğrendiğiniz bilgiyi 1 gün, 1 hafta ve 1 ay sonra tekrar ederek unutma eğrisini yenin.</p>
      <h3>4. Pomodoro ve Aktif Hatırlama</h3>
      <p>Zamanı yönetin ve kendinizi sürekli sorgulayın.</p>
</div>
              
              
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
