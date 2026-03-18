<template>
  <view
    class="sheet-wrapper"
    :class="{ 'is-active': isVisible }"
    @touchmove.stop.prevent
  >
    <view class="sheet-mask" @click="close"></view>
    <view class="sheet-content">
      <view class="drag-indicator"></view>

      <view class="segment-wrapper">
        <view class="segment-control">
          <view
            class="segment-item"
            :class="{ active: currentType === 'expense' }"
            @click="switchType('expense')"
            >支出</view
          >
          <view
            class="segment-item"
            :class="{ active: currentType === 'income' }"
            @click="switchType('income')"
            >收入</view
          >
          <view class="segment-slider" :class="currentType"></view>
        </view>
      </view>

      <scroll-view scroll-y class="category-scroll" :show-scrollbar="false">
        <view class="category-grid">
          <view
            class="category-item"
            v-for="(item, index) in currentCategories"
            :key="index"
            :class="{ 'is-selected': selectedCategory?.id === item.id }"
            @click="selectCategory(item)"
          >
            <view class="icon-box">{{ item.icon }}</view>
            <text class="name">{{ item.name }}</text>
          </view>
        </view>
        <view class="scroll-bottom-spacer"></view>
      </scroll-view>

      <view class="keyboard-area" :class="{ 'is-show': selectedCategory }">
        <view class="input-panel">
          <view class="remark-box">
            <text class="remark-icon">📝</text>
            <input
              class="remark-input"
              type="text"
              v-model="remark"
              placeholder="点击写备注..."
              placeholder-class="placeholder-style"
              cursor-spacing="20"
            />
          </view>
          <view class="amount-box">
            <text class="currency" :class="themeColorClass">¥</text>
            <text class="amount-text" :class="themeColorClass">{{
              expression
            }}</text>
          </view>
        </view>

        <view class="numpad-grid">
          <view class="key-btn" @click="handleKey('7')">7</view>
          <view class="key-btn" @click="handleKey('8')">8</view>
          <view class="key-btn" @click="handleKey('9')">9</view>
          <view class="key-btn action-key" @click="handleKey('BACK')">⌫</view>
          <view class="key-btn" @click="handleKey('4')">4</view>
          <view class="key-btn" @click="handleKey('5')">5</view>
          <view class="key-btn" @click="handleKey('6')">6</view>
          <view class="key-btn action-key font-large" @click="handleKey('+')"
            >+</view
          >
          <view class="key-btn" @click="handleKey('1')">1</view>
          <view class="key-btn" @click="handleKey('2')">2</view>
          <view class="key-btn" @click="handleKey('3')">3</view>
          <view class="key-btn action-key font-large" @click="handleKey('-')"
            >-</view
          >
          <view class="key-btn action-key" @click="handleKey('C')">C</view>
          <view class="key-btn" @click="handleKey('0')">0</view>
          <view class="key-btn font-large" @click="handleKey('.')">.</view>
          <view
            class="key-btn submit-key"
            :class="currentType === 'expense' ? 'bg-expense' : 'bg-income'"
            @click="handleKey('SUBMIT')"
          >
            {{ hasOperator ? "=" : "完成" }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from "vue";

// 【关键原理】在这里定义的变量属于“模块级作用域”。
// 无论你在几个 Tab 页中渲染了多少个 RecordActionSheet，它们全部强行共享这唯一的一个布尔值！
const sharedIsVisible = ref(false);
</script>

<script setup lang="ts">
// 将全局唯一状态绑定给当前实例的模板
const isVisible = sharedIsVisible;

const open = () => {
  currentType.value = "expense";
  selectedCategory.value = null;
  expression.value = "0";
  remark.value = "";

  // 此时一旦置为 true，所有后台潜伏的弹窗组件也会一起变为 true
  isVisible.value = true;
  uni.$emit("record-sheet-visibility", true);
};

const close = () => {
  // 只要用户在当前页关了它，全局变量变为 false
  // 后台所有的幽灵弹窗瞬间隐身，再也不用担心漏接信号！
  isVisible.value = false;
  uni.$emit("record-sheet-visibility", false);

  setTimeout(() => {
    selectedCategory.value = null;
  }, 300);
};

defineExpose({ open, close });

// --- 以下业务逻辑全部保持不变 ---
const expenseCategories = [
  { id: 1, name: "餐饮美食", icon: "🍽️" },
  { id: 2, name: "购物消费", icon: "🛍️" },
  { id: 3, name: "交通出行", icon: "🚕" },
  { id: 4, name: "休闲娱乐", icon: "🎮" },
  { id: 5, name: "生活日用", icon: "🧻" },
  { id: 6, name: "住房物业", icon: "🏠" },
  { id: 7, name: "医疗健康", icon: "💊" },
  { id: 8, name: "其他支出", icon: "💸" },
];

const incomeCategories = [
  { id: 101, name: "职业薪资", icon: "💰" },
  { id: 102, name: "理财收益", icon: "📈" },
  { id: 103, name: "兼职外快", icon: "💻" },
  { id: 104, name: "其他收入", icon: "🧧" },
];

const currentType = ref<"expense" | "income">("expense");
const currentCategories = computed(() =>
  currentType.value === "expense" ? expenseCategories : incomeCategories,
);
const selectedCategory = ref<any>(null);

const remark = ref("");
const expression = ref("0");

const themeColorClass = computed(() =>
  currentType.value === "expense" ? "color-expense" : "color-income",
);

const switchType = (type: "expense" | "income") => {
  if (currentType.value === type) return;
  currentType.value = type;
  // selectedCategory.value = null;
};

const selectCategory = (item: any) => {
  selectedCategory.value = item;
};

const hasOperator = computed(() => {
  const str = expression.value.substring(1);
  return str.includes("+") || str.includes("-");
});

const evaluateExpression = () => {
  try {
    let safeStr = expression.value.replace(/[+\-]$/, "");
    const tokens = safeStr.match(/[+\-]?(?:\d+\.?\d*|\.\d+)/g);
    if (!tokens) return;
    const result = tokens.reduce((sum, token) => sum + parseFloat(token), 0);
    expression.value = String(Math.round(result * 100) / 100);
  } catch (error) {
    uni.showToast({ title: "计算错误", icon: "none" });
    expression.value = "0";
  }
};

const handleKey = (key: string) => {
  try {
    // uni.vibrateShort({ type: "light" });
  } catch (error) {}

  let current = expression.value;

  if (key === "C") {
    expression.value = "0";
    return;
  }
  if (key === "BACK") {
    expression.value = current.length > 1 ? current.slice(0, -1) : "0";
    return;
  }

  if (key === "SUBMIT") {
    if (hasOperator.value) {
      evaluateExpression();
    } else {
      if (current === "0" || current === "0.00" || current === "0.") {
        uni.showToast({ title: "请输入金额", icon: "none" });
        return;
      }
      submitRecord();
    }
    return;
  }

  if (current.length >= 15) return;

  if (key === "+" || key === "-") {
    const lastChar = current.slice(-1);
    if (lastChar === "+" || lastChar === "-") {
      expression.value = current.slice(0, -1) + key;
      return;
    }
    if (hasOperator.value) {
      evaluateExpression();
      expression.value += key;
      return;
    }
    expression.value += key;
    return;
  }

  if (key === ".") {
    const parts = current.split(/[+\-]/);
    const currentPart = parts[parts.length - 1];
    if (currentPart.includes(".")) return;
    expression.value += key;
    return;
  }

  if (current === "0") {
    expression.value = key;
  } else {
    const parts = current.split(/[+\-]/);
    const currentPart = parts[parts.length - 1];
    if (currentPart === "0" && key !== ".") {
      expression.value = current.slice(0, -1) + key;
      return;
    }
    if (currentPart.includes(".") && currentPart.split(".")[1].length >= 2) {
      return;
    }
    expression.value += key;
  }
};

const submitRecord = () => {
  uni.showLoading({ title: "保存中..." });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: "记账成功", icon: "success" });
    close();
    uni.$emit("refresh-data");
  }, 600);
};
</script>

