<template>
  <view class="sheet-wrapper" :class="{ 'is-active': isVisible }" @touchmove.stop.prevent>
    <view class="sheet-mask" @click="close"></view>
    
    <view class="sheet-content">
      <view class="drag-indicator"></view>
      
      <view class="sheet-header">
        <text class="title">账单详情</text>
        <view class="close-btn" @click="close">×</view>
      </view>

      <view class="sheet-body" v-if="record">
        <view class="amount-section">
          <view class="icon-box">{{ record.icon || '💰' }}</view>
          <text class="category-name">{{ record.category || '未分类' }}</text>
          <text class="amount-value" :class="record.type === 'expense' ? 'color-expense' : 'color-income'">
            {{ record.type === 'expense' ? '-' : '+' }}{{ record.amount }}
          </text>
        </view>

        <view class="detail-list">
          <view class="detail-row">
            <text class="label">记录时间</text>
            <text class="value">{{ record.time || '2023-10-24 14:30' }}</text>
          </view>
          <view class="detail-row">
            <text class="label">账单备注</text>
            <text class="value">{{ record.remark || '无备注' }}</text>
          </view>
          <view class="detail-row">
            <text class="label">资金账户</text>
            <text class="value">{{ record.account || '微信钱包' }}</text>
          </view>
        </view>

        <view class="action-group">
          <view class="btn btn-delete" @click="handleDelete">删除</view>
          <view class="btn btn-edit" @click="handleEdit">编辑</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 控制弹窗显示隐藏的状态
const isVisible = ref(false)
// 存储当前点击的账单数据
const record = ref<any>(null)

// 暴露给父组件调用的 open 方法
const open = (data: any) => {
  record.value = data
  isVisible.value = true
}

// 关闭弹窗
const close = () => {
  isVisible.value = false
  // 延迟清空数据，等动画执行完
  setTimeout(() => {
    record.value = null
  }, 300)
}

// 模拟操作事件
const handleEdit = () => {
  uni.showToast({ title: '触发编辑', icon: 'none' })
  close()
}

const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，是否继续？',
    confirmColor: '#ff453a', // 危险操作使用红色
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已删除', icon: 'success' })
        close()
        // 这里后续可以调用 Pinia store 或者 emit 事件通知父组件刷新列表
      }
    }
  })
}

// 宏编译，向外暴露方法
defineExpose({
  open,
  close
})
</script>

<style lang="scss">
@mixin font-number {
  font-family: 'DIN Alternate', 'Avenir Next', 'Helvetica Neue', -apple-system, sans-serif;
}

.sheet-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: none; /* 默认不拦截点击 */

  &.is-active {
    pointer-events: auto;

    .sheet-mask {
      opacity: 1;
    }
    .sheet-content {
      transform: translateY(0);
    }
  }
}

.sheet-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px); /* 高级毛玻璃效果 */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sheet-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-base); /* 贴合主题底色 */
  border-radius: 40rpx 40rpx 0 0;
  padding: 20rpx 40rpx calc(40rpx + env(safe-area-inset-bottom)); /* 适配 iOS 底部安全区 */
  box-sizing: border-box;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); /* 丝滑阻尼动画 */
  box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.1);

  .drag-indicator {
    width: 80rpx;
    height: 10rpx;
    background-color: var(--divider);
    border-radius: 10rpx;
    margin: 0 auto 30rpx;
  }
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;

  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--text-primary);
  }

  .close-btn {
    font-size: 44rpx;
    color: var(--text-tertiary);
    line-height: 1;
    padding: 10rpx;
    margin-right: -10rpx;
    
    &:active {
      opacity: 0.6;
    }
  }
}

.amount-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;

  .icon-box {
    width: 96rpx;
    height: 96rpx;
    background-color: var(--surface-hover);
    border-radius: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48rpx;
    margin-bottom: 20rpx;
    border: 1px solid var(--divider);
  }

  .category-name {
    font-size: 30rpx;
    color: var(--text-primary);
    margin-bottom: 12rpx;
  }

  .amount-value {
    @include font-number;
    font-size: 72rpx;
    font-weight: 700;
    letter-spacing: -2rpx;
  }
}

.detail-list {
  background-color: var(--surface-card);
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  margin-bottom: 50rpx;
  border: 1px solid var(--divider);

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 24rpx 0;
    border-bottom: 1px solid var(--divider);

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-size: 28rpx;
      color: var(--text-secondary);
    }

    .value {
      font-size: 28rpx;
      color: var(--text-primary);
      font-weight: 500;
    }
  }
}

.action-group {
  display: flex;
  gap: 30rpx;

  .btn {
    flex: 1;
    text-align: center;
    padding: 26rpx 0;
    border-radius: 24rpx;
    font-size: 30rpx;
    font-weight: 600;
    transition: all 0.2s;

    &:active {
      transform: scale(0.96);
      opacity: 0.8;
    }
  }

  .btn-delete {
    background-color: var(--surface-hover);
    color: var(--color-expense); /* 使用支出红作为危险色 */
  }

  .btn-edit {
    background-color: var(--text-primary);
    color: var(--bg-base); /* 反色高亮 */
  }
}

.color-expense { color: var(--color-expense); }
.color-income { color: var(--color-income); }
</style>