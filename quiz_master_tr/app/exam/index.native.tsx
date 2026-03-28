import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Icon from '../../components/icons/Icon';
import questionsData from '../../assets/data/questions.json';
import { saveResult } from '../../utils/storage';

const COLORS = {
  primary: '#1565C0',
  secondaryContainer: '#C8E6C9',
  surfaceHigh: '#EEEEEE',
  onSurfaceVariant: '#757575',
  onPrimary: '#FFFFFF',
  secondary: '#388E3C',
  border: '#E0E0E0',
};

export default function RandomExamNativeScreen() {
  const router = useRouter();
  
  // Pick 20 random questions from the entire database
  const questions = useMemo(() => {
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 40);
  }, []);

  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const completedCount = Object.keys(userAnswers).length;

  const handleOptionSelect = (optionLabel: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionLabel }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const calculateAndFinish = useCallback(async () => {
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

    await saveResult({
      examType: 'RASTGELE',
      subject: 'Karışık Sınav',
      topic: 'Tüm Konular',
      correct,
      wrong,
      empty,
      total: totalQuestions,
      netScore,
      wrongIds,
      emptyIds,
      timeTaken: 0,
    });

    router.replace({
      pathname: '/result_analysis',
      params: { 
        correct, 
        wrong, 
        empty, 
        total: totalQuestions, 
        wrongIds: wrongIds.join(','), 
        emptyIds: emptyIds.join(','), 
        examType: 'RASTGELE', 
        subject: 'Karışık Sınav', 
        topic: 'Genel Tekrar', 
        timeTaken: 0 
      },
    });
  }, [userAnswers, questions, totalQuestions, router]);

  const progress = completedCount / totalQuestions;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="arrow-back" color={COLORS.primary} size={22} />
            </Pressable>
            <View style={styles.headerTitle}>
              <Text style={styles.headerSubject} numberOfLines={1}>Karışık Sınav Modu</Text>
              <Text style={styles.headerTopic} numberOfLines={1}>Tüm Konular ve Dersler</Text>
            </View>
            <View style={styles.questionBadge}>
              <Text style={styles.questionBadgeText}>Genel Test</Text>
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
                <Text style={styles.topicBadgeText}>{currentQuestion.examType} - {currentQuestion.subject}</Text>
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
          <Pressable onPress={() => calculateAndFinish()} style={styles.finishBtn}>
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
  questionBadgeText: { fontSize: 11, fontWeight: '800', color: '#1565C0' },
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
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, overflow: 'hidden', elevation: 3 },
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
  navigatorContainer: { marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, elevation: 1 },
  navigatorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  navigatorTitle: { fontSize: 11, fontWeight: '700', color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.8 },
  navigatorRow: { flexDirection: 'row', gap: 8 },
  navBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  navBtnText: { fontSize: 12, fontWeight: '700' },
  finishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#388E3C', padding: 16, borderRadius: 16, marginTop: 4 },
  finishBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, letterSpacing: 0.5, textTransform: 'uppercase' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E8EAF6', elevation: 8 },
  bottomBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  bottomBtnDisabled: { opacity: 0.4 },
  bottomBtnText: { fontSize: 12, fontWeight: '700', color: '#1565C0', textTransform: 'uppercase' },
  bottomBtnTextDisabled: { color: '#BDBDBD' },
  bottomCenter: { alignItems: 'center' },
  bottomCenterText: { fontSize: 12, fontWeight: '700', color: '#9E9E9E' },
});
