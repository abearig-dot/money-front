// src/store/app.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ThemeType = 'light' | 'dark';

export const useAppStore = defineStore('app', () => {
  // 响应式主题状态
  const theme = ref<ThemeType>('light');

  // 初始化主题 (建议在 App.vue 的 onLaunch 中调用)
  const initTheme = () => {
    const storedTheme = uni.getStorageSync('shark_theme') as ThemeType;
    if (storedTheme) {
      theme.value = storedTheme;
    } else {
      // 若无用户偏好，则跟随系统级偏好
      const sysInfo = uni.getSystemInfoSync();
      theme.value = sysInfo.theme === 'dark' ? 'dark' : 'light';
    }
    syncNativeUI();
  };

  // 切换主题方法
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    // 持久化用户选择
    uni.setStorageSync('shark_theme', theme.value);
    
    // 增加细微的 Taptic Engine 震动反馈，提升高级感
    // uni.vibrateShort({ type: 'light' }); 
    
    syncNativeUI();
  };

  // 同步原生 UI (如系统状态栏的时间、电池颜色)
  const syncNativeUI = () => {
    const isDark = theme.value === 'dark';
    // 动态调整微信原生导航栏文字颜色与背景
    uni.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#121212' : '#F2F2F7',
      animation: { duration: 300, timingFunc: 'easeIn' }
    });
    // 如果使用了原生 TabBar，也需要在这里 setTabBarItem，
    // 但我们的架构采用 CustomTabBar，所以只依赖 CSS Variables 即可自动变色。
  };

  return { 
    theme, 
    initTheme, 
    toggleTheme 
  };
});