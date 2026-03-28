import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Icon from '../../components/icons/Icon';
import { Question, loadQuestions } from '../../utils/storage';

import { RewardedAd, RewardedAdEventType, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Reklam ID'leri
const rewardedId = (__DEV__ ? TestIds.REWARDED : process.env.subjectTreeReward) || TestIds.REWARDED;
const interstitialId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxx/zzz';

// Reklam objelerini bileşen dışında oluşturuyoruz (Pre-loading için)
const rewarded = RewardedAd.createForAdRequest(rewardedId);
const interstitial = InterstitialAd.createForAdRequest(interstitialId);

// 1. En üste importları ekle
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// 2. ID'yi tanımla (Test aşamasında TestIds kullanmak güvenlidir)
const bannerAdUnitId = (__DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.subjectTreeBanner) || TestIds.ADAPTIVE_BANNER;
const bannerAdUnitIdSticky = (__DEV__ ? TestIds.ADAPTIVE_BANNER : process.env.subjectTreeBannerSticky) || TestIds.ADAPTIVE_BANNER;


export default function SubjectTreeNativeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>((params.examType as string) || 'YKS');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  //Banner
  const bannerRef = useRef<BannerAd>(null);

  React.useEffect(() => {
    loadQuestions().then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  // Reklamları Yükleme ve Dinleme
  const [adLoaded, setAdLoaded] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
      setIsAdLoading(false);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
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
        router.push({ pathname: path as any, params });
        setAdLoaded(false);
        rewarded.load();
      });
    } else {
      setIsAdLoading(true);
      rewarded.load();
      router.push({ pathname: path as any, params });
    }
  };

  // Build subject → topics map based on the SELECTED exam
  const subjectTopics = useMemo(() => {
    const map: Record<string, string[]> = {};
    const filteredQuestions = questions.filter(q => q.examType === selectedExamType);

    filteredQuestions.forEach(q => {
      if (!q.subject || !q.topic) return;
      if (!map[q.subject as string]) map[q.subject as string] = [];
      if (!map[q.subject as string].includes(q.topic as string)) map[q.subject as string].push(q.topic as string);
    });
    return map;
  }, [selectedExamType, questions]);

  const subjects = Object.keys(subjectTopics);

  const subjectIcons: Record<string, string> = {
    'Matematik': 'calculate',
    'Türkçe': 'translate',
    'Tarih': 'history-edu',
    'Coğrafya': 'public',
    'Fen Bilimleri': 'science',
  };

  const toggleSubject = (subject: string) => {
    setOpenSubject(openSubject === subject ? null : subject);
  };

  const examTypes = ['YKS', 'KPSS', 'ALES'];
  const activeIndex = examTypes.indexOf(selectedExamType);
  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(`${activeIndex * 33.333}%` as any, { duration: 250 })
    };
  }, [activeIndex]);

  return (
    <SafeAreaView className="flex-1 bg-surface" style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className="flex-1 flex-col bg-surface">
        {/* Top Navigation Bar */}
        <View className="bg-white/80 dark:bg-slate-900/80 z-50 w-full mb-px">
          <View className="flex-row items-center justify-between px-6 py-4 w-full">
            <View className="flex-row items-center gap-3">
              <Icon name="menu-book" className="text-blue-700 dark:text-blue-400" />
              <Text className="font-headline font-bold text-xl text-blue-700 dark:text-blue-400 tracking-tighter">Quiz Master TR</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-5 pt-4 pb-32">
          <View className="mb-6 mt-2">
            <Text className="font-headline text-3xl font-extrabold tracking-tight text-on-surface leading-tight mb-2">Ders Konuları</Text>
            <Text className="text-on-surface-variant text-sm mt-1">Sınav türünü ve odaklanmak istediğin dersi seç.</Text>
          </View>

          {/* Quick Start Buttons - Native Version */}
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-blue-600 p-5 rounded-[2rem] overflow-hidden relative">
              <View className="z-10">
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Hızlı Başlat</Text>
                <Text className="text-white font-headline font-bold text-xl mb-4">Sınav Denemesi</Text>
                <View className="flex-row gap-2">
                  {[
                    { label: 'KPSS', examType: 'KPSS', icon: 'work' },
                    { label: 'YKS', examType: 'YKS', icon: 'school' },
                    { label: 'ALES', examType: 'ALES', icon: 'auto-stories' },
                  ].map(item => (
                    <Pressable
                      key={item.examType}
                      onPress={() => handleStartAd('/quiz_engine', { examType: item.examType })}
                      className="p-2 rounded-xl items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <Icon name={item.icon} size={24} color="white" />
                      <Text className="text-white text-[9px] font-extrabold mt-1">{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </View>

            <View className="bg-white border border-outline-variant/10 p-5 rounded-[2rem] items-center justify-center shadow-sm">
              <Icon name="auto-awesome" className="text-primary mb-1" size={24} />
              <Text className="text-[9px] font-bold uppercase tracking-tighter text-on-surface-variant text-center">Seçili Sınav{"\n"}Soru Sayısı</Text>
              <Text className="text-lg font-bold text-on-surface mt-1">
                {questions.filter(q => q.examType === selectedExamType).length}
              </Text>
            </View>
          </View>

          {/* Banner Ad */}
          <View className="items-center justify-center my-4 overflow-hidden rounded-2xl">
            <BannerAd
              unitId={bannerAdUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                networkExtras: {
                  collapsible: 'bottom',
                },
              }}
              onAdFailedToLoad={(error) => console.error('Banner yüklenemedi:', error)}
            />
          </View>

          {/* Exam Type Tabs */}
          <View className="flex-row items-center bg-surface-container-high rounded-full p-1 mb-6 relative">
            <Animated.View
              className="absolute top-1 bottom-1 w-[33.33%] bg-white rounded-full"
              style={[
                animatedBgStyle,
                { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }
              ]}
            />
            {examTypes.map(type => {
              const isActive = selectedExamType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => {
                    setSelectedExamType(type);
                    setOpenSubject(null);
                  }}
                  className="flex-1 py-3 items-center justify-center z-10"
                >
                  {({ pressed }) => (
                    <Text className={`font-bold text-sm transition-colors ${isActive ? 'text-primary' : pressed ? 'text-primary/60' : 'text-on-surface-variant'}`}>
                      {type}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {subjects.length > 0 ? (
            <View className="space-y-4 gap-4 pb-20">
              {subjects.map(subject => {
                const isOpen = openSubject === subject;
                return (
                  <View
                    key={subject}
                    className="rounded-3xl overflow-hidden"
                    style={[
                      { borderWidth: 1 },
                      isOpen
                        ? { backgroundColor: '#ffffff', borderColor: '#e1e2ec', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 }
                        : { backgroundColor: '#f2f3fd', borderColor: 'transparent' }
                    ]}
                  >
                    <Pressable
                      onPress={() => toggleSubject(subject)}
                      className="w-full px-6 py-5 flex-row items-center justify-between"
                      style={isOpen ? { backgroundColor: '#ffffff' } : undefined}
                    >
                      <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-xl flex items-center justify-center" style={isOpen ? { backgroundColor: '#e6f0fa' } : { backgroundColor: '#e2e8f0' }}>
                          <Icon name={subjectIcons[subject] || 'school'} size={20} color={isOpen ? '#0058be' : '#475569'} />
                        </View>
                        <Text className="font-headline font-bold text-base text-on-surface">{subject}</Text>
                        <Text className="text-xs font-medium text-on-surface-variant">{subjectTopics[subject].length} konu</Text>
                      </View>
                      <Icon name={isOpen ? 'expand-less' : 'expand-more'} color="#424754" />
                    </Pressable>

                    {openSubject === subject && (
                      <View className="px-6 pb-6 pt-2 space-y-4 gap-4 bg-white" style={{ paddingBottom: 24, gap: 16 }}>
                        <Pressable
                          onPress={() => handleStartAd('/quiz_engine', { examType: selectedExamType, subject })}
                          className="w-full py-4 rounded-xl flex-row items-center justify-center gap-2"
                          style={{ backgroundColor: 'rgba(0, 88, 190, 0.1)' }}
                        >
                          <Icon name="play-circle" className="text-primary" size={20} />
                          <Text className="text-primary font-bold text-sm">Tüm {subject} Sorularını Çöz</Text>
                        </Pressable>
                        {subjectTopics[subject].map(topic => (
                          <View key={topic} className="space-y-3 gap-3" style={{ gap: 12 }}>
                            <View className="flex-row justify-between items-center w-full">
                              <Text className="text-sm font-semibold text-on-surface flex-1 mr-3">{topic}</Text>
                              <Text className="text-xs font-bold text-primary">{questions.filter(q => q.examType === selectedExamType && q.subject === subject && q.topic === topic).length} Soru</Text>
                            </View>
                            <View className="flex-row items-center gap-4 w-full">
                              <View className="flex-1 bg-surface-container-high h-2 rounded-full overflow-hidden">
                                <View className="h-full bg-primary/30 rounded-full w-full" />
                              </View>
                              <Pressable
                                onPress={() => handleStartAd('/quiz_engine', { examType: selectedExamType, subject, topic })}
                                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                              >
                                <Icon name="play-arrow" className="text-white text-sm" size={20} />
                              </Pressable>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20 px-10 bg-surface-container-low rounded-[2rem] border border-dashed border-outline-variant/30">
              <View className="w-20 h-20 bg-surface-container-high rounded-full items-center justify-center mb-6">
                <Icon name="search-off" color="#757575" size={40} />
              </View>
              <Text className="text-xl font-bold text-on-surface mb-2">İçerik Bulunamadı</Text>
              <Text className="text-on-surface-variant text-center leading-5">
                Bu sınav tipi için henüz eklenmiş konu bulunmuyor. Lütfen başka bir sınav seçin.
              </Text>
            </View>
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
});