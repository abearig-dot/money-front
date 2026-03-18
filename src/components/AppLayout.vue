<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme';

const { themeClass } = useTheme(); //
</script>

<template>
  <view class="app-layout" :class="themeClass">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.app-layout {
  /* 确保外层容器至少占满屏幕，背景色跟随 CSS 变量 */
  min-height: 100vh;
  background-color: var(--bg-base);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
  
  /* 这里可以统一处理 iOS 底部安全区 */
  padding-bottom: env(safe-area-inset-bottom);
}
</style>