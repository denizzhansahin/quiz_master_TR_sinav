import React from 'react';
import { View, Pressable, Text } from 'react-native';
import Icon from '../icons/Icon';

export default function BottomNavBarNative() {
  return (
    <View className="absolute bottom-0 left-0 w-full flex-row justify-around items-center px-4 pb-6 pt-3 bg-white/80 dark:bg-slate-900/80 z-50 rounded-t-3xl shadow-sm border-t border-slate-200/15">
      {/* Library */}
      <Pressable className="flex-col items-center justify-center px-4 py-2 hover:text-blue-500 transition-all duration-300 ease-out">
        <Icon name="grid-view" className="mb-1 text-slate-500 dark:text-slate-400" />
        <Text className="font-body text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Library</Text>
      </Pressable>
      {/* Practice (Active) */}
      <Pressable className="flex-col items-center justify-center bg-blue-600 dark:bg-blue-500 rounded-2xl px-5 py-2 scale-110 shadow-sm transition-all duration-300 ease-out">
        <Icon name="quiz" className="mb-1 text-white" />
        <Text className="font-body text-[11px] font-semibold tracking-wide uppercase text-white">Practice</Text>
      </Pressable>
      {/* Stats */}
      <Pressable className="flex-col items-center justify-center px-4 py-2 hover:text-blue-500 transition-all duration-300 ease-out">
        <Icon name="leaderboard" className="mb-1 text-slate-500 dark:text-slate-400" />
        <Text className="font-body text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Analysis</Text>
      </Pressable>
      {/* Profile */}
      <Pressable className="flex-col items-center justify-center px-4 py-2 hover:text-blue-500 transition-all duration-300 ease-out">
        <Icon name="person" className="mb-1 text-slate-500 dark:text-slate-400" />
        <Text className="font-body text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Profile</Text>
      </Pressable>
    </View>
  );
}
