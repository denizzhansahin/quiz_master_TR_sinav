import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';
import { loadResults, computeStats, QuizResult } from '../../utils/storage';



const NATIVE_GUIDES = [
  { slug: 'yks-maratonu', title: 'YKS MARATONU', sub: 'Derece Yapmanın Formülü', color: '#303F9F', shadow: '#1A237E', icon: 'school' },
  { slug: 'kpss-denge', title: 'KPSS DENGESİ', sub: 'Puanınızı Maximize Edin', color: '#2E7D32', shadow: '#1B5E20', icon: 'account-balance' },
  { slug: 'ales-taktikler', title: 'ALES TAKTİKLERİ', sub: 'Sözel ve Sayısal Mantık', color: '#F57C00', shadow: '#E65100', icon: 'history-edu' },
  { slug: 'quiz-master-test', title: 'AKTİF HATIRLAMA', sub: 'Kendinizi Test Edin', color: '#C2185B', shadow: '#880E4F', icon: 'quiz' },
  { slug: 'odaklanma-sanati', title: 'ODAKLANMA SANATI', sub: 'Pomodoro Tekniği', color: '#0097A7', shadow: '#006064', icon: 'timer' },
  { slug: 'sinav-kazandiran-ikili', title: 'SINAV KAZANDIRAN İKİLİ', sub: 'Birlikte Kullanma Rehberi', color: '#7B1FA2', shadow: '#4A148C', icon: 'auto-awesome' },
  { slug: 'sinav-kaygisi', title: 'SINAV KAYGISI', sub: 'Zihninizi Başarıya Programlayın', color: '#0288D1', shadow: '#01579B', icon: 'psychology' },
  { slug: 'verimli-ders-calisma', title: 'BİLİMSEL ÇALIŞMA', sub: 'Feynman ve Cornell Teknikleri', color: '#E64A19', shadow: '#BF360C', icon: 'biotech' },
  { slug: 'dogru-dinlenme', title: 'DOĞRU DİNLENME', sub: 'Mola Verme Teknikleri', color: '#455A64', shadow: '#263238', icon: 'coffee' },
  { slug: 'yol-haritasi', title: 'YOL HARİTASI', sub: 'Hedef ve Plan Hazırlama', color: '#8E24AA', shadow: '#4A148C', icon: 'map' },
] as const;




import { RewardedAd, RewardedAdEventType, TestIds, InterstitialAd, AdEventType, useForeground } from 'react-native-google-mobile-ads';

// Reklam ID'leri
const rewardedId = (__DEV__ ? TestIds.REWARDED : process.env.homeReward) || TestIds.REWARDED;
const interstitialId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxx/zzz';

// Reklam objelerini bileşen dışında oluşturuyoruz (Pre-loading için)
const rewarded = RewardedAd.createForAdRequest(rewardedId);
const interstitial = InterstitialAd.createForAdRequest(interstitialId);


// 1. En üste importları ekle
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';


// 2. ID'yi tanımla (Test aşamasında TestIds kullanmak güvenlidir)
const bannerAdUnitId = (__DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.homeBanner) || TestIds.ADAPTIVE_BANNER;
const bannerAdUnitIdSticky = (__DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.homeBannerSticky) || TestIds.ADAPTIVE_BANNER;


export default function HomeNativeScreen() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);

  //Banner
  const bannerRef = useRef<BannerAd>(null);

  // iOS'ta uygulama ön plana geldiğinde reklamı tazeleme mantığı
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  useFocusEffect(
    useCallback(() => {
      loadResults().then(setResults);
    }, [])
  );


  
  // Reklamları Yükleme ve Dinleme- Ödüllü Reklam
  const [adLoaded, setAdLoaded] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
      setIsAdLoading(false);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      // Ödül kazanıldı! Şimdi gitmek istediği yere gönderiyoruz.
      // Not: Hangi sayfaya gideceğini bir state'de tutabiliriz.
      console.log('Kullanıcı ödülü kazandı:', reward);
    });

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // Reklam İzlet ve Navigasyon Yap (Özellikle Test Girişi İçin)
  const handleStartAd = (path: string, params?: any) => {
    if (adLoaded) {
      rewarded.show().then(() => {
        // Reklam bittikten veya ödül kazanıldıktan sonra yönlendir
        router.push({ pathname: path as any, params });
        setAdLoaded(false); // Tekrar yüklenmesi için resetle
        rewarded.load(); 
      });
    } else {
      // Reklam henüz yüklenmediyse kullanıcıyı bekletmemek için direkt geçebilir 
      // veya "Yükleniyor..." diyebilirsiniz.
      setIsAdLoading(true);
      rewarded.load();
      router.push({ pathname: path as any, params });
    }
  };
