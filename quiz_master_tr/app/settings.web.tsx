import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '../components/icons/Icon';
import { syncQuestions, getSyncUrl, saveSyncUrl, DEFAULT_SYNC_URL, loadQuestions, resetQuestions } from '../utils/storage';
import { StyleSheet } from 'react-native';

import WebHeaderMenu from '@/components/shared/WebHeaderMenu';
import Logo from '../assets/images/logo.png';
import { Image } from 'expo-image';

export default function SettingsWebScreen() {
  const router = useRouter();
  const [syncing, setSyncing] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [inputUrl, setInputUrl] = React.useState('');
  const [totalQuestions, setTotalQuestions] = React.useState(0);

  const refreshData = React.useCallback(async () => {
    const questions = await loadQuestions();
    setTotalQuestions(questions.length);
    const url = await getSyncUrl();
    setCurrentUrl(url);
    setInputUrl(url);
  }, []);

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncQuestions(currentUrl);
      window.alert(`Senkronizasyon Başarılı!\n${result.added} yeni soru eklendi.\nToplam soru sayısı: ${result.total}`);
      setTotalQuestions(result.total);
    } catch (error) {
      window.alert('Senkronizasyon hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveUrl = async () => {
    if (!inputUrl.trim()) return;
    await saveSyncUrl(inputUrl);
    setCurrentUrl(inputUrl);
    window.alert('Senkronizasyon adresi başarıyla kaydedildi.');
  };

  const handleResetUrl = async () => {
    await saveSyncUrl(DEFAULT_SYNC_URL);
    setCurrentUrl(DEFAULT_SYNC_URL);
    setInputUrl(DEFAULT_SYNC_URL);
    window.alert('Senkronizasyon adresi varsayılana döndürüldü.');
  };

  const handleResetQuestions = async () => {
    if (window.confirm('Tüm soruları silip varsayılan sorulara dönmek istediğinize emin misiniz?')) {
      const count = await resetQuestions();
      setTotalQuestions(count);
      window.alert(`Sıfırlama Başarılı!\n${count} varsayılan soru yüklendi.`);
    }
  };

  const settingsItems = [
    { title: 'Hakkında', icon: 'info', route: '/about' },
    { title: 'İletişim', icon: 'mail', route: '/contact' },
    { title: 'Gizlilik Politikası', icon: 'security', route: '/privacy' },
  ];

  const actionItems = [
    { title: 'Soruları Güncelle', icon: 'sync', action: handleSync, loading: syncing },
    { title: 'Varsayılan Sorulara Dön', icon: 'refresh', action: handleResetQuestions, loading: false },
  ];

  return (
    <div className="bg-[#F8F9FF] font-body text-slate-800 h-screen flex flex-col overflow-hidden">
      <WebHeaderMenu />

      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-12 px-6 w-full max-w-2xl mx-auto pb-24">

          {/* App Branding Info */}
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="w-48 h-48 rounded-[2.5rem] flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform">
              <Image
                source={Logo}
                alt="Quiz Logo"
                contentFit="contain"
                style={styles.promoImage}
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline mb-2">Quiz Master TR</h1>
            <p className="text-slate-500 font-medium max-w-sm">
              Türkiye'nin en kapsamlı sınav hazırlık platformu. Hayallerine giden yolda yanındayız.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-widest">
                Sürüm 1.0.0
              </div>
              <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-widest">
                {totalQuestions} Soru Mevcut
              </div>
            </div>
          </div>

          {/* Settings Group */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Bilgi ve Destek</span>
            </div>
            {settingsItems.map((item, index) => (
              <button
                key={item.title}
                onClick={() => router.push(item.route as any)}
                className={`w-full flex items-center justify-between p-5 hover:bg-blue-50/50 transition-all group ${index !== settingsItems.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon name={item.icon} size={20} />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{item.title}</span>
                </div>
                <Icon name="chevron-right" className="text-slate-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" size={20} />
              </button>
            ))}
          </div>

          {/* Sync Source Config Group */}
          <div className="mt-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Sunucu Ayarları</span>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">GitHub JSON Veri Kaynağı</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://raw.githubusercontent.com/..."
                  className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveUrl}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Kaydet
                </button>
                <button
                  onClick={handleResetUrl}
                  className="px-6 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
                >
                  Sıfırla
                </button>
              </div>
              <p className="mt-4 text-[11px] text-slate-400 font-medium italic">
                * Senkronizasyon sistemimiz varsayılan olarak bizim GitHub depomuzdaki güncel soruları çeker. Kendi verilerinizi çekmek için linki değiştirebilirsiniz.
              </p>
            </div>
          </div>

          {/* Actions Group */}
          <div className="mt-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Veri Yönetimi</span>
            </div>
            {actionItems.map((item, index) => (
              <button
                key={item.title}
                onClick={item.action}
                disabled={item.loading}
                className={`w-full flex items-center justify-between p-5 hover:bg-blue-50/50 transition-all group ${index !== actionItems.length - 1 ? 'border-b border-slate-50' : ''} ${item.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {item.loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 group-hover:border-white"></div>
                    ) : (
                      <Icon name={item.icon} size={20} />
                    )}
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {item.loading ? 'Güncelleniyor...' : item.title}
                  </span>
                </div>
                {!item.loading && <Icon name="chevron-right" className="text-slate-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" size={20} />}
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs font-medium">
              &copy; 2026 Quiz Master TR. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


const styles = StyleSheet.create({
  promoImage: { width: '100%', height: '100%', opacity: 0.9 }
});