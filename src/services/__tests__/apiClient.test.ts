// <reference types="vitest" />

import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../apiClient';

const mocks = vi.hoisted(() => ({
  getApiBaseUrl: vi.fn(() => 'https://api.example.com'),
  getToken: vi.fn(() => 'token-123'),
  getUser: vi.fn(() => ({ tenantId: 'tenant-abc', token: 'token-123' })),
  getTenantIdFromHost: vi.fn(() => 'fallback-tenant'),
}));

vi.mock('../../utils/env', () => ({
  getApiBaseUrl: mocks.getApiBaseUrl,
}));

vi.mock('../../utils/auth/sessionStorage', () => ({
  sessionStorage: {
    getToken: mocks.getToken,
    getUser: mocks.getUser,
  },
}));

vi.mock('../../utils/tenant/identify', () => ({
  getTenantIdFromHost: mocks.getTenantIdFromHost,
}));

describe('apiClient', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  it('injects tenant and auth headers before the request is sent', async () => {
    expect.assertions(3);

    mock.onGet('/users').reply((config) => {
      expect(config.headers?.['X-Tenant-Id']).toBe('tenant-abc');
      expect(config.headers?.Authorization).toBe('Bearer token-123');
      expect(config.headers?.['Content-Type']).toBe('application/json');
      return [200, []];
    });

    await apiClient.get('/users');
  });

  it('normalizes server errors into ApiError', async () => {
    mock.onGet('/users').reply(401, { message: 'Unauthorized' });

    await expect(apiClient.get('/users')).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized',
      isNetworkError: false,
    });
  });

  it('normalizes network errors into ApiError with status 0', async () => {
    mock.onGet('/users').networkError();

    await expect(apiClient.get('/users')).rejects.toMatchObject({
      status: 0,
      isNetworkError: true,
    });
  });
});
