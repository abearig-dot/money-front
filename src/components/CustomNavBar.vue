<template>
  <view class="custom-navbar">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <view class="nav-content" :style="{ height: navBarHeight + 'px' }">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps({
  title: { type: String, default: '明细' }
})

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  // 获取状态栏高度
  statusBarHeight.value = sysInfo.statusBarHeight || 20

  // #ifdef MP-WEIXIN
  // 获取微信右上角胶囊按钮的坐标信息
  const menuInfo = uni.getMenuButtonBoundingClientRect()
  
  // 核心算法：导航栏高度 = (胶囊顶部距状态栏的距离) * 2 + 胶囊高度
  navBarHeight.value = (menuInfo.top - statusBarHeight.value) * 2 + menuInfo.height
  // #endif
})
</script>

<style lang="scss">
.custom-navbar {
  width: 100%;
  background-color: transparent; 
  
  .nav-content {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    
    .title {
      font-size: 34rpx;
      font-weight: 500;
      /* 修正：使用主文本变量 */
      color: var(--text-primary); 
      letter-spacing: 2rpx;
    }
  }
}
</style>