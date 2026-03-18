<template>
  <AppLayout>
    <view class="chart-container">
      <CustomNavBar title="财务图表" />

      <view class="segment-wrapper">
        <view class="segment-control">
          <view 
            class="segment-item" 
            :class="{ active: currentType === 'expense' }" 
            @click="switchType('expense')"
          >支出</view>
          <view 
            class="segment-item" 
            :class="{ active: currentType === 'income' }" 
            @click="switchType('income')"
          >收入</view>
          <view class="segment-slider" :class="currentType"></view>
        </view>
      </view>

      <view class="overview-card">
        <view class="time-tabs">
          <text 
            v-for="time in timeRanges" 
            :key="time.value"
            class="tab-item" 
            :class="{ active: currentTimeRange === time.value }" 
            @click="switchTimeRange(time.value)"
          >
            {{ time.label }}
          </text>
        </view>

        <view class="summary-box">
          <text class="summary-label">共计{{ currentType === 'expense' ? '支出' : '收入' }}</text>
          <text class="summary-amount" :class="currentType === 'expense' ? 'color-expense' : 'color-income'">
            <text class="currency">¥</text>{{ totalAmount }}
          </text>
        </view>

        <view class="chart-box">
          <qiun-data-charts 
            v-if="isChartVisible"
            type="area"
            :opts="chartOptions"
            :chartData="chartData"
            background="none"
            :canvas2d="true"
            :animation="true"
          />
        </view>
      </view>

      <view class="ranking-section">
        <text class="section-title">分类排行</text>
        <view class="ranking-list">
          <view class="ranking-item" v-for="(item, index) in rankingData" :key="index">
            <view class="item-icon">{{ item.icon }}</view>
            <view class="item-content">
              <view class="item-info">
                <text class="name">{{ item.name }}</text>
                <text class="amount">¥ {{ item.amount }}</text>
              </view>
              <view class="progress-bg">
                <view 
                  class="progress-bar" 
                  :style="{ 
                    width: item.percent + '%', 
                    backgroundColor: currentType === 'expense' ? 'var(--color-expense)' : 'var(--color-income)' 
                  }"
                ></view>
              </view>
            </view>
            <text class="percent-text">{{ item.percent }}%</text>
          </view>
        </view>
      </view>

      <view class="safe-bottom"></view>
      <CustomTabBar currentPath="/pages/chart/chart" />
    </view>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// 🌟 核心引入：必须使用 uni-app 的 onShow 和 onHide
import { onShow, onHide } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/app'
import qiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'

const appStore = useAppStore()
const currentType = ref<'expense' | 'income'>('expense')
const currentTimeRange = ref<'week' | 'month' | 'year'>('month')

// 🌟 图表显隐状态
const isChartVisible = ref(true)

const timeRanges = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '全年', value: 'year' }
]

const totalAmount = ref('0.00')
const chartData = ref({})
const rankingData = ref<any[]>([])

const themeColors = {
  light: { expense: '#f43f5e', income: '#10b981', text: '#9ca3af', grid: 'transparent' },
  dark: { expense: '#ff453a', income: '#32d74b', text: '#6b7280', grid: 'transparent' }
}

const chartOptions = computed(() => {
  const isDark = appStore.theme === 'dark'
  const colors = isDark ? themeColors.dark : themeColors.light
  const mainColor = currentType.value === 'expense' ? colors.expense : colors.income

  return {
    color: [mainColor],
    padding: [20, 10, 0, 10],
    enableScroll: false,
    legend: { show: false },
    xAxis: { disableGrid: true, fontColor: colors.text, axisLineColor: 'transparent', calibration: false },
    yAxis: { disabled: true, disableGrid: true },
    extra: { area: { type: 'curve', opacity: 0.6, addLine: true, width: 3, gradient: true } }
  }
})

const fetchChartData = () => {
  let categoriesData = []
  let seriesData = []
  let xAxis = []
  let mockTotal = ''

  if (currentType.value === 'expense') {
    categoriesData = [
      { name: '餐饮美食', icon: '🍽️', amount: '1,200.00', percent: 45 },
      { name: '交通出行', icon: '🚕', amount: '650.00', percent: 25 },
      { name: '购物消费', icon: '🛍️', amount: '500.00', percent: 18 }
    ]
    if (currentTimeRange.value === 'week') {
      mockTotal = '850.00'; xAxis = ['一', '二', '三', '四', '五', '六', '日']; seriesData = [45, 120, 30, 200, 15, 300, 140]
    } else if (currentTimeRange.value === 'month') {
      mockTotal = '3,250.00'; xAxis = ['01', '06', '12', '18', '24', '30']; seriesData = [120, 300, 150, 450, 200, 500]
    } else {
      mockTotal = '45,600.00'; xAxis = ['1月', '3月', '5月', '7月', '9月', '11月']; seriesData = [3200, 2800, 4100, 3500, 4800, 4200]
    }
  } else {
    categoriesData = [
      { name: '薪资', icon: '💰', amount: '5,000.00', percent: 70 },
      { name: '理财', icon: '📈', amount: '1,500.00', percent: 30 }
    ]
    if (currentTimeRange.value === 'week') {
      mockTotal = '1,500.00'; xAxis = ['一', '二', '三', '四', '五', '六', '日']; seriesData = [0, 0, 1500, 0, 0, 0, 0]
    } else if (currentTimeRange.value === 'month') {
      mockTotal = '6,500.00'; xAxis = ['01', '06', '12', '18', '24', '30']; seriesData = [0, 0, 5000, 0, 0, 1500]
    } else {
      mockTotal = '82,000.00'; xAxis = ['1月', '3月', '5月', '7月', '9月', '11月']; seriesData = [6500, 6500, 8000, 6500, 6500, 12000]
    }
  }

  totalAmount.value = mockTotal
  rankingData.value = categoriesData

  chartData.value = JSON.parse(JSON.stringify({
    categories: xAxis,
    series: [{ name: currentType.value === 'expense' ? "支出" : "收入", data: seriesData }]
  }))
}