// Reklamları Yükleme ve Dinleme- Ödüllü Reklam





  const stats = computeStats(results);
  const totalSolved = stats.totalCorrect + stats.totalWrong + stats.totalEmpty;
  const successRate = totalSolved > 0 ? Math.round((stats.totalCorrect / totalSolved) * 100) : 0;

  return (
    <SafeAreaView className="flex-1 bg-surface font-body" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface text-on-surface flex-col">
        {/* TopAppBar */}
        <TopAppBarNative />

        <ScrollView className="px-6 pb-12 w-full pt-4 max-w-md self-center">
          <View className="flex flex-col space-y-8 gap-8">
            {/* Welcome Header */}
            <View className="space-y-1">
              <Text className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Hoş Geldiniz</Text>
              <Text className="text-on-surface-variant font-body leading-relaxed max-w-[85%]">Stresten uzak, odaklanmış ve verimli bir hazırlık süreci seni bekliyor.</Text>
            </View>

            {/* Performans Özeti (Dinamik) */}
            <View className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/15">
              <View className="mb-4">
                <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Genel İstatistik</Text>
                <Text className="font-headline text-xl font-bold text-on-surface">Performans Özeti</Text>
              </View>
              <View className="flex-row items-center justify-between mb-4">
                <View className="bg-white p-4 rounded-2xl flex-1 mr-2 shadow-sm border border-outline-variant/5">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Icon name="task-alt" className="text-primary" size={16} />
                    <Text className="text-xs font-medium text-on-surface-variant">Toplam Soru</Text>
                  </View>
                  <Text className="font-bold text-lg text-on-surface">{totalSolved}</Text>
                </View>
                <View className="bg-white p-4 rounded-2xl flex-1 ml-2 shadow-sm border border-outline-variant/5">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Icon name="insights" className="text-secondary" size={16} />
                    <Text className="text-xs font-medium text-on-surface-variant">Başarı Oranı</Text>
                  </View>
                  <Text className="font-bold text-lg text-secondary">%{successRate}</Text>
                </View>
              </View>
              <View className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: `${successRate}%` }}></View>
              </View>
            </View>

            {/* Quick Action CTA */}
            <View>
              <Pressable onPress={() => handleStartAd('/exam')} className="w-full bg-primary py-5 rounded-xl flex-row items-center justify-center gap-3 active:scale-95 transition-transform duration-150" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}>
                <Icon name="rocket-launch" className="text-white text-2xl" />
                <Text className="font-headline font-bold text-lg tracking-wide text-white">RASTGELE TEST ÇÖZ</Text>
              </Pressable>
            </View>




            {/* Reklam Alanı (Ad Placeholder) */}
            {/* ESKİ REKLAM ALANI YERİNE GERÇEK COLLAPSIBLE BANNER */}
            <View className="items-center justify-center my-4 overflow-hidden rounded-2xl">
              <BannerAd
                unitId={bannerAdUnitId}
                // Collapsible için genellikle bu boyut en iyisidir
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} 
                requestOptions={{
                  networkExtras: {
                    collapsible: 'bottom', // Reklam aşağıdan yukarıya doğru genişler
                  },
                }}
                onAdFailedToLoad={(error) => console.error('Banner yüklenemedi:', error)}
              />
            </View>

            {/* Exam Selection */}
            <View className="space-y-4 gap-4">
              <Text className="font-headline font-bold text-xl text-on-surface">Sınav Seçimi</Text>
              <View className="flex flex-col gap-4">
                <Pressable onPress={() => router.push({ pathname: '/mode_selection', params: { examType: 'YKS' } })} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 flex-row items-center gap-5 active:bg-blue-50 transition-colors duration-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
                  <View className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Icon name="school" className="text-3xl text-blue-700" size={32} />
                  </View>
                  <View>
                    <Text className="font-headline font-bold text-on-surface">YÜKSEKÖĞRETİM</Text>
                    <Text className="text-sm text-on-surface-variant font-medium">YKS (TYT - AYT - YDT)</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => router.push({ pathname: '/mode_selection', params: { examType: 'ALES' } })} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 flex-row items-center gap-5 active:bg-blue-50 transition-colors duration-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
                  <View className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <Icon name="history-edu" className="text-3xl text-indigo-700" size={32} />
                  </View>
                  <View>
                    <Text className="font-headline font-bold text-on-surface">AKADEMİK KARİYER</Text>
                    <Text className="text-sm text-on-surface-variant font-medium">ALES, YDS, YÖKDİL</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => router.push({ pathname: '/mode_selection', params: { examType: 'KPSS' } })} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 flex-row items-center gap-5 active:bg-blue-50 transition-colors duration-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
                  <View className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Icon name="work" className="text-3xl text-emerald-700" size={32} />
                  </View>
                  <View>
                    <Text className="font-headline font-bold text-on-surface">KAMU PERSONELİ</Text>
                    <Text className="text-sm text-on-surface-variant font-medium">KPSS Lisans, Önlisans</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Study Tips CTA */}
            <Pressable
              onPress={() => Linking.openURL('https://www.google.com/search?q=verimli+ders+%C3%A7al%C5%9Fma+teknikleri')}
              style={styles.studyCta}
            >
              <View style={styles.studyCtaLeft}>
                <View style={styles.studyIconBox}>
                  <Icon name="auto-awesome" color="#FFFFFF" size={24} />
                </View>
                <View style={styles.studyTextContent}>
                  <Text style={styles.studyCtaTitle}>VERİMLİ ÇALIŞMA REHBERİ</Text>
                  <Text style={styles.studyCtaSub}>En iyi teknikleri hemen keşfet!</Text>
                </View>
              </View>
              <Icon name="chevron-right" color="rgba(255,255,255,0.7)" size={24} />
            </Pressable>

            {/* Feature Promotion Section */}
            <View className="bg-primary/5 rounded-[2.5rem] p-6 flex-col gap-6 border border-primary/10 overflow-hidden">
               <View className="flex-col gap-3">
                  <View className="bg-primary/10 self-start px-3 py-1 rounded-full flex-row items-center gap-2">
                    <Icon name="auto-awesome" className="text-primary" size={14} />
                    <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">Hoş Geldiniz!</Text>
                  </View>
                  <Text className="text-2xl font-headline font-black text-on-surface uppercase italic leading-tight">Ücretsiz ve Hızlı Test Çöz ve Sınavlar ile Hatalarını Tespit Et</Text>
                  <Text className="text-sm text-on-surface-variant leading-relaxed">Hatalarını analiz ediyor, sana özel istatistikler sunuyoruz. Hiçbir konuyu eksik bırakma.</Text>
                  <Pressable onPress={() => router.push('/pages/tanitim' as any)} className="flex-row items-center gap-2 mt-2">
                    <Text className="text-primary font-bold">Daha Fazla Bilgi</Text>
                    <Icon name="arrow-forward" className="text-primary" size={18} />
                  </Pressable>
               </View>
               <View className="w-full h-48 bg-white/50 rounded-2xl overflow-hidden border border-outline-variant/5 shadow-inner items-center justify-center">
                  <Image 
                    source={require('../../assets/images/bilgi.png')} 
                    style={{ width: '100%', height: '100%', opacity: 0.8 }}
                    contentFit="cover"
                  />
               </View>
            </View>

            {/* Additional Guides */}
            <View className="space-y-4 gap-4 mt-2">
              <Text className="font-headline font-bold text-xl text-on-surface">Bilgi Köşesi & Rehberler</Text>
              {NATIVE_GUIDES.map((guide) => (
                <Pressable
                  key={guide.slug} onPress={() => handleStartAd(`/pages/${guide.slug}` as any)}
                  style={[
                    styles.studyCta,
                    { backgroundColor: guide.color, shadowColor: guide.shadow }
                  ]}
                >
                  <View style={styles.studyCtaLeft}>
                    <View style={styles.studyIconBox}>
                      <Icon name={guide.icon} color="#FFFFFF" size={24} />
                    </View>
                    <View style={styles.studyTextContent}>
                      <Text style={styles.studyCtaTitle}>{guide.title}</Text>
                      <Text style={styles.studyCtaSub}>{guide.sub}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" color="rgba(255,255,255,0.7)" size={24} />
                </Pressable>
              ))}
            </View>

            <View className="h-10"></View>
          </View>
        </ScrollView>
        {/* EN ALTTA SABİT (STICKY) NORMAL BANNER */}
        <View style={styles.stickyBannerContainer}>
          <BannerAd
            ref={bannerRef}
            unitId={bannerAdUnitIdSticky}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            onAdFailedToLoad={(error) => console.error(error)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
studyCta: { backgroundColor: '#3949AB', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, elevation: 6, shadowColor: '#303F9F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  studyCtaLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  studyIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  studyTextContent: { gap: 2 },
  studyCtaTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  studyCtaSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '500' },

  stickyBannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // Bazı cihazlarda güvenli alanın (home indicator) üstünde durması için:
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, 
  },
});