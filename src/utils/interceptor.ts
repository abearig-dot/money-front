// src/utils/interceptor.ts
import { useUserStore } from '@/store/user';

// 需要登录才能访问的页面白名单 (或黑名单)
const authPages = ['/pages/mine/mine', '/pages/bill/bill'];

export function setupRouterInterceptor() {
  const routerMethods = ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'];

  routerMethods.forEach(method => {
    uni.addInterceptor(method, {
      invoke(e) {
        // e.url 可能是 '/pages/mine/mine?id=1'
        const url = e.url.split('?')[0];
        const userStore = useUserStore();

        // 命中需要鉴权的页面，且没有 token
        if (authPages.includes(url) && !userStore.token) {
          uni.showToast({ title: '请先登录', icon: 'none' });
          
          // 记录当前目标页面，登录后可跳回 (视业务需求而定)
          uni.setStorageSync('redirect_url', e.url);
          
          // 强制拦截，跳转到授权/登录页
          // 注意：如果登录态是静默的，这里可以直接触发 userStore.doWechatLogin()
          return false; 
        }
        return true;
      }
    });
  });
}