import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '../../components/icons/Icon';
import { loadResults, clearResults, computeStats, QuizResult } from '../../utils/storage';

const SUBJECT_ICONS: Record<string, string> = {
  'Matematik': 'functions',
  'Türkçe': 'translate',
  'Tarih': 'history-edu',
  'Coğrafya': 'public',
  'Fen Bilimleri': 'science',
};

const EXAM_LABEL: Record<string, string> = {
  KPSS: 'KPSS Denemesi',
  YKS: 'YKS Denemesi',
  ALES: 'ALES Denemesi',
  KONU_TEST: 'Konu Testi',
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}






import { RewardedAd, RewardedAdEventType, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Reklam ID'leri
const rewardedId = (__DEV__ ? TestIds.REWARDED : process.env.statisticsReward) || TestIds.REWARDED;
const interstitialId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxx/zzz';

// Reklam objelerini bileşen dışında oluşturuyoruz (Pre-loading için)
const rewarded = RewardedAd.createForAdRequest(rewardedId);
const interstitial = InterstitialAd.createForAdRequest(interstitialId);






// 1. En üste importları ekle
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// 2. ID'yi tanımla (Test aşamasında TestIds kullanmak güvenlidir)
const bannerAdUnitId = (__DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.statisticsBanner) || TestIds.ADAPTIVE_BANNER;
const bannerAdUnitIdSticky = (__DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.statisticsBannerSticky) || TestIds.ADAPTIVE_BANNER;


export default function StatisticsNativeScreen() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

    //Banner
    const bannerRef = useRef<BannerAd>(null);

  // Reload data every time the tab receives focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadResults().then(r => {
        setResults(r);
        setLoading(false);
      });
    }, [])
  );

  const stats = computeStats(results);
  const totalSolved = stats.totalCorrect + stats.totalWrong + stats.totalEmpty;
  const overallRate = totalSolved > 0 ? Math.round((stats.totalCorrect / totalSolved) * 100) : 0;


        // Reklamları Yükleme ve Dinleme
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
              setAdLoaded(false); // Tekrar yüklenmesi için resetle
              rewarded.load(); 

              // Reklam bittikten veya ödül kazanıldıktan sonra yönlendir
              Alert.alert(
                  'Verileri Temizle',
                  'Tüm sınav sonuçları ve istatistikler silinecektir. Bu işlem geri alınamaz.',
                  [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Temizle', style: 'destructive', onPress: async () => {
                      await clearResults();
                      setResults([]);
                    }},
                  ]
                );
            });
          } else {
            // Reklam henüz yüklenmediyse kullanıcıyı bekletmemek için direkt geçebilir 
            // veya "Yükleniyor..." diyebilirsiniz.
            setIsAdLoading(true);
            rewarded.load();
            Alert.alert(
                  'Verileri Temizle',
                  'Tüm sınav sonuçları ve istatistikler silinecektir. Bu işlem geri alınamaz.',
                  [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Temizle', style: 'destructive', onPress: async () => {
                      await clearResults();
                      setResults([]);
                    }},
                  ]
                );
          }
        };


        // Reklam İzlet ve Navigasyon Yap (Özellikle Test Girişi İçin)
      const handleStartAdPush = (path: string, params?: any) => {
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Icon name="analytics" color="#1565C0" size={22} />
            <Text style={styles.headerTitle}>İstatistikler</Text>
          </View>
          {results.length > 0 && (
            <Pressable
              onPress={() => handleStartAd('/statistics')}
              style={styles.clearBtn}
            >
              <Icon name="delete-outline" color="#D32F2F" size={16} />
              <Text style={styles.clearBtnText}>Temizle</Text>
            </Pressable>
          )}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Yükleniyor...</Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyBox}>
              <Icon name="quiz" color="#BDBDBD" size={48} />
              <Text style={styles.emptyTitle}>Henüz Sınav Yok</Text>
              <Text style={styles.emptySubtext}>İlk sınavını çöz ve istatistiklerin burada görünsün!</Text>
            </View>
          ) : (
            <>
              {/* Hero Stats Card */}
              <View style={styles.heroCard}>
                <View style={styles.heroLeft}>
                  <Text style={styles.heroLabel}>BAŞARI DURUMU</Text>
                  <Text style={styles.heroTitle}>{overallRate >= 70 ? 'Harika Gidiyorsun!' : overallRate >= 50 ? 'İyi Gidiyorsun!' : 'Devam Et!'}</Text>
                  <Text style={styles.heroSub}>{stats.totalExams} sınav · {totalSolved} soru çözüldü</Text>
                </View>
                <View style={styles.heroRight}>
                  <Text style={styles.heroStat}>{stats.totalCorrect}</Text>
                  <Text style={styles.heroStatLabel}>Doğru</Text>
                </View>
                <View style={styles.heroDecor} />
              </View>

              {/* Summary Row */}
              <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { borderLeftColor: '#388E3C' }]}>
                  <Text style={styles.summaryNum}>{stats.totalCorrect}</Text>
                  <Text style={styles.summaryLabel}>Doğru</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#D32F2F' }]}>
                  <Text style={styles.summaryNum}>{stats.totalWrong}</Text>
                  <Text style={styles.summaryLabel}>Yanlış</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#9E9E9E' }]}>
                  <Text style={styles.summaryNum}>{stats.totalEmpty}</Text>
                  <Text style={styles.summaryLabel}>Boş</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#1565C0' }]}>
                  <Text style={styles.summaryNum}>{overallRate}%</Text>
                  <Text style={styles.summaryLabel}>Başarı</Text>
                </View>
              </View>

              {/* Net Score & Time Stats */}
              <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { borderLeftColor: '#1565C0' }]}>
                  <Text style={styles.summaryNum}>{stats.avgNet.toFixed(1)}</Text>
                  <Text style={styles.summaryLabel}>Ort. Net</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#F57C00' }]}>
                  <Text style={styles.summaryNum}>{stats.bestNet.toFixed(1)}</Text>
                  <Text style={styles.summaryLabel}>En İyi Net</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#7B1FA2' }]}>
                  <Text style={styles.summaryNum}>{stats.avgTimeTaken > 0 ? `${Math.floor(stats.avgTimeTaken / 60)}dk` : '-'}</Text>
                  <Text style={styles.summaryLabel}>Ort. Süre</Text>
                </View>
              </View>

              {/* Subject Analysis */}
              {Object.keys(stats.subjectMap).length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ders Bazlı Analiz</Text>
                  {Object.entries(stats.subjectMap).map(([subject, data]) => {
                    const rate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    const icon = SUBJECT_ICONS[subject] || 'school';
                    return (
                      <View key={subject} style={styles.subjectCard}>
                        <View style={styles.subjectLeft}>
                          <View style={styles.subjectIconBox}>
                            <Icon name={icon} color="#1565C0" size={18} />
                          </View>
                          <View>
                            <Text style={styles.subjectName}>{subject}</Text>
                            <Text style={styles.subjectSub}>{data.correct + data.wrong + data.empty} soru çözüldü</Text>
                          </View>
                        </View>
                        <Text style={[styles.subjectRate, { color: rate >= 70 ? '#388E3C' : rate >= 50 ? '#F57C00' : '#D32F2F' }]}>{rate}%</Text>
                        <View style={styles.progressBg}>
                          <View style={[styles.progressFill, { width: `${rate}%` as any, backgroundColor: rate >= 70 ? '#388E3C' : rate >= 50 ? '#F57C00' : '#D32F2F' }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Recent Exams */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Son Sınavlar</Text>
                {results.slice(0, 10).map(r => (
                  <View key={r.id} style={styles.examCard}>
                    <View style={styles.examLeft}>
                      <Text style={styles.examType}>{r.examType === 'KONU_TEST' && r.topic ? r.topic : EXAM_LABEL[r.examType] || r.examType}</Text>
                      <Text style={styles.examDate}>{formatDate(r.date)}</Text>
                    </View>
                    <View style={styles.examRight}>
                      <View style={styles.examStats}>
                        <Text style={styles.examCorrect}>✓{r.correct}</Text>
                        <Text style={styles.examWrong}>✗{r.wrong}</Text>
                        <Text style={styles.examEmpty}>—{r.empty}</Text>
                      </View>
                      <Text style={styles.examNet}>Net: {r.netScore}</Text>
                    </View>
                  </View>
                ))}
              </View>

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
          
              {/* Error Pool CTA */}
              <Pressable
              onPress={() => handleStartAdPush('/subject_tree')}
               style={styles.errorPoolCard}>
                <View style={styles.errorPoolContent}>
                  <Text style={styles.errorPoolTitle}>Hatalarım Havuzu</Text>
                  <Text style={styles.errorPoolSub}>Yanlış çözdüğün soruları tekrar ederek zayıf noktalarını güçlendir.</Text>
                  <Pressable style={styles.errorPoolBtn}>
                    <Icon name="play-arrow" color="#FFFFFF" size={18} />
                    <Text style={styles.errorPoolBtnText}>TEKRAR ET</Text>
                  </Pressable>
                </View>
                <View style={styles.errorPoolBadge}>
                  <Text style={styles.errorPoolCount}>+{stats.totalWrong}</Text>
                </View>
              </Pressable>

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

              <View style={{ height: 48 }} />
            </>
          )}
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
    stickyBannerContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignItems: 'center',
      backgroundColor: 'transparent',
      // Bazı cihazlarda güvenli alanın (home indicator) üstünde durması için:
      paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
  safeArea: { flex: 1, backgroundColor: '#F8F9FF' },
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E8EAF6', elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#212121', letterSpacing: -0.3 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#FFEBEE' },
  clearBtnText: { fontSize: 12, fontWeight: '700', color: '#D32F2F' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#9E9E9E' },
  emptyText: { fontSize: 14, fontWeight: '500', color: '#9E9E9E' },
  emptySubtext: { fontSize: 13, color: '#BDBDBD', textAlign: 'center', lineHeight: 20 },
  heroCard: { backgroundColor: '#1565C0', borderRadius: 24, padding: 22, flexDirection: 'row', alignItems: 'flex-start', overflow: 'hidden', marginBottom: 4 },
  heroLeft: { flex: 1, paddingRight: 12 },
  heroLabel: { color: '#90CAF9', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  heroSub: { color: '#BBDEFB', fontSize: 12, fontWeight: '500' },
  heroRight: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 12, alignItems: 'center' },
  heroStat: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', lineHeight: 30 },
  heroStatLabel: { color: '#BBDEFB', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  heroDecor: { position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)' },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  summaryNum: { fontSize: 18, fontWeight: '800', color: '#212121' },
  summaryLabel: { fontSize: 10, fontWeight: '600', color: '#9E9E9E', textTransform: 'uppercase' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#212121', letterSpacing: -0.2, marginBottom: 4 },
  subjectCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  subjectLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
  subjectIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center' },
  subjectName: { fontSize: 13, fontWeight: '700', color: '#212121' },
  subjectSub: { fontSize: 11, color: '#9E9E9E', fontWeight: '500' },
  subjectRate: { fontSize: 15, fontWeight: '800' },
  progressBg: { height: 6, backgroundColor: '#F5F5F5', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 4 },
  examCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  examLeft: { flex: 1 },
  examType: { fontSize: 13, fontWeight: '700', color: '#212121' },
  examDate: { fontSize: 11, color: '#9E9E9E', marginTop: 2 },
  examRight: { alignItems: 'flex-end', gap: 2 },
  examStats: { flexDirection: 'row', gap: 8 },
  examCorrect: { fontSize: 12, fontWeight: '700', color: '#388E3C' },
  examWrong: { fontSize: 12, fontWeight: '700', color: '#D32F2F' },
  examEmpty: { fontSize: 12, fontWeight: '700', color: '#9E9E9E' },
  examNet: { fontSize: 11, fontWeight: '600', color: '#1565C0' },
  errorPoolCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 8 },
  errorPoolContent: { flex: 1, paddingRight: 16 },
  errorPoolTitle: { fontSize: 18, fontWeight: '800', color: '#212121', marginBottom: 4 },
  errorPoolSub: { fontSize: 12, color: '#757575', marginBottom: 12, lineHeight: 18 },
  errorPoolBtn: { alignSelf: 'flex-start', backgroundColor: '#1565C0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorPoolBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  errorPoolBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFEBEE', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFF' },
  errorPoolCount: { color: '#D32F2F', fontSize: 16, fontWeight: '900' },
  studyCta: { backgroundColor: '#3949AB', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, elevation: 6, shadowColor: '#303F9F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  studyCtaLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  studyIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  studyTextContent: { gap: 2 },
  studyCtaTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  studyCtaSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '500' },
});



