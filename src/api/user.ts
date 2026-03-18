// src/api/user.ts
import http from '@/utils/request';

// 定义后端返回的登录结果接口
export interface LoginResult {
  token: string;
  userInfo: {
    uid: string;
    nickname: string;
    avatar: string;
  };
}

/**
 * 微信静默登录
 * @param code uni.login 获取的临时凭证
 */
export function wechatLoginAPI(code: string) {
  // 注意：此处开启了全局 loading，防止请求期间用户乱点
  return http.post<LoginResult>('/user/wechat-login', { code }, { showLoading: true });
}

/**
 * 更新用户基础信息 (头像、昵称)
 */
export function updateUserInfoAPI(data: { nickname: string; avatar: string }) {
  return http.post('/user/update-info', data, { showLoading: true });
}