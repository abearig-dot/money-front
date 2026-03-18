<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useAppStore } from "./store/app";
import { watchEffect } from "vue";

const appStore = useAppStore();

onLaunch(() => {
  console.log("App Launch - 记账 v2");
  // 检查版本更新
  const updateManager = uni.getUpdateManager();

  updateManager.onCheckForUpdate((res) => {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      console.log("检测到新版本");
    }
  });

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: "更新提示",
      content: "新版本已准备好，是否重启应用？",
      showCancel: false,
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      },
    });
  });
  watchEffect(() => {
    const isDark = appStore.theme === "dark"; //

    // 1. 设置导航栏（胶囊）文字颜色及背景
    uni.setNavigationBarColor({
      frontColor: isDark ? "#ffffff" : "#000000",
      backgroundColor: isDark ? "#121212" : "#F8F8F8",
      animation: { duration: 300, timingFunc: "easeIn" },
    }); //

    // 2. 动态修改原生 Page 的下拉/回弹区域背景色（极致体验的关键所在）
    const bgColor = isDark ? "#121212" : "#F5F6FA";
    // #ifdef MP-WEIXIN || APP-PLUS
    uni.setBackgroundColor({
      backgroundColor: bgColor,
      backgroundColorTop: bgColor, // 顶部回弹区
      backgroundColorBottom: bgColor, // 底部回弹区
    });
    // #endif
  });
});

onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
/* 基础样式初始化 */
page {
  /* ================= 浅色模式变量 ================= */
  --bg-base: #f5f6fa; /* 最底层背景 */
  --bg-card: #ffffff; /* 卡片背景 */
  --bg-card-hover: #f0f0f5; /* 图标底色/交互反馈 */

  --text-primary: #1d1d1f; /* 主标题/金额 */
  --text-secondary: #8e8e93; /* 备注/日期等次要信息 */

  --accent-color: #fde047; /* 品牌色：鲨鱼黄 */
  --color-expense: #ff3b30; /* 支出红 */
  --color-income: #34c759; /* 收入绿 */

  --border-color: #e5e5ea; /* 分割线 */

  /* 毛玻璃 TabBar 专属变量 */
  --bg-tabbar: rgba(255, 255, 255, 0.85);
  --border-tabbar: rgba(0, 0, 0, 0.08);

  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family:
    -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

/* ================= 暗黑模式变量 (手动切换类名) ================= */
.theme-dark page,
.theme-dark {
  --bg-base: #121212;
  --bg-card: #1c1c1e;
  --bg-card-hover: #2c2c2e;

  --text-primary: #ffffff;
  --text-secondary: #98989d;

  --accent-color: #fde047;
  --color-expense: #ff453a;
  --color-income: #30d158;

  --border-color: #38383a;

  --bg-tabbar: rgba(28, 28, 30, 0.85);
  --border-tabbar: rgba(255, 255, 255, 0.08);
}

/* 去除 scroll-view 滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
