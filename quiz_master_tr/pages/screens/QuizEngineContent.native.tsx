import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/icons/Icon';
import { saveResult, loadQuestions, Question } from '../../utils/storage';
import { getExamConfig, getExamDurationSeconds } from '../../utils/exam-config';


import { useSafeAreaInsets } from 'react-native-safe-area-context';




const COLORS = {
  primary: '#1565C0',
  primaryLight: '#E3F2FD',
  secondary: '#388E3C',
  secondaryContainer: '#C8E6C9',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  surfaceHigh: '#EEEEEE',
  onSurface: '#212121',
  onSurfaceVariant: '#757575',
  onPrimary: '#FFFFFF',
  error: '#D32F2F',
  border: '#E0E0E0',
};

function filterQuestions(allQuestions: Question[], examType: string, subject?: string, topic?: string) {
  let filtered = [...allQuestions];

  // If RASTGELE, we don't apply an exam-specific filter
  if (examType !== 'RASTGELE' && ['YKS', 'KPSS', 'ALES'].includes(examType)) {
    filtered = filtered.filter(q => q.examType === examType);
  }

  if (subject) {
    filtered = filtered.filter(q => q.subject === subject);
  }

  if (topic) {
    filtered = filtered.filter(q => q.topic === topic);
  }

  return filtered;
}

// Question limiter: apply exam-specific question count
function limitQuestions(questions: Question[], examType: string) {
  const config = getExamConfig(examType);
  if (config.questionCount > 0 && questions.length > config.questionCount) {
    return questions.slice(0, config.questionCount);
  }
  return questions;
}





