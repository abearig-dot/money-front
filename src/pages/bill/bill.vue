<template>
  <AppLayout>
    <view class="bill-container">
      <CustomNavBar title="账单" />

      <view class="header-section">
        <view class="month-selector">
          <picker mode="date" fields="month" :value="currentMonth" @change="onMonthChange">
            <view class="picker-content">
              <text class="year">{{ currentYear }}年</text>
              <view class="month-row">
                <text class="month">{{ currentMonthNumber }}</text>
                <text class="month-label">月</text>
                <text class="arrow-icon">▼</text>
              </view>
            </view>
          </picker>
        </view>

        <view class="summary-card">
          <view class="summary-item">
            <text class="label">支出 (元)</text>
            <text class="value color-expense">{{ monthlyData.expense }}</text>
          </view>
          <view class="summary-item">
            <text class="label">收入 (元)</text>
            <text class="value color-income">{{ monthlyData.income }}</text>
          </view>
          <view class="summary-item">
            <text class="label">结余</text>
            <text class="value">{{ monthlyData.balance }}</text>
          </view>
        </view>
      </view>

      <scroll-view scroll-y class="bill-list-scroll" :show-scrollbar="false">
        <view class="list-content" v-if="groupedBills.length > 0">
          <view 
            class="day-group" 
            v-for="(group, groupIndex) in groupedBills" 
            :key="groupIndex"
          >
            <view class="day-header">
              <view class="date-info">
                <text class="day">{{ group.date }}</text>
                <text class="weekday">{{ group.weekday }}</text>
              </view>
              <view class="day-summary">
                <text v-if="group.income > 0">收 {{ group.income.toFixed(2) }}</text>
                <text v-if="group.expense > 0" class="expense-text">支 {{ group.expense.toFixed(2) }}</text>
              </view>
            </view>

            <view class="record-item" v-for="(item, index) in group.records" :key="index" @click="openDetail(item)">
              <view class="item-left">
                <view class="icon-box">{{ item.icon }}</view>
                <view class="detail">
                  <text class="category">{{ item.category }}</text>
                  <text class="time-remark">{{ item.time }} <text v-if="item.remark">| {{ item.remark }}</text></text>
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

        <view class="empty-state" v-else>
          <view class="empty-icon">📝</view>
          <text class="empty-text">本月暂无账单记录</text>
        </view>
        
        <view class="safe-bottom"></view>
      </scroll-view>

      <CustomTabBar currentPath="/pages/bill/bill" />
    </view>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// --- 时间逻辑 ---
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonthNumber = ref(String(today.getMonth() + 1).padStart(2, '0'))
const currentMonth = computed(() => `${currentYear.value}-${currentMonthNumber.value}`)

const onMonthChange = (e: any) => {
  const [year, month] = e.detail.value.split('-')
  currentYear.value = parseInt(year)
  currentMonthNumber.value = month
  fetchMonthlyData() // 切换月份时重新拉取数据
}

// --- 数据 Mock ---
const monthlyData = ref({
  expense: '0.00',
  income: '0.00',
  balance: '0.00'
})

// 按天分组的账单数据结构
const groupedBills = ref<any[]>([])

// 模拟网络请求获取该月数据
const fetchMonthlyData = () => {
  uni.showNavigationBarLoading()
  
  setTimeout(() => {
    // 假设这是后端返回的该月统计
    monthlyData.value = {
      expense: '3,250.00',
      income: '8,500.00',
      balance: '5,250.00'
    }

    // 假设这是后端返回的流水列表，前端进行渲染
    groupedBills.value = [
      {
        date: '10月24日',
        weekday: '星期二',
        expense: 120,
        income: 0,
        records: [
          { type: 'expense', category: '餐饮美食', icon: '🍽️', remark: '和朋友聚餐', time: '12:30', amount: '120.00' }
        ]
      },
      {
        date: '10月23日',
        weekday: '星期一',
        expense: 65,
        income: 300,
        records: [
          { type: 'income', category: '兼职外快', icon: '💻', remark: '私活尾款', time: '18:00', amount: '300.00' },
          { type: 'expense', category: '交通出行', icon: '🚕', remark: '打车回家', time: '21:15', amount: '65.00' }
        ]
      },
      {
        date: '10月20日',
        weekday: '星期五',
        expense: 450,
        income: 0,
        records: [
          { type: 'expense', category: '购物消费', icon: '🛍️', remark: '买衣服', time: '14:20', amount: '400.00' },
          { type: 'expense', category: '生活日用', icon: '🧻', remark: '超市采购', time: '16:00', amount: '50.00' }
        ]
      }
    ]
    uni.hideNavigationBarLoading()
  }, 400)
}

