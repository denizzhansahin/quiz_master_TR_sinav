import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import TopAppBarNative from '../../components/shared/TopAppBarNative';

export default function sinavkaygisiPage() {
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
            <Text className="text-3xl font-extrabold font-headline text-on-surface leading-tight mb-3">Sınav Kaygısıyla Baş Etme Yolları</Text>
            <Text className="text-on-surface-variant font-medium text-lg leading-relaxed">Zihninizi Başarıya Nasıl Programlarsınız?</Text>
          </View>

          <View className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm mb-12">
            <Text style={styles.contentText}>
              Kaygıyı Kabul Edin
Bir miktar kaygı normaldir ve sizi zinde tutar. Ancak kaygı yönetilemez hale gelirse performansı düşürür.
Zihinsel Teknikler
Nefes Egzersizi: Kaygı anında 4 saniye nefes alın, 4 saniye tutun ve 8 saniyede verin.
Olumlamalar: "Yeterince çalıştım", "Bu sınav benim değerimi belirlemez" gibi cümlelerle iç sesinizi sakinleştirin.
Yaşam Tarzı
Düzenli uyku ve şekerden uzak bir beslenme düzeni, stres hormonlarını dengede tutar. Yürüyüş yapmayı ihmal etmeyin.
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
