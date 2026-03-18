<template>
  <view class="home-container">
    <CustomNavBar />
 
    <view class="page-greeting">
      <text class="greeting-text">欢迎回来，今天也要理性消费哦 ✨</text>
  
      <picker mode="date" fields="month" :value="currentDate" @change="onMonthChange">
        <view class="month-picker">
          <text class="month-text">{{ displayMonth }}</text>
          <text class="icon-arrow">▾</text>
        </view>
      </picker>
    </view>

    <view class="asset-card">
      <view class="card-top">
        <text class="label">本月结余 (元)</text>
        <text class="amount">1,750.00</text>
      </view>
      <view class="card-bottom">
        <view class="stat-item">
          <text class="stat-label">总收入</text>
          <text class="stat-val color-income">+5,000.00</text>
        </view>
        <view class="divider"></view>
        <view class="stat-item">
          <text class="stat-label">总支出</text>
          <text class="stat-val color-expense">-3,250.00</text>
        </view>
      </view>
      <view class="glow-circle"></view>
    </view>

    <view class="section-header">
      <text class="section-title">近期流水</text>
      <view class="section-more" @click="goToChart">
        <text>查看图表 ></text>
      </view>
    </view>

    <view class="record-list">
      <view class="day-group" v-for="(day, index) in mockData" :key="index">
        <view class="day-info">
          <text class="date">{{ day.date }}</text>
          <text class="day-expense">支出: {{ day.total }}</text>
        </view>
        
        <view class="record-item" v-for="(item, idx) in day.list" :key="idx">
          <view class="item-left">
            <view class="icon-box">{{ item.icon }}</view>
            <view class="detail">
              <text class="category">{{ item.category }}</text>
              <text class="remark" v-if="item.remark">{{ item.remark }}</text>
            </view>
          </view>
          <view class="item-right">
            <text class="price" :class="item.type === 'expense' ? 'color-expense' : 'color-income'">
              {{ item.type === 'expense' ? '-' : '+' }}{{ item.amount }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar currentPath="/pages/index/index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentDate = ref('2026-03')

const displayMonth = computed(() => {
  const parts = currentDate.value.split('-')
  if (parts.length === 2) {
    return `${parts[1]}月`
  }
  return '本月'
})

const mockData = ref([
  {
    date: '03月16日 星期一',
    total: '33.00',
    list: [
      { id: 1, icon: '🍽️', category: '餐饮', remark: '和朋友聚餐', amount: '33.00', type: 'expense' }
    ]
  },
  {
    date: '03月15日 星期日',
    total: '210.00',
    list: [
      { id: 2, icon: '🛒', category: '购物', remark: '超市采购', amount: '150.00', type: 'expense' },
      { id: 3, icon: '🚕', category: '交通', remark: '打车回家', amount: '60.00', type: 'expense' }
    ]
  }
])

const onMonthChange = (e: any) => {
  const selected = e.detail.value
  currentDate.value = selected
}

const goToChart = () => {
  uni.switchTab({
    url: '/pages/chart/chart'
  })
}
</script>

<style lang="scss">
.home-container {
  min-height: 100vh;
  /* 修正：使用背景变量，文字颜色从 page 继承即可 */
  background-color: var(--bg-base);
  padding: 20rpx 40rpx 120rpx; 
  box-sizing: border-box;
}

.page-greeting {
  margin-bottom: 30rpx;
  padding: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .greeting-text {
    font-size: 26rpx;
    /* 修正 */
    color: var(--text-secondary);
    letter-spacing: 1rpx;
  }
}

.month-picker {
  /* 修正：拾色器背景使用卡片背景 */
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 10rpx 26rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  transition: all 0.2s ease;

  .month-text {
    font-size: 26rpx;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .icon-arrow {
    font-size: 22rpx;
    color: var(--text-secondary);
    margin-top: 2rpx;
  }

  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.asset-card {
  position: relative;
  /* 修正：渐变背景使用变量映射，保持质感的同时支持浅色模式 */
  background: linear-gradient(135deg, var(--bg-card-hover) 0%, var(--bg-card) 100%);
  border: 1px solid var(--border-color);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 50rpx;
  overflow: hidden;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.05); /* 阴影调轻一点，兼顾浅色 */

  .card-top {
    display: flex;
    flex-direction: column;
    margin-bottom: 40rpx;
    position: relative;
    z-index: 2;

    .label {
      font-size: 26rpx;
      color: var(--text-secondary);
      margin-bottom: 12rpx;
    }
    .amount {
      font-size: 72rpx;
      font-weight: 700;
      letter-spacing: -2rpx;
      color: var(--text-primary);
    }
  }

  .card-bottom {
    display: flex;
    align-items: center;
    background: rgba(120, 120, 128, 0.08); /* 兼容明暗模式的透明遮罩 */
    border-radius: 20rpx;
    padding: 20rpx;
    position: relative;
    z-index: 2;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      
      .stat-label {
        font-size: 24rpx;
        color: var(--text-secondary);
      }
      .stat-val {
        font-size: 30rpx;
        font-weight: 600;
      }
    }
    
    .divider {
      width: 2rpx;
      height: 40rpx;
      background: var(--border-color);
      margin: 0 20rpx;
    }
  }

  .glow-circle {
    position: absolute;
    top: -50rpx;
    right: -50rpx;
    width: 200rpx;
    height: 200rpx;
    background: var(--accent-color);
    border-radius: 50%;
    filter: blur(80rpx);
    opacity: 0.2;
    z-index: 1;
  }
}

/* 修正：统一绑定全局收支颜色变量 */
.color-expense { color: var(--color-expense) !important; }
.color-income { color: var(--color-income) !important; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--text-primary);
  }
  .section-more {
    font-size: 24rpx;
    color: var(--text-secondary);
    padding: 10rpx 0 10rpx 20rpx; 
    
    &:active { opacity: 0.7; }
  }
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;

  .day-group {
    /* 修正：卡片背景 */
    background: var(--bg-card);
    border-radius: 24rpx;
    padding: 0 30rpx;

    .day-info {
      display: flex;
      justify-content: space-between;
      padding: 24rpx 0;
      /* 修正：边框线 */
      border-bottom: 1px solid var(--border-color);
      
      .date, .day-expense {
        font-size: 24rpx;
        color: var(--text-secondary);
      }
    }

    .record-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child { border-bottom: none; }

      .item-left {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .icon-box {
          width: 72rpx;
          height: 72rpx;
          /* 修正：图标底色 */
          background: var(--bg-card-hover);
          border-radius: 20rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 36rpx;
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 6rpx;

          .category {
            font-size: 30rpx;
            font-weight: 500;
            color: var(--text-primary);
          }
          .remark {
            font-size: 24rpx;
            color: var(--text-secondary);
          }
        }
      }

      .item-right {
        .price {
          font-size: 34rpx;
          font-weight: 600;
        }
      }
    }
  }
}
</style>