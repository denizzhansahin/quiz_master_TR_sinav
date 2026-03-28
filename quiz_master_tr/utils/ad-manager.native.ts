import mobileAds, { MaxAdContentRating, AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// Reklam ID'si
const adUnitId = (__DEV__ ? TestIds.APP_OPEN : process.env.adUnitIdAdManager) || TestIds.APP_OPEN;

// Reklam objesini modül düzeyinde oluşturuyoruz (Singleton)
const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
  keywords: ['education', 'quiz', 'learning'],
});

export const setupAds = async () => {
  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false, 
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: [
        'EMULATOR', 
      ],
    });

    const adapterStatuses = await mobileAds().initialize();
    console.log('AdMob Başlatıldı:', adapterStatuses);

  } catch (error) {
    console.warn('AdMob kurulum hatası:', error);
  }
};

export const useAppOpenAds = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // 1. Reklamı ilk açılışta yükle
    appOpenAd.load();

    // 2. Reklam kapandığında yenisini yükle
    const unsubscribeDismissed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      appOpenAd.load();
    });

    // 3. Uygulama durumunu (Ön plan/Arka plan) dinle
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
        if (appOpenAd.loaded) {
          appOpenAd.show();
        } else {
          appOpenAd.load();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      unsubscribeDismissed();
    };
  }, []);
};