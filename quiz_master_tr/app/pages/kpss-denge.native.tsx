import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';

export default function kpssdengePage() {
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
            <Text className="text-3xl font-extrabold font-headline text-on-surface leading-tight mb-3">KPSS'de Genel Kültür ve Genel Yetenek Dengesi</Text>
            <Text className="text-on-surface-variant font-medium text-lg leading-relaxed">Puanınızı Nasıl Maximize Edersiniz?</Text>
          </View>

          <View className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm mb-12">
            <Text style={styles.contentText}>
              Denge Her Şeydir
KPSS'de sadece tek bir alana yüklenmek hata olabilir. GY (Genel Yetenek) ve GK (Genel Kültür) arasındaki dengeyi kurmalısınız.
GY Stratejisi: Türkçe ve Matematik'te hız kazanmak, GK kısmına daha fazla zaman ayırmanızı sağlar.
GK Stratejisi: Tarih ve Coğrafya'yı ezberlemek yerine kronolojik ve harita üzerinden çalışarak kalıcılığı artırın.
Vatandaşlık ve Güncel Bilgiler
Sınava yakın zamanda en çok puan getiren kısımlardan biri olan güncel bilgilere her gün 15 dakikanızı ayırın.
Çıkmış Soruların Gücü
ÖSYM'nin soru dilini anlamak için son 10 yılın KPSS sorularını en az 2 kez çözmüş olmalısınız.
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
