import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './apiClient';

const extractData = <T>(promise: Promise<{ data: T }>): Promise<T> => promise.then((response) => response.data);

export const api = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return extractData<T>(apiClient.get<T>(url, config));
  },
  post<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig) {
    return extractData<T>(apiClient.post<T>(url, body, config));
  },
  put<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig) {
    return extractData<T>(apiClient.put<T>(url, body, config));
  },
  patch<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig) {
    return extractData<T>(apiClient.patch<T>(url, body, config));
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return extractData<T>(apiClient.delete<T>(url, config));
  },
};

export { ApiError } from './apiClient';
