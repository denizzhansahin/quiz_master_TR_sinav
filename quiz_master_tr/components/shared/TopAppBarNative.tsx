import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '../icons/Icon';

export default function TopAppBarNative() {
  const router = useRouter();
  return (
    <View className="bg-white/80 dark:bg-slate-900/80 z-50 w-full mb-px">
      <View className="flex-row items-center justify-between px-6 py-4 w-full">
        <View className="flex-row items-center gap-3">
          <Icon name="menu-book" className="text-blue-700 dark:text-blue-400" />
          <Text className="font-headline font-bold text-xl text-blue-700 dark:text-blue-400 tracking-tighter">Quiz Master TR</Text>
        </View>
        <Pressable 
          onPress={() => router.push('/settings')}
          className="transition-colors p-2 rounded-full active:scale-95 duration-200"
        >
          <Icon name="settings" className="text-slate-500" />
        </Pressable>
      </View>
    </View>
  );
}
