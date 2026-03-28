import React from 'react';
import { View, Text, ScrollView, Pressable, Share, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import questionsData from '../../assets/data/questions.json';

export default function ResultAnalysisNativeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const correct = parseInt((params.correct as string) || '0');
  const wrong = parseInt((params.wrong as string) || '0');
  const empty = parseInt((params.empty as string) || '0');
  const total = parseInt((params.total as string) || '50');

  const wrongIds = (params.wrongIds as string)?.split(',').filter(Boolean).map(Number) || [];
  const emptyIds = (params.emptyIds as string)?.split(',').filter(Boolean).map(Number) || [];
  const timeTaken = parseInt((params.timeTaken as string) || '0');
  const problemIds = [...wrongIds, ...emptyIds];
  const problemQuestions = questionsData.filter(q => problemIds.includes(q.id));

  const netScore = Math.max(0, correct - (wrong * 0.25)).toFixed(2);
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;
  const wrongPercentage = total > 0 ? (wrong / total) * 100 : 0;
  const emptyPercentage = total > 0 ? (empty / total) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-surface font-body" edges={['top', 'left', 'right']}>
      <View className="flex-1 flex-col bg-surface text-on-surface">
        {/* TopAppBar */}
        <View className="bg-white/80 dark:bg-[#191b23]/80 shadow-sm dark:shadow-none z-50 w-full mb-px">
          <View className="flex-row items-center justify-between px-6 py-4 w-full">
            <View className="flex-row items-center gap-4">
              <Pressable onPress={() => router.back()} className="active:scale-95 transition-transform duration-200">
                <Icon name="arrow-back" className="text-[#0058be] dark:text-[#2170e4]" />
              </Pressable>
              <Text className="font-headline font-bold tracking-tight text-[#191b23] dark:text-[#f9f9ff] text-lg">Exam Analysis</Text>
            </View>
            <Pressable 
              onPress={async () => {
                const shareText = `Quiz Master TR Sonucum:\nNet: ${netScore}\nDoğru: ${correct}\nYanlış: ${wrong}\nBoş: ${empty}\nSüre: ${Math.floor(timeTaken/60)}dk ${timeTaken%60}sn`;
                try {
                  await Share.share({ message: shareText });
                } catch (error) {
                  // Fallback: If share dialog fails (common in some emulators/fast-refresh states), attempt to open SMS directly
                  Linking.openURL(`sms:?body=${encodeURIComponent(shareText)}`).catch(() => {
                    console.log("Paylaşım başlatılamadı.");
                  });
                }
              }}
              hitSlop={15}
              className="p-2 active:scale-95 transition-transform duration-200"
            >
              <Icon name="share" className="text-[#424754] dark:text-[#c2c6d6]" />
            </Pressable>
          </View>
          <View className="bg-[#ecedf7] dark:bg-[#424754] h-[1px] opacity-15"></View>
        </View>

        <ScrollView className="flex-1 px-4 pt-4 pb-28 w-full max-w-md self-center">
          <View className="flex flex-col space-y-8 gap-8">
            {/* Score Summary: Bento Grid Style */}
            <View className="flex-row flex-wrap gap-3">
              <View className="w-full bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
                <Text className="text-on-surface-variant font-label uppercase tracking-widest text-[10px] mb-1">Net Puan</Text>
                <Text className="font-headline font-extrabold text-5xl text-primary tracking-tighter">{netScore}</Text>
                <View className="mt-4 px-4 py-1.5 bg-secondary-container/20 rounded-full flex-row items-center gap-1">
                  <Icon name={correctPercentage > 50 ? "trending-up" : "trending-down"} className="text-sm text-secondary" size={16} />
                  <Text className="text-secondary font-medium text-xs">%12 Higher than avg</Text>
                </View>
              </View>
              <View className="flex-1 bg-surface-container-low p-4 rounded-xl flex flex-col justify-between min-w-[140px] shadow-sm">
                <Text className="text-on-surface-variant font-label text-[11px] uppercase tracking-wider">Süre</Text>
                <View className="mt-2 flex-row items-baseline gap-1">
                  <Text className="font-headline font-bold text-2xl text-on-surface">{Math.floor(timeTaken / 60)}</Text>
                  <Text className="text-on-surface-variant text-sm font-medium">dk</Text>
                  <Text className="font-headline font-bold text-2xl text-on-surface">{(timeTaken % 60).toString().padStart(2, '0')}</Text>
                  <Text className="text-on-surface-variant text-sm font-medium">sn</Text>
                </View>
              </View>
              <View className="flex-1 bg-surface-container-low p-4 rounded-xl flex flex-col justify-between min-w-[140px] shadow-sm">
                <Text className="text-on-surface-variant font-label text-[11px] uppercase tracking-wider">Soru Başına</Text>
                <View className="mt-2 flex-row items-baseline gap-1">
                  <Text className="font-headline font-bold text-2xl text-primary">{total > 0 ? Math.round(timeTaken / total) : 0}</Text>
                  <Text className="text-on-surface-variant text-xs">sn / soru</Text>
                </View>
              </View>
            </View>

            {/* Performance Breakdown */}
            <View className="space-y-4 gap-4">
              <View className="flex-row items-end justify-between px-1">
                <Text className="font-headline font-bold text-xl text-on-surface">Soru Dağılımı</Text>
                <Text className="text-on-surface-variant text-sm font-medium">Toplam {total} Soru</Text>
              </View>
              <View className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-6 gap-6">
                <View className="flex-row h-3 w-full rounded-full overflow-hidden bg-surface-container-highest">
                  <View className="h-full bg-secondary" style={{ width: `${correctPercentage}%` }}></View>
                  <View className="h-full bg-error" style={{ width: `${wrongPercentage}%` }}></View>
                  <View className="h-full bg-outline-variant/30" style={{ width: `${emptyPercentage}%` }}></View>
                </View>
                <View className="flex-row justify-between gap-2">
                  <View className="space-y-1 flex-1">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <View className="w-2 h-2 rounded-full bg-secondary"></View>
                      <Text className="text-xs font-medium text-on-surface-variant">Doğru</Text>
                    </View>
                    <Text className="font-headline font-bold text-lg">{correct}</Text>
                  </View>
                  <View className="space-y-1 flex-1">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <View className="w-2 h-2 rounded-full bg-error"></View>
                      <Text className="text-xs font-medium text-on-surface-variant">Yanlış</Text>
                    </View>
                    <Text className="font-headline font-bold text-lg">{wrong}</Text>
                  </View>
                  <View className="space-y-1 flex-1">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <View className="w-2 h-2 rounded-full bg-outline-variant"></View>
                      <Text className="text-xs font-medium text-on-surface-variant">Boş</Text>
                    </View>
                    <Text className="font-headline font-bold text-lg">{empty}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Question List Preview */}
            <View className="space-y-4 gap-4 mb-24">
              <Text className="font-headline font-bold text-xl px-1">Çözümler Formu</Text>
              
              {problemQuestions.length === 0 ? (
                <View className="bg-surface-container-low p-6 rounded-xl flex-col items-center justify-center opacity-80">
                  <Icon name="verified" className="text-secondary text-4xl mb-2" size={40} />
                  <Text className="text-on-surface-variant text-sm text-center mb-2 font-bold">Harika iş çıkardın! Hiç hatan veya boşun yok.</Text>
                </View>
              ) : (
                problemQuestions.map(q => {
                  const isWrong = wrongIds.includes(q.id);
                  return (
                    <View key={q.id} className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
                      <View className="flex-row justify-between items-center">
                        <View className="px-3 py-1 bg-primary-container/10 rounded-lg">
                           <Text className="text-primary text-xs font-bold uppercase">Soru {q.id}</Text>
                        </View>
                        <Text className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md ${isWrong ? 'bg-error/10 text-error' : 'bg-outline-variant/10 text-on-surface-variant'}`}>
                           {isWrong ? 'Yanlış' : 'Boş'}
                        </Text>
                      </View>
                      
                      <Text className="text-on-surface font-medium leading-relaxed font-body">{q.question_text}</Text>
                      
                      {q.image_url && (
                         <View className="w-full h-32 bg-surface-container-low rounded-lg overflow-hidden">
                           <Image source={{ uri: q.image_url }} className="w-full h-full object-contain" />
                         </View>
                      )}
                      
                      <View className="bg-secondary-container/20 p-4 rounded-lg border-l-4 border-secondary">
                        <Text className="font-bold text-secondary mb-1">Doğru Cevap: {q.correct_option}</Text>
                        <Text className="text-sm text-on-surface-variant leading-relaxed">{q.explanation || 'Bu soru için detaylı çözüm bulunmamaktadır.'}</Text>
                      </View>
                    </View>
                  );
                })
              )}
              
              <View className="mt-6 p-4">
                <Pressable onPress={() => router.replace('/(tabs)')} className="w-full py-4 bg-primary rounded-xl flex items-center justify-center active:scale-95 transition-all">
                  <Text className="text-white font-bold tracking-widest uppercase">Ana Ekrana Dön</Text>
                </Pressable>
              </View>
            </View>
            <View className="h-4"></View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
