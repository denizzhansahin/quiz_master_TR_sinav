import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/icons/Icon';

const NativeSupportPage = ({ title, icon, colorClass, children }: { title: string, icon: string, colorClass: string, children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface">
        {/* Back Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-blue-50">
            <Icon name="arrow-back" size={24} className="text-primary" />
          </Pressable>
          <Text className="ml-4 font-headline font-bold text-xl text-on-surface">Ayarlar</Text>
        </View>

        <ScrollView className="flex-1 px-8 pt-10">
          <View className="flex-row items-center gap-4 mb-8">
            <View className={`w-14 h-14 rounded-2xl ${colorClass} items-center justify-center shadow-sm`}>
               <Icon name={icon} size={28} className="text-white" />
            </View>
            <Text className="text-3xl font-extrabold text-on-surface font-headline tracking-tighter">{title}</Text>
          </View>

          <View className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 mb-20">
            {children}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default function AboutNativeScreen() {
  return (
    <NativeSupportPage title="Hakkında" icon="info" colorClass="bg-blue-600">
      <Text className="text-lg font-bold text-on-surface mb-3">Quiz Master TR Nedir?</Text>
      <Text className="text-on-surface-variant font-medium leading-relaxed mb-6">
        Quiz Master TR, Türkiye'nin sınav sistemlerine tam uyumlu, akıllı bir soru çözüm ve gelişim takip platformudur.
      </Text>
      
      <View className="flex-row gap-4 mb-10">
        <View className="flex-1 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <Icon name="auto-fix-high" size={20} className="text-blue-600 mb-2" />
          <Text className="font-bold text-on-surface text-xs">Akıllı Analiz</Text>
        </View>
        <View className="flex-1 p-4 bg-slate-50 rounded-2xl border border-outline-variant/10">
          <Icon name="verified" size={20} className="text-primary mb-2" />
          <Text className="font-bold text-on-surface text-xs">Güncel İçerik</Text>
        </View>
      </View>

      <Text className="text-on-surface-variant font-medium leading-relaxed">
        Amacımız, her öğrencinin sınav hazırlık sürecini daha verimli, planlı ve başarılı hale getirmektir. Sizler için hazırlanan içeriklerle başarınız için çalışıyoruz.
      </Text>
    </NativeSupportPage>
  );
}
