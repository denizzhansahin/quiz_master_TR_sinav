import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import BilgiLogo from '../../assets/images/bilgi.png';
import Logo from '../../assets/images/logo.png';


export default function TanitimNativePage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface font-body" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface text-on-surface">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10 bg-white/80 dark:bg-slate-900/80">
          <Pressable onPress={() => router.back()} className="p-2 active:scale-95 transition-transform">
            <Icon name="arrow-back" className="text-primary" />
          </Pressable>
          <Text className="flex-1 text-center font-headline font-black text-lg tracking-widest uppercase italic pr-10">Uygulama Tanıtımı</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-8 pb-12 w-full max-w-md self-center">
          <View className="flex flex-col gap-12 text-center items-center">

            {/* Hero Image / Brand */}
            <View className="items-center gap-4">
              <View className="w-48 h-48 bg-primary rounded-3xl items-center justify-center shadow-2xl shadow-primary/40">
                <Image
                  source={Logo}
                  alt="Quiz Logo"
                  style={styles.promoImage}
                  contentFit="contain"
                />
              </View>
              <Text className="text-4xl font-headline font-black tracking-tighter text-on-surface text-center italic uppercase leading-tight">
                Quiz Master TR
              </Text>
              <Text className="text-on-surface-variant font-medium text-center px-4 leading-relaxed">
                Sınavlara hazırlıkta yeni nesil dijital yardımcın.
              </Text>
            </View>

            {/* Feature Cards Grid */}
            <View className="w-full gap-6">
              <View className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/15 shadow-sm flex-row items-center gap-5">
                <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center">
                  <Icon name="auto-stories" className="text-blue-700" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-headline font-extrabold text-on-surface">Zengin İçerik</Text>
                  <Text className="text-xs text-on-surface-variant font-medium mt-1">YKS, KPSS, ALES güncel soru havuzu.</Text>
                </View>
              </View>

              <View className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/15 shadow-sm flex-row items-center gap-5">
                <View className="w-12 h-12 bg-indigo-100 rounded-2xl items-center justify-center">
                  <Icon name="insights" className="text-indigo-700" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-headline font-extrabold text-on-surface">Süper Analiz</Text>
                  <Text className="text-xs text-on-surface-variant font-medium mt-1">Hatalarından öğren, eksikleri tamamla.</Text>
                </View>
              </View>

              <View className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/15 shadow-sm flex-row items-center gap-5">
                <View className="w-12 h-12 bg-emerald-100 rounded-2xl items-center justify-center">
                  <Icon name="timer" className="text-emerald-700" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-headline font-extrabold text-on-surface">Süre Takibi</Text>
                  <Text className="text-xs text-on-surface-variant font-medium mt-1">Sınav hızını ve netlerini artır.</Text>
                </View>
              </View>
            </View>

            {/* Promo Card */}
            <View style={styles.promoCard}>
              <View style={styles.promoTextContent}>
                <Text style={styles.promoTitle}>Hayallerine Bir Adım Daha Yaklaş</Text>
                <Text style={styles.promoSub}>Tüm sınavlar için tek bir uygulama yetecek.</Text>
                <Pressable onPress={() => router.replace('/subject_tree')} className="bg-white px-8 py-4 rounded-xl items-center justify-center active:bg-slate-50 transition-colors mt-2">
                  <Text className="text-indigo-700 font-extrabold uppercase tracking-widest text-xs">Hemen Başla</Text>
                </Pressable>
              </View>
              <View style={styles.promoImageBox}>
                <Image
                  source={BilgiLogo}
                  style={styles.promoImage}
                  contentFit="contain"
                />
              </View>
            </View>

            {/* Store Link Section */}
            <View className="w-full mb-20 items-center gap-6">
              <Text className="text-xl font-headline font-black uppercase italic text-on-surface">Uygulamalarımızı Keşfedin</Text>
              <Pressable
                onPress={() => Linking.openURL('https://play.google.com/store/apps/dev?id=9221158722118390923')}
                className="w-full bg-black py-5 rounded-2xl flex-row items-center justify-center gap-4 shadow-xl active:scale-95 transition-transform"
              >
                <Icon name="play-arrow" color="white" size={32} />
                <View className="text-left"><Text className="text-[10px] text-white/70 uppercase tracking-widest font-black">Google Play'de</Text><Text className="text-lg font-black text-white">KEŞFEDİN</Text></View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  promoCard: { width: '100%', backgroundColor: '#4247b3', borderRadius: 40, padding: 32, gap: 24, overflow: 'hidden' },
  promoTextContent: { gap: 16, zIndex: 10 },
  promoTitle: { color: 'white', fontSize: 24, fontStyle: 'italic', fontWeight: '900', letterSpacing: -0.5, lineHeight: 28 },
  promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500', lineHeight: 18 },
  promoImageBox: { width: '100%', height: 240, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden' },
  promoImage: { width: '100%', height: '100%', opacity: 0.9 }
});