import { RewardedAd, RewardedAdEventType, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Reklam ID'leri
const rewardedId = (__DEV__ ? TestIds.REWARDED : process.env.quizEngineReward) || TestIds.REWARDED;
const interstitialId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxx/zzz';

// Reklam objelerini bileşen dışında oluşturuyoruz (Pre-loading için)
const rewarded = RewardedAd.createForAdRequest(rewardedId);
const interstitial = InterstitialAd.createForAdRequest(interstitialId);

export default function QuizEngineNativeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const examType = (params.examType as string) || 'KPSS';
  const subject = params.subject as string | undefined;
  const topic = params.topic as string | undefined;

  const examConfig = getExamConfig(examType);
  const totalDurationSeconds = getExamDurationSeconds(examType);
  const hasTimeLimit = totalDurationSeconds > 0;

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;



      // Reklamları Yükleme ve Dinleme
      const [adLoaded, setAdLoaded] = useState(false);
      const [isAdLoading, setIsAdLoading] = useState(false);
      useEffect(() => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
          setAdLoaded(true);
          setIsAdLoading(false);
        });
    
        const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
          // Ödül kazanıldı! Şimdi gitmek istediği yere gönderiyoruz.
          // Not: Hangi sayfaya gideceğini bir state'de tutabiliriz.
          console.log('Kullanıcı ödülü kazandı:', reward);
        });
    
        rewarded.load();
    
        return () => {
          unsubscribeLoaded();
          unsubscribeEarned();
        };
      }, []);
    
      // Reklam İzlet ve Navigasyon Yap (Özellikle Test Girişi İçin)
      const handleStartAd = (path: string, params?: any) => {
        if (adLoaded) {
          rewarded.show().then(() => {
            // Reklam bittikten veya ödül kazanıldıktan sonra yönlendir
            router.push({ pathname: path as any, params });
            setAdLoaded(false); // Tekrar yüklenmesi için resetle
            rewarded.load(); 
          });
        } else {
          // Reklam henüz yüklenmediyse kullanıcıyı bekletmemek için direkt geçebilir 
          // veya "Yükleniyor..." diyebilirsiniz.
          setIsAdLoading(true);
          rewarded.load();
          router.push({ pathname: path as any, params });
        }
      };
  
  useEffect(() => {
    loadQuestions().then(data => {
      setAllQuestions(data);
      setLoading(false);
    });
  }, []);

  const questions = useMemo(() => {
    if (loading || allQuestions.length === 0) return [];
    let filtered = filterQuestions(allQuestions, examType, subject, topic);
    if (examType === 'RASTGELE' || params.mode === 'mixed') {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    return limitQuestions(filtered, examType);
  }, [allQuestions, loading, examType, subject, topic, params.mode]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(hasTimeLimit ? totalDurationSeconds : 0);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishCalledRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(e => e + 1);
      if (hasTimeLimit) {
        setTimeLeft(t => {
          const next = t - 1;
          return next >= 0 ? next : 0;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [hasTimeLimit]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const completedCount = Object.keys(userAnswers).length;

  const handleOptionSelect = (optionLabel: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionLabel }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const calculateAndFinish = useCallback(async (isAutoFinish = false) => {
    if (finishCalledRef.current) return;
    if (questions.length === 0) return;
    finishCalledRef.current = true;
    setFinished(true);

    let correct = 0;
    let wrong = 0;
    let empty = 0;
    const wrongIds: number[] = [];
    const emptyIds: number[] = [];

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (!ans) {
        empty++;
        emptyIds.push(q.id);
      } else if (ans === q.correct_option) {
        correct++;
      } else {
        wrong++;
        wrongIds.push(q.id);
      }
    });

    const netScore = parseFloat(Math.max(0, correct - wrong * 0.25).toFixed(2));
    const timeTaken = hasTimeLimit ? (totalDurationSeconds - timeLeft) : elapsed;

    await saveResult({
      examType,
      subject: subject || (questions[0]?.subject as string | undefined),
      topic: topic || (questions[0]?.topic as string | undefined),
      correct,
      wrong,
      empty,
      total: totalQuestions,
      netScore,
      wrongIds,
      emptyIds,
      timeTaken,
    });

    if (isAutoFinish) {
      if (Platform.OS === 'android' && AppState.currentState !== 'active') {
        navigateToResults(correct, wrong, empty, wrongIds, emptyIds, timeTaken);
      } else {
        Alert.alert(
          'Süre Doldu! ⏰',
          `Sınav süresi sona erdi. Sınavınız otomatik olarak bitirildi.\n\nDoğru: ${correct} | Yanlış: ${wrong} | Boş: ${empty}\nNet: ${netScore}`,
          [{ text: 'Sonuçları Gör', onPress: () => navigateToResults(correct, wrong, empty, wrongIds, emptyIds, timeTaken) }]
        );
      }
    } else {
      navigateToResults(correct, wrong, empty, wrongIds, emptyIds, timeTaken);
    }
  }, [userAnswers, questions, totalQuestions, hasTimeLimit, totalDurationSeconds, timeLeft, elapsed, examType, subject, topic, router]);

  const navigateToResults = (correct: number, wrong: number, empty: number, wrongIds: number[], emptyIds: number[], timeTaken: number) => {
    handleStartAd('/result_analysis', { correct, wrong, empty, total: totalQuestions, wrongIds: wrongIds.join(','), emptyIds: emptyIds.join(','), examType, subject: subject || '', topic: topic || '', timeTaken });
  };

  /*
 const navigateToResults = (correct: number, wrong: number, empty: number, wrongIds: number[], emptyIds: number[], timeTaken: number) => {
    router.replace({
      pathname: '/result_analysis',
      params: { correct, wrong, empty, total: totalQuestions, wrongIds: wrongIds.join(','), emptyIds: emptyIds.join(','), examType, subject: subject || '', topic: topic || '', timeTaken },
    });
  };
  */

  // Auto-finish when time runs out
  useEffect(() => {
    if (hasTimeLimit && timeLeft <= 0 && !finished && questions.length > 0) {
      calculateAndFinish(true);
    }
  }, [timeLeft, hasTimeLimit, finished, calculateAndFinish, questions.length]);

  const progress = totalQuestions > 0 ? completedCount / totalQuestions : 0;
  const displayTime = hasTimeLimit ? timeLeft : elapsed;
  const minutes = Math.floor(displayTime / 60).toString().padStart(2, '0');
  const seconds = (displayTime % 60).toString().padStart(2, '0');
  const isTimeLow = hasTimeLimit && timeLeft <= 300; // 5 minutes warning
  const examLabel = examType === 'KONU_TEST' && topic ? `${topic} Testi` : examConfig.label || 'Quiz';

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FF' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1565C0' }}>Sorular Yükleniyor...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FF', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ width: 120, height: 120, backgroundColor: '#E8EAF6', borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Icon name="search-off" color="#757575" size={60} />
        </View>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#212121', marginBottom: 8, textAlign: 'center' }}>Soru Bulunamadı</Text>
        <Text style={{ fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
          Bu sınav tipi için henüz soru eklenmemiş. Lütfen daha sonra tekrar kontrol edin.
        </Text>
        <Pressable 
          onPress={() => router.back()} 
          style={{ backgroundColor: '#1565C0', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, elevation: 4, shadowColor: '#1565C0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>Geri Dön</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: bottomInset }]} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => handleStartAd('/(tabs)')} style={styles.backBtn}>
              <Icon name="arrow-back" color={COLORS.primary} size={22} />
            </Pressable>
            <View style={styles.headerTitle}>
              <Text style={styles.headerSubject} numberOfLines={1}>{examLabel}</Text>
              <Text style={styles.headerTopic} numberOfLines={1}>{currentQuestion.topic}</Text>
            </View>
            <View style={[styles.questionBadge, isTimeLow && styles.questionBadgeWarning]}>
              <Text style={[styles.questionBadgeText, isTimeLow && styles.questionBadgeTextWarning]}>{minutes}:{seconds}</Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
          <View style={styles.progressLabel}>
            <Text style={styles.progressText}>{completedCount} / {totalQuestions} Tamamlandı</Text>
            <Text style={styles.progressText}>%{Math.round(progress * 100)}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Question card */}
          <View style={styles.questionCard}>
            <View style={styles.questionAccent} />
            <View style={styles.questionHeader}>
              <View style={styles.questionNumBadge}>
                <Text style={styles.questionNumText}>Soru {currentIndex + 1}</Text>
              </View>
              <View style={styles.topicBadge}>
                <Text style={styles.topicBadgeText}>{currentQuestion.subject}</Text>
              </View>
            </View>
            <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
            {currentQuestion.image_url ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: currentQuestion.image_url }} style={styles.questionImage} contentFit="contain" />
              </View>
            ) : null}
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => {
              const isSelected = userAnswers[currentQuestion.id] === option.label;
              return (
                <Pressable
                  key={option.label}
                  onPress={() => handleOptionSelect(option.label)}
                  style={[styles.optionBtn, isSelected ? styles.optionBtnSelected : styles.optionBtnUnselected]}
                >
                  <View style={[styles.optionLabel, isSelected ? styles.optionLabelSelected : styles.optionLabelUnselected]}>
                    <Text style={[styles.optionLabelText, isSelected ? styles.optionLabelTextSelected : styles.optionLabelTextUnselected]}>{option.label}</Text>
                  </View>
                  <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : styles.optionTextUnselected]}>{option.text}</Text>
                  {isSelected && <Icon name="check-circle" color={COLORS.onPrimary} size={20} />}
                </Pressable>
              );
            })}
          </View>

          {/* Question Navigator */}
          <View style={styles.navigatorContainer}>
            <View style={styles.navigatorHeader}>
              <Text style={styles.navigatorTitle}>Soru Gezgini</Text>
              <Text style={styles.navigatorCount}>{completedCount}/{totalQuestions} cevaplandı</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.navigatorRow}>
                {questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isCurrent = idx === currentIndex;
                  const btnBg = isCurrent ? COLORS.primary : isAnswered ? COLORS.secondaryContainer : COLORS.surfaceHigh;
                  const textColor = isCurrent ? COLORS.onPrimary : isAnswered ? COLORS.secondary : COLORS.onSurfaceVariant;
                  return (
                    <Pressable
                      key={q.id}
                      onPress={() => setCurrentIndex(idx)}
                      style={[styles.navBtn, { backgroundColor: btnBg }]}
                    >
                      <Text style={[styles.navBtnText, { color: textColor }]}>{idx + 1}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Finish Button */}
          <Pressable onPress={() => calculateAndFinish(false)} style={styles.finishBtn}>
            <Icon name="check-circle" color={COLORS.onPrimary} size={22} />
            <Text style={styles.finishBtnText}>Sınavı Bitir</Text>
          </Pressable>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomBar}>
          <Pressable onPress={handlePrev} disabled={currentIndex === 0} style={[styles.bottomBtn, currentIndex === 0 && styles.bottomBtnDisabled]}>
            <Icon name="chevron-left" color={currentIndex === 0 ? COLORS.border : COLORS.primary} size={22} />
            <Text style={[styles.bottomBtnText, currentIndex === 0 && styles.bottomBtnTextDisabled]}>Önceki</Text>
          </Pressable>

          <View style={styles.bottomCenter}>
            <Text style={styles.bottomCenterText}>Soru {currentIndex + 1}/{totalQuestions}</Text>
          </View>

          <Pressable onPress={handleNext} disabled={currentIndex === totalQuestions - 1} style={[styles.bottomBtn, currentIndex === totalQuestions - 1 && styles.bottomBtnDisabled]}>
            <Text style={[styles.bottomBtnText, currentIndex === totalQuestions - 1 && styles.bottomBtnTextDisabled]}>Sonraki</Text>
            <Icon name="chevron-right" color={currentIndex === totalQuestions - 1 ? COLORS.border : COLORS.primary} size={22} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FF' },
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E8EAF6', elevation: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 },
  backBtn: { padding: 6, borderRadius: 20 },
  headerTitle: { flex: 1 },
  headerSubject: { fontSize: 15, fontWeight: '800', color: '#1565C0', letterSpacing: -0.3 },
  headerTopic: { fontSize: 11, fontWeight: '600', color: '#757575', textTransform: 'uppercase', letterSpacing: 0.5 },
  questionBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  questionBadgeWarning: { backgroundColor: '#FFEBEE' },
  questionBadgeText: { fontSize: 13, fontWeight: '800', color: '#1565C0' },
  questionBadgeTextWarning: { color: '#D32F2F' },
  progressBg: { height: 4, backgroundColor: '#E8EAF6', marginHorizontal: 16 },
  progressFill: { height: 4, backgroundColor: '#1565C0', borderRadius: 4 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4, paddingBottom: 6 },
  progressText: { fontSize: 10, fontWeight: '600', color: '#9E9E9E' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginLeft: 8 },
  questionNumBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  questionNumText: { color: '#1565C0', fontWeight: '800', fontSize: 12 },
  topicBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  topicBadgeText: { color: '#757575', fontWeight: '600', fontSize: 11 },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1565C0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(21,101,192,0.08)',
      }
    }),
    overflow: 'hidden'
  },
  questionAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#1565C0', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  questionText: { fontSize: 16, fontWeight: '500', color: '#212121', lineHeight: 26, marginLeft: 8 },
  imageContainer: { marginTop: 14, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F5F5F5', height: 180 },
  questionImage: { width: '100%', height: '100%' },
  optionsContainer: { gap: 10, marginBottom: 24 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 2 },
  optionBtnSelected: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  optionBtnUnselected: { backgroundColor: '#FFFFFF', borderColor: '#E8EAF6' },
  optionLabel: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optionLabelSelected: { backgroundColor: 'rgba(255,255,255,0.25)' },
  optionLabelUnselected: { backgroundColor: '#E3F2FD' },
  optionLabelText: { fontWeight: '800', fontSize: 14 },
  optionLabelTextSelected: { color: '#FFFFFF' },
  optionLabelTextUnselected: { color: '#1565C0' },
  optionText: { flex: 1, fontWeight: '500', fontSize: 14, lineHeight: 20 },
  optionTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  optionTextUnselected: { color: '#212121' },
  navigatorContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }
    })
  },
  navigatorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  navigatorTitle: { fontSize: 11, fontWeight: '700', color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.8 },
  navigatorCount: { fontSize: 11, fontWeight: '700', color: '#1565C0' },
  navigatorRow: { flexDirection: 'row', gap: 8 },
  navBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  navBtnText: { fontSize: 12, fontWeight: '700' },
  finishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#388E3C', padding: 16, borderRadius: 16, marginTop: 4 },
  finishBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, letterSpacing: 0.5, textTransform: 'uppercase' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EAF6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
      }
    })
  },
  bottomBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  bottomBtnDisabled: { opacity: 0.4 },
  bottomBtnText: { fontSize: 12, fontWeight: '700', color: '#1565C0', textTransform: 'uppercase' },
  bottomBtnTextDisabled: { color: '#BDBDBD' },
  bottomCenter: { alignItems: 'center' },
  bottomCenterText: { fontSize: 12, fontWeight: '700', color: '#9E9E9E' },
});
