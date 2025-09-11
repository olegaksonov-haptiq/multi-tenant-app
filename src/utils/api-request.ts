import { getCookie } from './common';
import { getApiBaseUrl } from './env';

/**
 * Class to handle API requests with cookie-based authentication
 * and tenant/environment-aware base URLs.
 */
class ApiRequest {
  private token: string;

  /**
   * Initializes the API request instance and reads token from cookie
   */
  constructor() {
    this.token = getCookie('token') || '';
  }

  /**
   * Base request method
   * @param endpoint - API endpoint (e.g., "/users")
   * @param options - Fetch options
   * @returns Promise resolving to type T
   * @throws Error if fetch fails or response is not ok
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      ...(options.headers || {}),
    };

    const res = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error: ${res.status} - ${text}`);
    }

    return res.json();
  }

  /**
   * Send a GET request
   * @param endpoint - API endpoint
   * @param options - Optional fetch options
   * @returns Promise resolving to type T
   */
  get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Send a POST request
   * @param endpoint - API endpoint
   * @param body - Request payload
   * @param options - Optional fetch options
   * @returns Promise resolving to type T
   */
  post<T, B>(endpoint: string, body: B, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Send a PUT request
   * @param endpoint - API endpoint
   * @param body - Request payload
   * @param options - Optional fetch options
   * @returns Promise resolving to type T
   */
  put<T, B>(endpoint: string, body: B, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * Send a DELETE request
   * @param endpoint - API endpoint
   * @param options - Optional fetch options
   * @returns Promise resolving to type T
   */
  delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Refreshes the token from the cookie in case it has changed
   */
  refreshToken() {
    this.token = getCookie('token') || '';
  }
}

export const api = new ApiRequest();
