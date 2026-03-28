import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';

export default function verimliderscalismaPage() {
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
            <Text className="text-3xl font-extrabold font-headline text-on-surface leading-tight mb-3">Verimli Ders Çalışmanın 5 Bilimsel Yolu</Text>
            <Text className="text-on-surface-variant font-medium text-lg leading-relaxed">Feynman ve Cornell Tekniklerini Keşfedin</Text>
          </View>

          <View className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm mb-12">
            <Text style={styles.contentText}>
              1. Feynman Tekniği
Bir konuyu gerçekten öğrenmek istiyorsanız, onu 10 yaşındaki bir çocuğa anlatıyormuş gibi basitçe açıklayın. Tıkandığınız yerler, bilginizin eksik olduğu yerlerdir.
2. Cornell Not Alma Sistemi
Kağıdınızı üç bölüme ayırın: Notlar, Anahtar Kelimeler ve Özet. Bu sistem, dersten sonra konuyu tekrar etmenizi çok kolaylaştırır.
3. Aralıklı Tekrar (Spaced Repetition)
Öğrendiğiniz bilgiyi 1 gün, 1 hafta ve 1 ay sonra tekrar ederek unutma eğrisini yenin.
4. Pomodoro ve Aktif Hatırlama
Zamanı yönetin ve kendinizi sürekli sorgulayın.
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
