import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/icons/Icon';

export default function PrivacyNativeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface">
        {/* Back Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-blue-50">
            <Icon name="arrow-back" size={24} className="text-primary" />
          </Pressable>
          <Text className="ml-4 font-headline font-bold text-xl text-on-surface">Gizlilik</Text>
        </View>

        <ScrollView className="flex-1 px-8 pt-10 pb-20">
          <View className="mb-10 flex-row items-center gap-6">
            <View className="w-16 h-16 rounded-[1.5rem] bg-slate-900 items-center justify-center text-white shadow-lg shadow-blue-100 flex">
               <Icon name="security" size={32} className="text-white" />
            </View>
            <Text className="text-3xl font-extrabold text-on-surface font-headline tracking-tighter">Gizlilik</Text>
          </View>

          <View className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 mb-20">
             <View className="flex flex-col gap-8">
                <View>
                  <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Veri İşleme Beyanı</Text>
                  <Pressable 
                    onPress={() => Linking.openURL('https://www.denizhansahin.com/2026/03/quiz-master-tr-yks-ales-kpss-gizlilik.html')}
                    className="bg-primary p-4 rounded-xl mt-2 active:opacity-90 shadow-lg shadow-primary/20"
                  >
                    <Text className="text-white font-bold text-center text-xs">Güncel Yasal Metinler İçin Tıklayınız</Text>
                  </Pressable>
                </View>
                
                <View>
                  <Text className="font-bold text-on-surface text-lg mb-2">1. Hangi Verileri Topluyoruz?</Text>
                  <Text className="text-on-surface-variant font-medium leading-relaxed">
                    Uygulamayı kullanırken sadece quiz sonuçlarınız, yanlış cevaplarınız ve başarı oranlarınız yerel depolama alanında saklanır. Biz bu verilere erişemeyiz.
                  </Text>
                </View>

                <View>
                  <Text className="font-bold text-on-surface text-lg mb-2">2. Verilerin Saklanması</Text>
                  <Text className="text-on-surface-variant font-medium leading-relaxed">
                    Verileriniz sadece telefonunuzun belleğinde saklanır. Uygulamayı silerseniz veya uygulama içinden 'Verileri Temizle' derseniz geri döndürülemez şekilde silinecektir.
                  </Text>
                </View>

                <View className="p-5 bg-surface-container-high rounded-2xl border border-outline-variant/10">
                  <Text className="font-bold text-on-surface text-sm mb-1 italic opacity-80 uppercase tracking-widest">Sürüm: 1.0.0</Text>
                  <Text className="text-xs text-on-surface-variant leading-relaxed">Bu politika son olarak 24 Mart 2026 tarihinde güncellenmiştir.</Text>
                </View>
             </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