// 点击单条记录，我们同样可以发射事件唤起全局的“详情半屏弹窗”
// (如果你之前把详情做成了组件，可以在这里复用，这里先做个简单的 Log)
const openDetail = (item: any) => {
  console.log('查看详情:', item)
  // 如果你有详情弹窗，可以这样调：
  // uni.$emit('open-detail-sheet', item)
}

// 初始化
fetchMonthlyData()
</script>

<style lang="scss">
@mixin font-number {
  font-family: 'DIN Alternate', 'Avenir Next', 'Helvetica Neue', -apple-system, sans-serif;
}

.bill-container {
  min-height: 100vh;
  background-color: var(--bg-base);
  display: flex;
  flex-direction: column;
  transition: var(--theme-transition);
}

/* 1. 顶部固定区 */
.header-section {
  background-color: var(--bg-base);
  padding: 10rpx 40rpx 20rpx;
  z-index: 10;
}

.month-selector {
  margin-bottom: 30rpx;

  .picker-content {
    display: inline-flex;
    flex-direction: column;
    
    .year {
      font-size: 24rpx;
      color: var(--text-secondary);
      margin-bottom: 4rpx;
    }
    
    .month-row {
      display: flex;
      align-items: baseline;
      gap: 8rpx;
      
      .month {
        @include font-number;
        font-size: 56rpx;
        font-weight: 600;
        color: var(--text-primary);
        line-height: 1;
      }
      .month-label {
        font-size: 28rpx;
        color: var(--text-primary);
        font-weight: 500;
      }
      .arrow-icon {
        font-size: 20rpx;
        color: var(--text-tertiary);
        margin-left: 10rpx;
      }
    }
  }
}

.summary-card {
  display: flex;
  justify-content: space-between;
  background-color: var(--surface-card);
  border-radius: 32rpx;
  padding: 30rpx 40rpx;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--divider);

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 12rpx;

    .label {
      font-size: 24rpx;
      color: var(--text-secondary);
    }
    .value {
      @include font-number;
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

/* 统一颜色变量 */
.color-expense { color: var(--color-expense) !important; }
.color-income { color: var(--color-income) !important; }

/* 2. 流水列表区 */
.bill-list-scroll {
  flex: 1;
  height: 0;
}

.list-content {
  padding: 10rpx 40rpx 40rpx;
}

.day-group {
  margin-bottom: 40rpx;

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px solid var(--divider);

    .date-info {
      display: flex;
      align-items: baseline;
      gap: 16rpx;

      .day {
        font-size: 30rpx;
        font-weight: 600;
        color: var(--text-primary);
      }
      .weekday {
        font-size: 24rpx;
        color: var(--text-secondary);
      }
    }

    .day-summary {
      display: flex;
      gap: 20rpx;
      font-size: 24rpx;
      color: var(--text-secondary);
      @include font-number;

      .expense-text {
        margin-left: 10rpx;
      }
    }
  }

  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    transition: background-color 0.2s;
    border-radius: 20rpx;

    &:active {
      background-color: var(--surface-hover);
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 24rpx;

      .icon-box {
        width: 80rpx;
        height: 80rpx;
        background-color: var(--surface-card);
        border: 1px solid var(--divider);
        border-radius: 24rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40rpx;
      }

      .detail {
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .category {
          font-size: 30rpx;
          font-weight: 500;
          color: var(--text-primary);
        }
        .time-remark {
          font-size: 24rpx;
          color: var(--text-tertiary);
        }
      }
    }

    .item-right {
      .price {
        @include font-number;
        font-size: 36rpx;
        font-weight: 600;
      }
    }
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
    opacity: 0.5;
    filter: grayscale(100%);
  }
  .empty-text {
    font-size: 28rpx;
    color: var(--text-tertiary);
  }
}

.safe-bottom {
  height: 180rpx;
}
</style>