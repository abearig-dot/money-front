<template>
  <view class="custom-tab-bar">
    <view 
      class="tab-item" 
      :class="{ active: currentPath === item.pagePath }"
      v-for="(item, index) in tabList" 
      :key="index"
      @click="handleSwitch(item)"
    >
      <template v-if="!item.isAction">
        <text class="tab-icon">{{ item.icon }}</text>
        <text class="tab-text">{{ item.text }}</text>
      </template>

      <template v-else>
        <view class="action-btn-wrapper">
          <view class="action-btn">
            <text class="plus-icon">+</text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 接收父组件（当前页面）传来的路径，用于判断哪个 tab 应该高亮
const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
})

// Tab 列表配置
const tabList = [
  { pagePath: '/pages/index/index', text: '明细', icon: '🏠', isAction: false },
  { pagePath: '/pages/chart/chart', text: '图表', icon: '📊', isAction: false },
  // 特殊的中间按钮，不需要 pagePath
  { isAction: true }, 
  { pagePath: '/pages/bill/bill', text: '账单', icon: '🧾', isAction: false },
  { pagePath: '/pages/mine/mine', text: '我的', icon: '👤', isAction: false }
]

const handleSwitch = (item: any) => {
  if (item.isAction) {
    // 点击中间的加号按钮，由于记账通常不需要作为 Tab 页，可以使用 navigateTo 跳转或唤起弹窗
    console.log("触发记账功能")
    uni.navigateTo({ url: '/pages/record/record' }) 
    return
  }
  
  // 已经是当前页，不跳转
  if (props.currentPath === item.pagePath) return

  // 点击其他 Tab，使用 switchTab 进行跳转
  uni.switchTab({
    url: item.pagePath
  })
}
</script>

<style lang="scss">
/* 这里就是刚才那段高级感毛玻璃 CSS，原封不动搬过来 */
// 只修改 style 部分
.custom-tab-bar {
  position: fixed;
  bottom: 40rpx;
  left: 5%;
  width: 90%;
  height: 120rpx;
  /* 修正：使用 TabBar 专属变量 */
  background: var(--bg-tabbar);
  border: 1px solid var(--border-tabbar);
  backdrop-filter: blur(20px);
  border-radius: 60rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.2); /* 弱化一点阴影 */
  z-index: 100;
  padding: 0 10rpx;
  box-sizing: border-box;

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    width: 100rpx;

    .tab-icon {
      font-size: 38rpx;
      filter: grayscale(100%) opacity(0.4);
      transition: all 0.3s ease;
    }
    .tab-text {
      font-size: 20rpx;
      /* 修正：使用次要文本变量 */
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    &.active {
      .tab-icon { filter: none; }
      /* 修正：高亮时使用主文本变量 */
      .tab-text { color: var(--text-primary); font-weight: 500; }
    }
  }

  .action-btn-wrapper {
    position: relative;
    top: -30rpx;
    
    .action-btn {
      width: 110rpx;
      height: 110rpx;
      /* 修正：使用品牌色 */
      background: var(--accent-color);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 12rpx 24rpx rgba(253, 224, 71, 0.3);
      /* 修正：边框与页面底色融为一体，产生挖空效果 */
      border: 8rpx solid var(--bg-base); 
      
      .plus-icon {
        font-size: 60rpx;
        color: #121212; /* 这里保持黑色，因为按钮底色是明亮的黄色 */
        font-weight: 300;
        margin-top: -6rpx;
      }
      &:active { transform: scale(0.95); }
    }
  }
}
</style>