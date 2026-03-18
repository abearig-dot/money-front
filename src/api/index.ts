// src/api/login.ts
import http from '@/utils/request';

// 定义传参类型
export interface LoginParams {
  username?: string;
  password?: string;
  [key: string]: any; 
}

/**
 * 登出
 */
export function logout(params?: any) {
  return http.get('/user/logout', params);
}

/**
 * 首次登录保存密保问题信息
 */
export function saveConfidentialityList(params: any) {
  return http.post('/user/saveConfidentialityList', params, { showLoading: true });
}

/**
 * 忘记密码时获取用户填写的密保问题
 */
export function getUserConfidentialityList(params: any) {
  // 如果某些接口你希望自己处理原始数据，可以传入 dealResult: false
  return http.get('/user/getUserConfidentialityList', params);
}