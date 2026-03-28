import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/icons/Icon';
import { syncQuestions, getSyncUrl, saveSyncUrl, DEFAULT_SYNC_URL, loadQuestions, resetQuestions } from '../utils/storage';
import Logo from '../assets/images/logo.png';
import { Image } from 'expo-image';



export default function SettingsNativeScreen() {
  const router = useRouter();
  const [syncing, setSyncing] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [inputUrl, setInputUrl] = React.useState('');
  const [totalQuestions, setTotalQuestions] = React.useState(0);

  const refreshData = React.useCallback(async () => {
    const questions = await loadQuestions();
    setTotalQuestions(questions.length);
    const url = await getSyncUrl();
    setCurrentUrl(url);
    setInputUrl(url);
  }, []);

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncQuestions(currentUrl);
      Alert.alert(
        'Senkronizasyon Başarılı! ✅',
        `${result.added} yeni soru eklendi.\nToplam soru sayısı: ${result.total}`,
        [{ text: 'Tamam' }]
      );
      setTotalQuestions(result.total);
    } catch (error) {
      Alert.alert(
        'Hata ❌',
        'Senkronizasyon başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'),
        [{ text: 'Tamam' }]
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveUrl = async () => {
    if (!inputUrl.trim()) return;
    await saveSyncUrl(inputUrl);
    setCurrentUrl(inputUrl);
    Alert.alert('Başarılı', 'Senkronizasyon adresi kaydedildi.');
  };

  const handleResetUrl = async () => {
    await saveSyncUrl(DEFAULT_SYNC_URL);
    setCurrentUrl(DEFAULT_SYNC_URL);
    setInputUrl(DEFAULT_SYNC_URL);
    Alert.alert('Başarılı', 'Varsayılan adrese dönüldü.');
  };

  const handleResetQuestions = async () => {
    Alert.alert(
      'Soruları Sıfırla',
      'Tüm soruları silip varsayılan sorulara dönmek istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { 
          text: 'Sıfırla', 
          style: 'destructive',
          onPress: async () => {
            const count = await resetQuestions();
            setTotalQuestions(count);
            Alert.alert('Başarılı', `${count} varsayılan soru yüklendi.`);
          }
        }
      ]
    );
  };

  const settingsItems = [
    { title: 'Hakkında', icon: 'info', route: '/about' },
    { title: 'İletişim', icon: 'mail', route: '/contact' },
    { title: 'Gizlilik Politikası', icon: 'security', route: '/privacy' },
  ];

  const actionItems = [
    { title: 'Soruları Güncelle', icon: 'sync', action: handleSync, loading: syncing },
    { title: 'Varsayılan Sorulara Dön', icon: 'refresh', action: handleResetQuestions, loading: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-surface">
        {/* Simple Back Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-blue-50">
            <Icon name="arrow-back" size={24} className="text-primary" />
          </Pressable>
          <Text className="ml-4 font-headline font-bold text-xl text-on-surface">Ayarlar</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-8">
          {/* App Info Card */}
          <View className="items-center mb-10">
            <View className="w-48 h-48 rounded-3xl items-center justify-center mb-4">
              <Image
                  source={Logo}
                  alt="Quiz Logo"
                  style={styles.promoImage}
                  contentFit="contain"
                />
            </View>
            <Text className="text-2xl font-extrabold text-on-surface font-headline">Quiz Master TR</Text>
            <View className="flex-row gap-2 mt-2">
              <View className="px-2 py-0.5 bg-surface-container-high rounded-full border border-outline-variant/10">
                <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Sürüm 1.0.0</Text>
              </View>
              <View className="px-2 py-0.5 bg-secondary/10 rounded-full border border-secondary/20">
                <Text className="text-[10px] text-secondary font-bold uppercase tracking-wider">{totalQuestions} Soru Mevcut</Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10">
            <View className="px-5 py-4 bg-surface-container/50">
              <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Bilgi ve Destek</Text>
            </View>
            
            {settingsItems.map((item, index) => (
              <Pressable
                key={item.title}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center justify-between p-5 active:bg-blue-50/50 ${index !== settingsItems.length - 1 ? 'border-b border-outline-variant/5' : ''}`}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-2xl bg-surface-container-high items-center justify-center text-primary">
                    <Icon name={item.icon} size={20} className="text-primary" />
                  </View>
                  <Text className="font-bold text-on-surface">{item.title}</Text>
                </View>
                <Icon name="chevron-right" size={20} className="text-outline" />
              </Pressable>
            ))}
          </View>

          {/* Sync Source Config Section */}
          <View style={styles.configSection}>
            <View style={styles.configHeader}>
              <Text style={styles.configHeaderText}>Sunucu Ayarları</Text>
            </View>
            <View style={styles.configBody}>
              <Text style={styles.label}>GitHub JSON Veri Kaynağı</Text>
              <TextInput
                style={styles.input}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="https://raw.githubusercontent.com/..."
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.buttonRow}>
                <Pressable onPress={handleSaveUrl} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Kaydet</Text>
                </Pressable>
                <Pressable onPress={handleResetUrl} style={styles.resetBtn}>
                  <Text style={styles.resetBtnText}>Sıfırla</Text>
                </Pressable>
              </View>
              <Text style={styles.infoText}>
                * Senkronizasyon sistemimiz varsayılan olarak bizim GitHub depomuzdaki güncel soruları çeker. Kendi verilerinizi çekmek için linki değiştirebilirsiniz.
              </Text>
            </View>
          </View>

          {/* Data Management Section */}
          <View className="mt-6 bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/10">
            <View className="px-5 py-4 bg-surface-container/50">
              <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Veri Yönetimi</Text>
            </View>
            
            {actionItems.map((item, index) => (
              <Pressable
                key={item.title}
                onPress={item.action}
                disabled={item.loading}
                className={`flex-row items-center justify-between p-5 active:bg-blue-50/50 ${index !== actionItems.length - 1 ? 'border-b border-outline-variant/5' : ''} ${item.loading ? 'opacity-50' : ''}`}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-2xl bg-surface-container-high items-center justify-center text-primary">
                    <Icon name={item.icon} size={20} className="text-primary" />
                  </View>
                  <Text className="font-bold text-on-surface">
                    {item.loading ? 'Güncelleniyor...' : item.title}
                  </Text>
                </View>
                {!item.loading && <Icon name="chevron-right" size={20} className="text-outline" />}
              </Pressable>
            ))}
          </View>

          <View className="mt-12 mb-20 items-center">
            <Text className="text-outline text-xs font-medium">© 2026 Quiz Master TR</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  promoImage: { width: '100%', height: '100%', opacity: 0.9 },
  configSection: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  configHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  configHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  configBody: {
    padding: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FF',
    borderWidth: 1,
    borderColor: '#E8EAF6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#212121',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1565C0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#757575',
    fontWeight: '700',
    fontSize: 14,
  },
  infoText: {
    marginTop: 14,
    fontSize: 10,
    color: '#9E9E9E',
    fontStyle: 'italic',
    lineHeight: 14,
  },
});