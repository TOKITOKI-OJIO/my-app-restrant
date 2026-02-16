import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Message } from '@arco-design/web-react';

const BASE_URL = 'http://127.0.0.1:8081';

const request: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const errorMessages = new Map<string, number>();

const showError = (message: string, url?: string) => {
  const key = `${url}-${message}`;
  const now = Date.now();
  
  if (errorMessages.has(key)) {
    const lastTime = errorMessages.get(key) || 0;
    if (now - lastTime < 5000) {
      return;
    }
  }
  
  errorMessages.set(key, now);
  Message.error(message);
  
  setTimeout(() => {
    errorMessages.delete(key);
  }, 5000);
};

request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const { response, message } = error;
    const url = response?.config?.url || '';

    if (response) {
      const status = response.status;
      const data = response.data as any;
      const errorMessage = data?.message || data?.error || '请求失败';

      switch (status) {
        case 400:
          showError(errorMessage, url);
          break;
        case 401:
          showError('未授权，请重新登录', url);
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          showError('拒绝访问', url);
          break;
        case 404:
          showError('请求的资源不存在', url);
          break;
        case 500:
          showError('服务器错误', url);
          break;
        default:
          showError(errorMessage, url);
      }
    } else if (message) {
      if (message.includes('timeout')) {
        showError('网络超时，请重试', url);
      } else if (message.includes('Network Error')) {
        showError('网络错误，请检查网络连接', url);
      } else {
        showError(message, url);
      }
    }

    return Promise.reject(error);
  }
);

export default request;
