<template>
  <AppLayout>
  <view class="mine-container">
    <CustomNavBar title="我的" />

    <view class="user-profile-card" @click="handleLogin">
      <image 
        class="avatar" 
        :src="userInfo?.avatar || '/static/default-avatar.png'" 
        mode="aspectFill"
      />
      <view class="info-box">
        <text class="nickname">{{ userInfo?.nickname || '点击登录 / 注册' }}</text>
        <text class="slogan">{{ userInfo ? '记账，让生活更自由 ✨' : '登录后开启云端同步' }}</text>
      </view>
      <text class="arrow-icon">></text>
    </view>

    <view class="stats-card">
      <view class="stat-item">
        <text class="num">128</text>
        <text class="label">记账总天数</text>
      </view>
      <view class="divider"></view>
      <view class="stat-item">
        <text class="num">3,402</text>
        <text class="label">记账总笔数</text>
      </view>
    </view>

    <view class="menu-group">
      <view class="menu-item" hover-class="menu-item-hover">
        <view class="item-left">
          <text class="icon">🎯</text>
          <text class="title">每月预算设置</text>
        </view>
        <text class="arrow-icon">></text>
      </view>
      <view class="menu-item" hover-class="menu-item-hover">
        <view class="item-left">
          <text class="icon">🏷️</text>
          <text class="title">收支分类管理</text>
        </view>
        <text class="arrow-icon">></text>
      </view>
      <view class="menu-item" hover-class="menu-item-hover">
        <view class="item-left">
          <text class="icon">📥</text>
          <text class="title">账单数据导出</text>
        </view>
        <text class="arrow-icon">></text>
      </view>
    </view>

    <view class="menu-group">
      <view class="menu-item">
        <view class="item-left">
          <text class="icon">🌙</text>
          <text class="title">深色模式</text>
        </view>
        <switch 
          :checked="isDark" 
          @change="handleThemeChange" 
          color="#FDE047" 
          style="transform: scale(0.8); margin-right: -10rpx;"
        />
      </view>
      <view class="menu-item" hover-class="menu-item-hover">
        <view class="item-left">
          <text class="icon">💡</text>
          <text class="title">关于鲨鱼记账</text>
        </view>
        <text class="arrow-icon">></text>
      </view>
    </view>

    <view class="safe-bottom-padding"></view>
    <CustomTabBar currentPath="/pages/mine/mine" />
  </view>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { useAppStore } from '@/store/app';

// 引入状态机
const userStore = useUserStore();
const appStore = useAppStore();

// 派生状态
const userInfo = computed(() => userStore.userInfo);
const isDark = computed(() => appStore.theme === 'dark');

// 处理登录点击
const handleLogin = async () => {
  if (userInfo.value) return; // 已登录则不处理，或跳转到个人信息修改页
  
  try {
    uni.showLoading({ title: '授权中...' });
    await userStore.doWechatLogin();
    uni.hideLoading();
    uni.showToast({ title: '欢迎回来！', icon: 'success' });
  } catch (error) {
    uni.hideLoading();
    // 错误在 interceptor 或 store 里已经处理过 toast 了
  }
};

// 处理主题切换
const handleThemeChange = () => {
  appStore.toggleTheme();
};
</script>

<style lang="scss" scoped>
/* 整个页面的容器，继承底色 */
.mine-container {
  min-height: 100vh;
  background-color: var(--bg-base);
  padding: 20rpx 40rpx;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}

/* --- 用户信息卡片 --- */
.user-profile-card {
  display: flex;
  align-items: center;
  margin-top: 40rpx;
  margin-bottom: 60rpx;
  
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: var(--surface-hover); /* 占位底色 */
    border: 4rpx solid var(--surface-card);
    box-shadow: var(--shadow-card);
  }
  
  .info-box {
    flex: 1;
    margin-left: 30rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12rpx;
    
    .nickname {
      font-size: 40rpx;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .slogan {
      font-size: 24rpx;
      color: var(--text-secondary);
    }
  }
  
  .arrow-icon {
    font-size: 32rpx;
    color: var(--text-tertiary);
  }

  &:active {
    opacity: 0.7;
  }
}

/* --- 记账成就统计区 --- */
.stats-card {
  display: flex;
  align-items: center;
  background-color: var(--surface-card);
  border-radius: 32rpx;
  padding: 40rpx 0;
  box-shadow: var(--shadow-card);
  margin-bottom: 50rpx;
  transition: background-color 0.3s ease;
  
  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    
    .num {
      font-size: 44rpx;
      font-weight: 700;
      color: var(--text-primary);
      font-family: 'DIN Alternate', sans-serif; /* 建议使用等宽数字字体 */
    }
    .label {
      font-size: 24rpx;
      color: var(--text-secondary);
    }
  }
  
  .divider {
    width: 2rpx;
    height: 60rpx;
    background-color: var(--border-color);
  }
}

/* --- 功能菜单列表 --- */
.menu-group {
  background-color: var(--surface-card);
  border-radius: 32rpx;
  padding: 10rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: var(--shadow-card);
  transition: background-color 0.3s ease;
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 10rpx;
    border-bottom: 1px solid var(--border-color);
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-left {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .icon {
        font-size: 36rpx;
      }
      
      .title {
        font-size: 30rpx;
        color: var(--text-primary);
        font-weight: 500;
      }
    }
    
    .arrow-icon {
      font-size: 28rpx;
      color: var(--text-tertiary);
    }
  }
  
  /* 列表点击反馈 */
  .menu-item-hover {
    background-color: var(--bg-card-hover);
    border-radius: 16rpx;
  }
}

/* 为底部的 TabBar 留出空间 (结合了全局注入的 safe-area-bottom) */
.safe-bottom-padding {
  height: calc(140rpx + var(--safe-area-bottom));
  width: 100%;
}
</style>