const switchType = (type: 'expense' | 'income') => {
  if (currentType.value === type) return
  currentType.value = type
  fetchChartData()
}

const switchTimeRange = (range: 'week' | 'month' | 'year') => {
  if (currentTimeRange.value === range) return
  currentTimeRange.value = range
  fetchChartData()
}

// 🌟 核心：使用 onShow 替代 onMounted
onShow(() => {
  // 每次进入图表页，确保图表显示并加载数据
  isChartVisible.value = true
  fetchChartData()

  // 监听弹窗状态
  uni.$on('record-sheet-visibility', (isOpen) => {
    isChartVisible.value = !isOpen
    
    // 如果弹窗关闭（图表重新显示），延迟重绘，防止 uCharts 挂载失败变成白屏
    if (!isOpen) {
      setTimeout(() => {
        fetchChartData()
      }, 50)
    }
  })
})

// 🌟 核心：离开图表页立刻销毁监听，防止后台幽灵触发
onHide(() => {
  uni.$off('record-sheet-visibility')
})
</script>

<style lang="scss">
@mixin font-number {
  font-family: 'DIN Alternate', 'Avenir Next', 'Helvetica Neue', -apple-system, sans-serif;
}

.chart-container {
  min-height: 100vh;
  background-color: var(--bg-base);
  padding: 20rpx 40rpx 0;
  box-sizing: border-box;
  transition: var(--theme-transition);
}

.segment-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.segment-control {
  position: relative;
  display: flex;
  background-color: var(--surface-hover);
  border-radius: 16rpx;
  padding: 6rpx;
  width: 320rpx;

  .segment-item {
    flex: 1;
    text-align: center;
    font-size: 26rpx;
    font-weight: 500;
    color: var(--text-secondary);
    padding: 10rpx 0;
    position: relative;
    z-index: 2;
    transition: color 0.3s;

    &.active {
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .segment-slider {
    position: absolute;
    top: 6rpx;
    left: 6rpx;
    width: calc(50% - 6rpx);
    height: calc(100% - 12rpx);
    background-color: var(--surface-card);
    border-radius: 12rpx;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;

    &.income { transform: translateX(100%); }
  }
}

.overview-card {
  background-color: var(--surface-card);
  border-radius: 40rpx;
  padding: 40rpx 30rpx 10rpx;
  box-shadow: var(--shadow-card);
  margin-bottom: 50rpx;
  border: 1px solid var(--divider);
}

.time-tabs {
  display: flex;
  justify-content: center;
  gap: 60rpx;
  margin-bottom: 40rpx;

  .tab-item {
    font-size: 26rpx;
    color: var(--text-secondary);
    padding-bottom: 8rpx;
    position: relative;
    transition: color 0.3s;

    &.active {
      color: var(--text-primary);
      font-weight: 600;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 30rpx;
        height: 4rpx;
        background-color: var(--text-primary);
        border-radius: 4rpx;
      }
    }
  }
}

.summary-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;

  .summary-label {
    font-size: 24rpx;
    color: var(--text-secondary);
    margin-bottom: 12rpx;
  }

  .summary-amount {
    @include font-number;
    font-size: 72rpx;
    font-weight: 700;
    letter-spacing: -2rpx;

    .currency { font-size: 36rpx; margin-right: 8rpx; }
  }
}

.color-expense { color: var(--color-expense) !important; }
.color-income { color: var(--color-income) !important; }

/* 保留外层高度，防止 v-if 销毁后下方内容跳动 */
.chart-box {
  height: 380rpx;
  width: 100%;
  position: relative;
  z-index: 1;
}

.ranking-section {
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 30rpx;
    display: block;
  }

  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 36rpx;

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 24rpx;

      .item-icon {
        width: 72rpx;
        height: 72rpx;
        background-color: var(--surface-hover);
        border-radius: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36rpx;
      }

      .item-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16rpx;

        .item-info {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .name { font-size: 28rpx; font-weight: 500; color: var(--text-primary); }
          .amount { @include font-number; font-size: 30rpx; font-weight: 600; color: var(--text-primary); }
        }

        .progress-bg {
          width: 100%;
          height: 10rpx;
          background-color: var(--surface-hover);
          border-radius: 5rpx;
          overflow: hidden;

          .progress-bar {
            height: 100%;
            border-radius: 5rpx;
            transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s;
          }
        }
      }

      .percent-text {
        @include font-number;
        font-size: 24rpx;
        color: var(--text-secondary);
        width: 60rpx;
        text-align: right;
      }
    }
  }
}

.safe-bottom {
  height: 180rpx;
}
</style>