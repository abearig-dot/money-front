// src/hooks/useTheme.ts
import { computed } from 'vue';
import { useAppStore } from '@/store/app';

export function useTheme() {
  const appStore = useAppStore();
  
  // 派生出注入到容器的 class 绑定
  const themeClass = computed(() => {
    return appStore.theme === 'dark' ? 'theme-dark' : '';
  });

  return {
    themeClass,
    toggleTheme: appStore.toggleTheme
  };
}