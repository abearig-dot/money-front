import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import App from "./App.vue";

// 1. 引入你需要全局使用的组件
import CustomNavBar from "./components/CustomNavBar.vue";
import CustomTabBar from "./components/CustomTabBar.vue";
import AppLayout from "./components/AppLayout.vue";

// ✅ 引入我们封装的路由拦截器
import { setupRouterInterceptor } from "./utils/interceptor"; 

export function createApp() {
  const app = createSSRApp(App);
  
  // 注册状态管理
  const pinia = Pinia.createPinia();
  app.use(pinia);

  // 2. 注册全局组件
  app.component("CustomNavBar", CustomNavBar);
  app.component("CustomTabBar", CustomTabBar);
  app.component("AppLayout", AppLayout);
  
  // ✅ 激活全局路由拦截
  // setupRouterInterceptor();
  
  return {
    app,
    Pinia
  };
}