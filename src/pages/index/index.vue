<template>
  <AppLayout>
    <view class="home-container">
      <CustomNavBar />

      <view class="page-greeting">
        <text class="greeting-text">欢迎回来，今天也要理性消费哦 ✨</text>

        <picker
          mode="date"
          fields="month"
          :value="currentDate"
          @change="onMonthChange"
        >
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

          <view
            class="record-item"
            v-for="(item, idx) in day.list"
            :key="idx"
            @click="openDetail(item)"
          >
            <view class="item-left">
              <view class="icon-box">{{ item.icon }}</view>
              <view class="detail">
                <text class="category">{{ item.category }}</text>
                <text class="remark" v-if="item.remark">{{ item.remark }}</text>
              </view>
            </view>
            <view class="item-right">
              <text
                class="price"
                :class="
                  item.type === 'expense' ? 'color-expense' : 'color-income'
                "
              >
                {{ item.type === "expense" ? "-" : "+" }}{{ item.amount }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <RecordDetailSheet ref="detailSheetRef" />
      <CustomTabBar currentPath="/pages/index/index" />
    </view>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import RecordDetailSheet from "@/components/RecordDetailSheet.vue";
const currentDate = ref("2026-03");
// 1. 创建组件的引用
const detailSheetRef = ref<InstanceType<typeof RecordDetailSheet> | null>(null);
const displayMonth = computed(() => {
  const parts = currentDate.value.split("-");
  if (parts.length === 2) {
    return `${parts[1]}月`;
  }
  return "本月";
});

const mockData = ref([
  {
    date: "03月16日 星期一",
    total: "33.00",
    list: [
      {
        id: 1,
        icon: "🍽️",
        category: "餐饮",
        remark: "和朋友聚餐",
        amount: "33.00",
        type: "expense",
      },
    ],
  },
  {
    date: "03月15日 星期日",
    total: "210.00",
    list: [
      {
        id: 2,
        icon: "🛒",
        category: "购物",
        remark: "超市采购",
        amount: "150.00",
        type: "expense",
      },
      {
        id: 3,
        icon: "🚕",
        category: "交通",
        remark: "打车回家",
        amount: "60.00",
        type: "expense",
      },
    ],
  },
]);

const onMonthChange = (e: any) => {
  const selected = e.detail.value;
  currentDate.value = selected;
};
// 2. 创建点击事件，打开弹窗
const openDetail = (item: any) => {
  // 整理数据传给弹窗，你可以根据实际的接口字段调整
  const mockRecordData = {
    type: "expense", // 或者 'income'
    icon: "🍽️",
    category: "餐饮美食", // 你之前代码里的 item.detail.category
    amount: "120.00", // 你之前代码里的 item.price
    time: "2023-10-24 12:30",
    remark: "和朋友聚餐", // 你之前代码里的 item.detail.remark
    account: "招商银行储蓄卡",
  };

  if (detailSheetRef.value) {
    detailSheetRef.value.open(mockRecordData);
  }
};
const goToChart = () => {
  uni.switchTab({
    url: "/pages/chart/chart",
  });
};
</script>

<style lang="scss">
/* 核心：定义财务数字专属字体栈 */
@mixin font-number {
  font-family:
    "DIN Alternate",
    "Avenir Next",
    "Helvetica Neue",
    -apple-system,
    sans-serif;
}

.home-container {
  min-height: 100vh;
  /* 严格使用 uni.scss 中定义的基础底色 */
  background-color: var(--bg-base);
  padding: 20rpx 40rpx 120rpx;
  box-sizing: border-box;
  /* 应用全局过渡，保证切换暗黑模式时丝滑 */
  transition: var(--theme-transition);
}

.page-greeting {
  margin-bottom: 30rpx;
  padding: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .greeting-text {
    font-size: 26rpx;
    color: var(--text-secondary);
    letter-spacing: 1rpx;
    font-weight: 400;
  }
}

.month-picker {
  /* 使用悬浮交互色作为胶囊背景，比纯白稍暗，拉开层次 */
  background-color: var(--surface-hover);
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  transition: all 0.2s ease;

  .month-text {
    font-size: 26rpx;
    font-weight: 600;
    color: var(--text-primary);
  }

  .icon-arrow {
    font-size: 22rpx;
    color: var(--text-secondary);
  }

  &:active {
    opacity: 0.7;
    transform: scale(0.96);
  }
}

.asset-card {
  position: relative;
  /* 使用高亮卡片层级与全局阴影 */
  background-color: var(--surface-card);
  border: 1px solid var(--divider);
  border-radius: 40rpx; /* 更大圆角提升现代感 */
  padding: 50rpx 40rpx; /* 增加留白(Breathing Room) */
  margin-bottom: 60rpx;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: var(--theme-transition);

  .card-top {
    display: flex;
    flex-direction: column;
    margin-bottom: 50rpx;
    position: relative;
    z-index: 2;

    .label {
      font-size: 26rpx;
      color: var(--text-secondary);
      margin-bottom: 16rpx;
      font-weight: 500;
    }
    .amount {
      @include font-number;
      font-size: 76rpx; /* 进一步放大核心资产字号 */
      font-weight: 700;
      letter-spacing: -2rpx; /* 财务字体缩紧间距 */
      color: var(--text-primary);
    }
  }

  .card-bottom {
    display: flex;
    align-items: center;
    background-color: var(--surface-hover); /* 内部信息块使用交互色打底 */
    border-radius: 24rpx;
    padding: 24rpx;
    position: relative;
    z-index: 2;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10rpx;

      .stat-label {
        font-size: 24rpx;
        color: var(--text-secondary);
        font-weight: 500;
      }
      .stat-val {
        @include font-number;
        font-size: 32rpx;
        font-weight: 600;
      }
    }

    .divider {
      width: 2rpx;
      height: 48rpx;
      background-color: var(--text-tertiary);
      margin: 0 30rpx;
    }
  }

  .glow-circle {
    position: absolute;
    top: -80rpx;
    right: -80rpx;
    width: 280rpx;
    height: 280rpx;
    background-color: var(--color-primary); /* 绑定品牌蓝 */
    border-radius: 50%;
    filter: blur(100rpx); /* 加大模糊半径，让光效更柔和 */
    opacity: 0.15; /* 降低透明度，避免抢夺主视觉 */
    z-index: 1;
    pointer-events: none;
  }
}

