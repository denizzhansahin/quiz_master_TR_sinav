import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';

export default function yksmaratonuPage() {
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
            <Text className="text-3xl font-extrabold font-headline text-on-surface leading-tight mb-3">YKS Maratonunda Derece Yapmanın Formülü</Text>
            <Text className="text-on-surface-variant font-medium text-lg leading-relaxed">Konu Analizi ve Doğru Kaynak Seçimi</Text>
          </View>

          <View className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm mb-12">
            <Text style={styles.contentText}>
              1. Konu Analizi ve Önceliklendirme
YKS'de başarılı olmanın ilk adımı, hangi konudan kaç soru çıktığını bilmektir. ÖSYM'nin son 5 yılını analiz ederek en çok soru gelen konulara odaklanın.
TYT Türkçe: Paragraf soruları her gün çözülmeli.
Matematik: Problemler ve Geometri temel taşıdır.
2. Kaynak Seçimi
Seviyenizin çok üstünde veya çok altında kaynaklar zaman kaybıdır. Kolaydan zora doğru bir ilerleme kaydedin. MEB kazanım testlerini mutlaka çözün.
3. Deneme Stratejisi
Sadece deneme çözmek yetmez. Deneme sonrası yapılan "Yanlış Analizi" sizi dereceye taşır. Hatayı nerede yaptığınızı bulun: Bilgi eksikliği mi, dikkat hatası mı yoksa süre yönetimi mi?
            </Text>
            
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
