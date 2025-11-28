import axios, { AxiosError, AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { Span } from '@elastic/apm-rum';
import { getApiBaseUrl } from '../utils/env';
import { sessionStorage } from '../utils/auth/sessionStorage';
import { getTenantIdFromHost } from '../utils/tenant/identify';
import { getElasticApm } from '../monitoring/elasticApm';

export interface ApiErrorPayload {
  status: number;
  message: string;
  data?: unknown;
  headers?: Record<string, unknown>;
  isNetworkError: boolean;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;
  headers?: Record<string, unknown>;
  isNetworkError: boolean;

  constructor({ status, message, data, headers, isNetworkError }: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.headers = headers;
    this.isNetworkError = isNetworkError;
  }
}

const applyHeader = (config: InternalAxiosRequestConfig, key: string, value?: string | null) => {
  if (!value) return;

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set(key, value);
    return;
  }

  const headers = config.headers ?? {};
  (headers as Record<string, string>)[key] = value;
  config.headers = headers;
};

const spanTracker = new WeakMap<InternalAxiosRequestConfig, Span>();

const finishSpan = (config: InternalAxiosRequestConfig | undefined, outcome: 'success' | 'failure') => {
  if (!config) return;
  const span = spanTracker.get(config);
  if (!span) return;

  if (typeof (span as Span & { setOutcome?: (value: string) => void }).setOutcome === 'function') {
    (span as Span & { setOutcome?: (value: string) => void }).setOutcome?.(outcome);
  }

  span.end();
  spanTracker.delete(config);
};

const captureWithApm = (error: unknown) => {
  const apm = getElasticApm();
  apm?.captureError(error);
};

const toApiError = (error: AxiosError): ApiError => {
  const status = error.response?.status ?? 0;

  let message = error.message || 'Request failed';
  const data = error.response?.data;

  if (typeof data === 'string' && data.trim().length > 0) {
    message = data;
  } else if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    message = data.message;
  } else if (error.response?.statusText) {
    message = error.response.statusText;
  }

  const headers = error.response?.headers ? Object.fromEntries(Object.entries(error.response.headers)) : undefined;

  return new ApiError({
    status,
    message,
    data,
    headers,
    isNetworkError: !error.response,
  });
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const storedUser = sessionStorage.getUser();
  const token = storedUser?.token ?? sessionStorage.getToken();
  const tenantId = storedUser?.tenantId ?? getTenantIdFromHost();
  const apm = getElasticApm();

  applyHeader(config, 'X-Tenant-Id', tenantId);

  if (token) {
    applyHeader(config, 'Authorization', `Bearer ${token}`);
  }

  if (!(config.headers instanceof AxiosHeaders) && config.headers) {
    (config.headers as Record<string, string>)['Content-Type'] ??= 'application/json';
  }

  if (apm) {
    const method = config.method?.toUpperCase() ?? 'GET';
    const spanName = `${method} ${config.url ?? ''}`.trim();
    const span = apm.startSpan(spanName, 'http', 'request');

    if (span) {
      span.addLabels?.({
        tenantId,
        baseURL: config.baseURL ?? '',
      });
      spanTracker.set(config, span);
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    finishSpan(response.config, 'success');
    return response;
  },
  (error: AxiosError) => {
    if (error.config) {
      finishSpan(error.config as InternalAxiosRequestConfig, 'failure');
    }

    if (error.name === 'CanceledError') {
      captureWithApm(error);
      return Promise.reject(
        new ApiError({
          status: 499,
          message: 'Request was cancelled',
          isNetworkError: false,
        }),
      );
    }

    captureWithApm(error);
    return Promise.reject(toApiError(error));
  },
);

export type { AxiosInstance } from 'axios';
