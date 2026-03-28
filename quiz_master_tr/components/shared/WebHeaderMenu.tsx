import React from 'react';
import Icon from '../icons/Icon';
import { router, usePathname } from 'expo-router';

export default function WebHeaderMenu() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        // Handle root/home special case (either / or /home)
        if (path === '/(tabs)') {
            return pathname === '/' || pathname === '/home';
        }
        // Check for other paths
        return pathname.includes(path.split('/').pop() || '');
    };

    const getBtnClass = (path: string) => {
        const base = "hover:text-primary transition-colors";
        return isActive(path) ? `${base} font-bold text-primary text-blue-700` : base;
    };

    return (
      <header className="w-full z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 md:px-12 h-16 shadow-sm shrink-0">
        <div className="flex items-center gap-10">
          <div className="text-xl font-extrabold tracking-tighter text-blue-800 font-headline cursor-pointer" onClick={() => router.push('/(tabs)')}>
            Quiz Master TR
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-on-surface-variant">
            <button onClick={() => router.push('/(tabs)')} className={getBtnClass('/(tabs)')}>Sınavlar</button>
            <button onClick={() => router.push('/(tabs)/subject_tree')} className={getBtnClass('/(tabs)/subject_tree')}>Konular</button>
            <button onClick={() => router.push('/(tabs)/statistics')} className={getBtnClass('/(tabs)/statistics')}>İstatistikler</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/settings' as any)}
            className="p-2 rounded-full hover:bg-blue-50 transition-all active:scale-90 group"
          >
            <Icon name="settings" className="text-blue-700 group-hover:rotate-45 transition-transform" />
          </button>

          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-primary-container">
            <button onClick={() => router.push('/statistics' as any)}>
            <Icon name="person" className="text-primary" size={20} />
            </button>
          </div>
        </div>
      </header>
    )
}