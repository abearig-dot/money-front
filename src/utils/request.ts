// src/utils/request.ts
import { useUserStore } from '@/store/user'

// 对应你代码中的 defaultOption
interface RequestOptions extends UniApp.RequestOptions {
  showLoading?: boolean; // 是否显示 loading，默认 false
  dealResult?: boolean;  // 是否对返回结果拦截，默认 true
}

// 拼接 BaseUrl: 对应你 login.js 中的 process.env.VUE_APP_BASE_API + process.env.VUE_APP_SERVICE_NAME
const BASE_URL = import.meta.env.VITE_APP_BASE_API + import.meta.env.VITE_APP_SERVICE_NAME;

// 记录当前正在请求的数量，用于控制全局 Loading 的显示与隐藏
let loadingCount = 0;

const showGlobalLoading = () => {
  if (loadingCount === 0) {
    uni.showLoading({ title: '加载中...', mask: true });
  }
  loadingCount++;
};

const hideGlobalLoading = () => {
  if (loadingCount <= 0) return;
  loadingCount--;
  if (loadingCount === 0) {
    uni.hideLoading();
  }
};

export const request = <T = any>(options: RequestOptions): Promise<T> => {
  // 合并默认配置
  const config = {
    showLoading: false,
    dealResult: true,
    ...options,
    url: BASE_URL + options.url, // 拼接完整地址
    header: options.header || {}
  };

  if (config.showLoading) {
    showGlobalLoading();
  }

  const userStore = useUserStore();
  // 注入 Token
  if (userStore.token) {
    config.header['Authorization'] = `Bearer ${userStore.token}`;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (response: any) => {
        const { statusCode, data } = response;

        // 1. 网络状态码 200 范围
        if (statusCode >= 200 && statusCode < 300) {
          // 如果不需要全局拦截结果，直接返回所有数据 (对应你代码的 dealResult === false)
          if (!config.dealResult) {
            resolve(data as T);
            return;
          }

          // 2. 业务状态码处理 (假设后端成功状态码为 200 或 '0000')
          const res = data as any;
          if (res.code === 200 || res.code === '200') {
            resolve(res.data as T);
          } else if (res.code === 401 || res.code === 403) {
             // 业务级 Token 失效或被踢下线
             uni.showToast({ title: res.message || '登录过期，请重新登录', icon: 'none' });
             userStore.clearAuth();
             setTimeout(() => uni.reLaunch({ url: '/pages/login/login' }), 1500);
             reject(new Error(res.message || 'Error'));
          } else {
            // 其他业务错误统一报错 (对应你代码中的 Message.error)
            uni.showToast({ title: res.message || res.msg || '操作失败', icon: 'none', duration: 3000 });
            reject(new Error(res.message || 'Error'));
          }
        } else {
          // 3. HTTP 错误状态码处理 (完美还原你的 switch case 逻辑)
          let errorMsg = "未知错误";
          switch (statusCode) {
            case 400: errorMsg = "错误的请求"; break;
            case 401: errorMsg = "访问被拒绝 (401)"; userStore.clearAuth(); break;
            case 403: errorMsg = "禁止访问 (403)"; break;
            case 404: errorMsg = "404 未找到接口"; break;
            case 405: errorMsg = "请求方法不被允许"; break;
            case 413: errorMsg = "请求实体过大"; break;
            case 414: errorMsg = "请求的 URI 过长"; break;
            case 500: errorMsg = "服务器内部错误"; break;
            case 502: errorMsg = "错误网关"; break;
            case 503: errorMsg = "服务不可用"; break;
            case 504: errorMsg = "网关超时"; break;
            default:  errorMsg = `网络错误 (${statusCode})`;
          }
          uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 });
          reject(new Error(errorMsg));
        }
      },
      fail: (err) => {
        // 小程序断网或跨域等底层错误
        uni.showToast({ title: '网络连接失败，请检查网络', icon: 'none' });
        reject(err);
      },
      complete: () => {
        // 请求完成，关闭 loading
        if (config.showLoading) {
          hideGlobalLoading();
        }
      }
    });
  });
};

// 导出快捷方法
export default {
  get: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => 
    request<T>({ url, method: 'GET', data, ...options }),
  post: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => 
    request<T>({ url, method: 'POST', data, ...options }),
  put: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => 
    request<T>({ url, method: 'PUT', data, ...options }),
  delete: <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) => 
    request<T>({ url, method: 'DELETE', data, ...options }),
};