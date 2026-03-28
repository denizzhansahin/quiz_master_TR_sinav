import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';

export default function odaklanmasanatiPage() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-surface font-body" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface text-on-surface flex-col">
        <TopAppBarNative />
        <ScrollView className="px-6 pb-12 w-full pt-4 max-w-md self-center">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 mb-8">
            <Icon name="arrow-back" className="text-primary" size={24} />
            <Text className="text-primary font-bold text-lg">Geri Dön</Text>
          </Pressable>
          
          <View className="mb-10">
            <View className="bg-primary/10 self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-primary font-black text-[10px] tracking-widest uppercase">REHBERLİK</Text>
            </View>
            <Text className="text-3xl font-extrabold font-headline text-on-surface leading-tight mb-3">Odaklanma Sanatı</Text>
            <Text className="text-on-surface-variant font-medium text-lg leading-relaxed">Pomodoro APP ile Zihinsel Yorgunluğu Önleyin</Text>
          </View>

          <View className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm mb-12">
            <Text style={styles.contentText}>
              Pomodoro Tekniği: 25 - 5 Kuralı
İnsan beyni uzun süre kesintisiz odaklanmakta zorlanır. Pomodoro tekniği, 25 dakikalık tam odaklanma ve 5 dakikalık dinlenme döngüleriyle verimi maksimize eder.
Uygulamanın Rolü
Pomodoro APP, çalışma sürelerinizi disipline ederken sizi dış uyaranlara karşı korur. Her çalışma seansı bittiğinde kendinizi daha taze hissedeceksiniz.
Mola süresinde telefonla oynamayın.
Çalışma sırasında sadece o işe odaklanın.
Dört pomodoro sonunda uzun bir mola (15-30 dk) verin.
            </Text>
            
            <Pressable 
              onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.denizhansahin.pomodoro_free')}
              className="mt-8 bg-primary p-5 rounded-2xl items-center shadow-lg shadow-primary/30 active:scale-95"
            >
              <Text className="text-white font-black uppercase tracking-widest">Resmi Sayfayı Aç</Text>
            </Pressable>
            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#44474e',
    fontFamily: 'body'
  }
});
