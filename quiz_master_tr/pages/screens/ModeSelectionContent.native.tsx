import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/icons/Icon';
import questionsData from '../../assets/data/questions.json';

import { useSafeAreaInsets } from 'react-native-safe-area-context';




import { RewardedAd, RewardedAdEventType, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Reklam ID'leri
const rewardedId = (__DEV__ ? TestIds.REWARDED : process.env.modeSelectionReward) || TestIds.REWARDED;
const interstitialId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxx/zzz';

// Reklam objelerini bileşen dışında oluşturuyoruz (Pre-loading için)
const rewarded = RewardedAd.createForAdRequest(rewardedId);
const interstitial = InterstitialAd.createForAdRequest(interstitialId);

export default function ModeSelectionNativeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const examType = (params.examType as string) || 'KPSS';
  const [selectedMode, setSelectedMode] = useState('focused');




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



const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  const examLabels: Record<string, { title: string; desc: string; icon: string }> = {
    YKS: { title: 'YKS Sınavı', desc: 'TYT-AYT müfredatına uygun tüm derslerden sorular', icon: 'school' },
    KPSS: { title: 'KPSS Sınavı', desc: 'Genel Yetenek ve Genel Kültür sorularından oluşan test', icon: 'work' },
    ALES: { title: 'ALES Sınavı', desc: 'Sözel ve Sayısal yetenek sorularından oluşan test', icon: 'history-edu' },
    RASTGELE: { title: 'Genel Test', desc: 'Tüm derslerden karışık sorular', icon: 'shuffle' },
  };
  const currentExam = examLabels[examType] || { title: 'Genel Test', desc: 'Tüm derslerden karışık sorular', icon: 'quiz' };
  const totalQuestions = questionsData.length;


  return (
    <SafeAreaView style={{ paddingBottom: bottomInset }} className="flex-1 bg-surface font-body" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface text-on-surface flex flex-col">
        {/* Top Navigation Bar */}
        <View className="z-50 bg-white/80 dark:bg-slate-900/80 shadow-sm dark:shadow-none flex-row items-center justify-between px-6 h-16 w-full">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} className="active:scale-95 duration-200 p-2">
              <Icon name="close" className="text-on-surface" />
            </Pressable>
          </View>
          <Text className="font-headline font-bold tracking-tight text-on-surface text-lg">Quiz Master TR</Text>
          <View className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container">
            <Image 
              className="w-full h-full object-cover" 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDukfigJsN5JopzBrgfcmDHBI-pRqBNoYoeP1FpsPfPtSrBLbwmdUXnuVUuTq7UyGBswNnmG5Lgaa92D4DelmeJjksceZ-adaBWAX1d-HrqiiPw1H-WLZmiMqweTNbrHtXhelYF7lgx2Wv-kkhLSDK-Kie_-rBfC9OIicwwty4EDN-9pjb8x7KbFG3a_enRuaALNOo1ltOohBcNo6q9vrmcu7Rdjph1XoQPzvxVOCoewcegopaCCO7z-PiKbdZjcSsO70_w7FGQ9VHc" }} 
            />
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-grow pt-4 pb-32 px-6 w-full max-w-md self-center">
          <View className="mb-8 mt-4">
            <Text className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-3">Sınav Modu Seçimi</Text>
            <View className="flex-row items-start gap-3 p-4 rounded-xl bg-surface-container-low">
              <Icon name={currentExam.icon} className="text-primary mt-0.5" size={20} />
              <Text className="text-sm text-on-surface-variant font-medium flex-1">
                {currentExam.title} — {currentExam.desc}
              </Text>
            </View>
          </View>

          <View className="space-y-4 flex flex-col gap-4">
            {/* Option 1: Topic Focused */}
            <Pressable onPress={() => setSelectedMode('focused')} className="block relative group">
              <View className={`p-6 rounded-2xl bg-surface-container-lowest transition-all duration-300 border-2 shadow-sm ring-1 ring-black/5 ${selectedMode === 'focused' ? 'border-primary bg-white shadow-xl' : 'border-transparent'}`}>
                <View className="flex-row justify-between items-start mb-4">
                  <View className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name="book" className="text-primary" size={28} />
                  </View>
                  <View className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMode === 'focused' ? 'border-primary' : 'border-outline-variant group-hover:border-primary'}`}>
                    <View className={`h-3 w-3 rounded-full bg-primary transition-transform duration-200 ${selectedMode === 'focused' ? 'scale-100' : 'scale-0'}`}></View>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-lg font-headline font-bold text-on-surface">Konu Odaklı Çöz</Text>
                  <View className="bg-primary-container rounded-full px-2 py-0.5"><Text className="text-xs font-bold text-on-primary-container">{totalQuestions} Soru</Text></View>
                </View>
                <Text className="text-sm text-on-surface-variant leading-relaxed">
                  {currentExam.title} kapsamında odaklanmış uzmanlık soruları.
                </Text>
              </View>
            </Pressable>

            {/* Option 2: Mixed Solving */}
            <Pressable onPress={() => setSelectedMode('mixed')} className="block relative group">
              <View className={`p-6 rounded-2xl bg-surface-container-lowest transition-all duration-300 border-2 shadow-sm ring-1 ring-black/5 ${selectedMode === 'mixed' ? 'border-secondary bg-white shadow-xl' : 'border-transparent'}`}>
                <View className="flex-row justify-between items-start mb-4">
                  <View className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
                    <Icon name="shuffle" className="text-green-700" size={28} />
                  </View>
                  <View className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMode === 'mixed' ? 'border-secondary' : 'border-outline-variant group-hover:border-secondary'}`}>
                    <View className={`h-3 w-3 rounded-full bg-secondary transition-transform duration-200 ${selectedMode === 'mixed' ? 'scale-100' : 'scale-0'}`}></View>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-lg font-headline font-bold text-on-surface">Karışık Çöz</Text>
                  <View className="bg-secondary px-2 py-0.5 rounded-full"><Text className="text-xs font-bold text-white">{totalQuestions} Soru</Text></View>
                </View>
                <Text className="text-sm text-on-surface-variant leading-relaxed">
                  Tüm derslerden harmanlanmış dengeli test.
                </Text>
              </View>
            </Pressable>
          </View>

          <View className="mt-8 p-5 rounded-2xl bg-surface-container-high border border-outline-variant/10">
            <View className="flex-row items-center gap-4">
              <View className="flex-row -space-x-3">
                <Image className="h-8 w-8 rounded-full ring-2 ring-white" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmup_H1dBJDYwtD3yqpJXYXRQh1LO8UYqqZ9URYa7sYXRPKaJwaki_kzRAcXmnAi5N0uwU7BoDdDNXUHzA7-aVs_55Kkqr7Wv_pWE3SQulOiVbhzoGgUwdtGBNTcYwY2FkuZpCf0JQtidDHEV6iop-V-jqO8QMPfIjv6WBV5G61SDGcviUoNM9NhzWpzQA8qy9T2R7zWUXOvl4N6TeFxGqjACu4kbklcdxtt4chk8yWrGEINm25SJfvHMV1yks4mxDJWM7G-3Kt9OJ" }} />
                <Image className="h-8 w-8 rounded-full ring-2 ring-white" source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFfjSE5vshwh722X4lQgdFaari8-gZx8ViZ2jVphcNaJFHmRKGsMfM89BPfAaRnEm5xP6w8OKqe7EcHujN8ZpetP82OFAY585K6cOfs5D2qjrj-nBuf56WEQ5aVetRE-ngFXO5HQGgmdDhNepNRJOS9LoC2QGH-ztRj4S27hZeXWn3Flmkw_huLdE5VpRg303QyEAIdUmZMQe4tIt2XUT2qVRp6b6eOmHRWzd98a76_j8iZ4kndezwXOovCgQOxt7keMuvFgUDb1Fw" }} />
                <View className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant ring-2 ring-white">
                  <Text className="text-[10px] font-bold">+12k</Text>
                </View>
              </View>
              <Text className="flex-1 text-xs font-semibold text-on-surface-variant">
                Hazırsanız Başlayalım!
              </Text>
            </View>
          </View>
          <View className="h-24"></View>
        </ScrollView>

        <View className="absolute bottom-8 left-0 w-full px-6 z-50">
          <Pressable onPress={() => handleStartAd('/quiz_engine', { examType, mode: selectedMode })} className="w-full bg-blue-600 py-5 rounded-[1.5rem] shadow-xl shadow-blue-500/30 active:scale-95 transition-all duration-200 flex-row items-center justify-center gap-3">
            <Text className="text-white font-headline font-extrabold text-base tracking-widest">SINAVI BAŞLAT</Text>
            <Icon name="rocket-launch" className="text-white" size={20} />
          </Pressable>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

//router.push({ pathname: '/quiz_engine', params: { examType, mode: selectedMode } })}