<style lang="scss">
/* 此处的 CSS 样式原封不动保留，完全无需任何修改，节约篇幅 */
@mixin font-number {
  font-family:
    "DIN Alternate",
    "Avenir Next",
    "Helvetica Neue",
    -apple-system,
    sans-serif;
}
.sheet-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
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
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.sheet-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85vh;
  background-color: var(--bg-base);
  border-radius: 40rpx 40rpx 0 0;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  .drag-indicator {
    width: 80rpx;
    height: 10rpx;
    background-color: var(--divider);
    border-radius: 10rpx;
    margin: 20rpx auto 10rpx;
  }
}
.segment-wrapper {
  display: flex;
  justify-content: center;
  padding: 20rpx 0;
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
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    &.income {
      transform: translateX(100%);
    }
  }
}
.category-scroll {
  flex: 1;
  height: 0;
  transition: all 0.3s ease;
}
.scroll-bottom-spacer {
  height: 40rpx;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40rpx 20rpx;
  padding: 20rpx 40rpx 20rpx;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  transition: transform 0.2s;
  &:active {
    transform: scale(0.95);
  }
  .icon-box {
    width: 96rpx;
    height: 96rpx;
    background-color: var(--surface-card);
    border: 1px solid var(--divider);
    border-radius: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 44rpx;
    transition: all 0.3s;
  }
  .name {
    font-size: 24rpx;
    color: var(--text-secondary);
  }
  &.is-selected {
    .icon-box {
      background-color: var(--surface-hover);
      transform: scale(1.1);
      border-color: transparent;
      box-shadow: var(--shadow-glow-expense);
    }
    .name {
      color: var(--text-primary);
      font-weight: 600;
    }
  }
}
.keyboard-area {
  transform: translateY(100%);
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  padding-bottom: env(safe-area-inset-bottom);
  &.is-show {
    transform: translateY(0);
    opacity: 1;
    height: auto;
    overflow: visible;
  }
}
.input-panel {
  background-color: var(--surface-card);
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  padding: 30rpx 40rpx;
  box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.05);
  border-top: 1px solid var(--divider);
}
.remark-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background-color: var(--surface-hover);
  padding: 16rpx 24rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  .remark-input {
    flex: 1;
    font-size: 26rpx;
    color: var(--text-primary);
  }
  .placeholder-style {
    color: var(--text-tertiary);
  }
}
.amount-box {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 10rpx;
  height: 90rpx;
  .currency {
    font-size: 40rpx;
    font-weight: 600;
  }
  .amount-text {
    @include font-number;
    font-size: 76rpx;
    font-weight: 700;
    letter-spacing: -2rpx;
  }
}
.color-expense {
  color: var(--color-expense) !important;
}
.color-income {
  color: var(--color-income) !important;
}
.bg-expense {
  background-color: var(--color-expense) !important;
  color: #ffffff !important;
}
.bg-income {
  background-color: var(--color-income) !important;
  color: #ffffff !important;
}
.numpad-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 110rpx);
  gap: 1rpx;
  background-color: var(--divider);
  border-top: 1px solid var(--divider);
  .key-btn {
    background-color: var(--surface-card);
    display: flex;
    justify-content: center;
    align-items: center;
    @include font-number;
    font-size: 44rpx;
    font-weight: 500;
    color: var(--text-primary);
    transition:
      background-color 0.1s ease,
      transform 0.1s ease;
    &:active {
      background-color: var(--surface-hover);
      transform: scale(0.92);
      z-index: 10;
      border-radius: 16rpx;
    }
  }
  .action-key {
    color: var(--text-secondary);
    font-weight: 400;
  }
  .font-large {
    font-size: 50rpx;
    font-weight: 400;
  }
  .submit-key {
    font-size: 32rpx;
    font-family: inherit;
    font-weight: 600;
    &:active {
      transform: scale(0.95);
      filter: brightness(0.9);
    }
  }
}
</style>
