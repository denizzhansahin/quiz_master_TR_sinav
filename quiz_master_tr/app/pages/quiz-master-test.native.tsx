import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';

export default function quizmastertestPage() {
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
            <Text className="text-3xl font-extrabold font-headline text-on-surface leading-tight mb-3">Quiz Master TR ile Kendinizi Test Edin!</Text>
            <Text className="text-on-surface-variant font-medium text-lg leading-relaxed">Aktif Hatırlama ile Başarınızı Artırın</Text>
          </View>

          <View className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm mb-12">
            <Text style={styles.contentText}>
              Aktif Hatırlama (Active Recall) Nedir?
Bilgiyi sadece okumak pasif bir eylemdir. Bilgiyi zihninizden zorla geri çağırmak ise öğrenmenin en etkili yoludur. Quiz Master TR tam olarak bunu yapmanızı sağlar.
Nasıl Kullanmalısınız?
Konu Sonrası Test: Bir konuyu çalıştıktan hemen sonra o konuyla ilgili testi çözün.
Yanlış Odaklı Çalışma: Uygulamadaki istatistiklerinizi inceleyerek en çok hata yaptığınız alt konuları belirleyin.
Kendi Denemenizi Yapın: Rastgele modunu kullanarak sınav stresini simüle edin.
Öğrendiğiniz her şeyi anında test ederek kalıcı hafızaya aktarın.
            </Text>
            
            <Pressable 
              onPress={() => Linking.openURL('https://qmtestsinav.linksphere.tr')}
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
