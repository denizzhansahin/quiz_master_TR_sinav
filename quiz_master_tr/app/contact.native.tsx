import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/icons/Icon';

export default function ContactNativeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface">
        {/* Back Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-blue-50">
            <Icon name="arrow-back" size={24} className="text-primary" />
          </Pressable>
          <Text className="ml-4 font-headline font-bold text-xl text-on-surface">İletişim</Text>
        </View>

        <ScrollView className="flex-1 px-8 pt-10 pb-20">
          <View className="items-center mb-12">
            <View className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-100">
               <Icon name="mail" size={32} className="text-white" />
            </View>
            <Text className="text-3xl font-extrabold text-on-surface font-headline tracking-tighter mt-4">Bize Yazın</Text>
            <Text className="text-on-surface-variant text-center font-medium mt-1">Her zaman yardıma hazırız.</Text>
          </View>

          <View className="gap-6 flex flex-col mb-12">
             <Pressable 
                onPress={() => Linking.openURL('mailto:mobilhaber2025@gmail.com')}
                className="flex-row gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 items-center active:bg-indigo-100 transition-colors"
             >
                <View className="w-12 h-12 bg-white rounded-xl items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Icon name="email" size={24} className="text-indigo-600" />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">E-posta</Text>
                  <Text className="text-on-surface font-bold text-base block">mobilhaber2025@gmail.com</Text>
                </View>
             </Pressable>

             <Pressable 
                onPress={() => Linking.openURL('https://instagram.com/spaceteknopoli')}
                className="flex-row gap-4 p-5 rounded-2xl bg-slate-50 border border-outline-variant/10 items-center active:bg-slate-100 transition-colors"
             >
                <View className="w-12 h-12 bg-white rounded-xl items-center justify-center text-primary shadow-sm border border-outline-variant/10">
                  <Icon name="public" size={24} className="text-primary" />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sosyal Medya</Text>
                  <Text className="text-on-surface font-bold text-base block">@spaceteknopoli</Text>
                </View>
             </Pressable>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