/* 统一绑定全局收支颜色变量 */
.color-expense {
  color: var(--color-expense) !important;
}
.color-income {
  color: var(--color-income) !important;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  .section-title {
    font-size: 34rpx;
    font-weight: 600;
    color: var(--text-primary);
  }
  .section-more {
    font-size: 24rpx;
    color: var(--text-secondary);
    padding: 10rpx 0 10rpx 20rpx;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.6;
    }
  }
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;

  .day-group {
    background-color: var(--surface-card);
    border: 1px solid var(--divider);
    border-radius: 32rpx;
    padding: 0 32rpx;
    box-shadow: var(--shadow-card);
    transition: var(--theme-transition);

    .day-info {
      display: flex;
      justify-content: space-between;
      padding: 28rpx 0;
      border-bottom: 1px solid var(--divider);

      .date,
      .day-expense {
        font-size: 24rpx;
        font-weight: 500;
        color: var(--text-secondary);
      }

      .day-expense {
        @include font-number;
      }
    }

    .record-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 0;
      border-bottom: 1px solid var(--divider);
      transition: background-color 0.2s;

      &:active {
        background-color: rgba(0, 0, 0, 0.02); /* 轻微点击反馈 */
      }

      &:last-child {
        border-bottom: none;
      }

      .item-left {
        display: flex;
        align-items: center;
        gap: 28rpx;

        .icon-box {
          width: 80rpx;
          height: 80rpx;
          background-color: var(--surface-hover);
          border-radius: 24rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 40rpx; /* 图标稍微放大 */
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 8rpx;

          .category {
            font-size: 30rpx;
            font-weight: 600;
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
          @include font-number;
          font-size: 36rpx;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
