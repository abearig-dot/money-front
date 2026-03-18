// src/store/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { wechatLoginAPI } from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(uni.getStorageSync('shark_token') || '');
  const userInfo = ref<any>(uni.getStorageSync('shark_userinfo') || null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    uni.setStorageSync('shark_token', newToken);
  };

  const setUserInfo = (info: any) => {
    userInfo.value = info;
    uni.setStorageSync('shark_userinfo', info);
  }

  const clearAuth = () => {
    token.value = '';
    userInfo.value = null;
    uni.removeStorageSync('shark_token');
    uni.removeStorageSync('shark_userinfo');
  };

  // 核心：封装一键微信静默登录
  const doWechatLogin = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 1. 调用微信原生 API 获取 code
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          if (loginRes.code) {
            try {
              // 2. 将 code 发送给我们自己的后端
              const res = await wechatLoginAPI(loginRes.code);
              // 3. 存储 Token 和 用户信息
              setToken(res.token);
              setUserInfo(res.userInfo);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            uni.showToast({ title: '获取微信授权失败', icon: 'none' });
            reject(new Error('获取 code 失败'));
          }
        },
        fail: (err) => {
          uni.showToast({ title: '环境不支持微信登录', icon: 'none' });
          reject(err);
        }
      });
    });
  };

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    clearAuth,
    doWechatLogin
  };
});