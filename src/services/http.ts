import config from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

class HttpClient {
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // This is where we'd set up request/response interceptors if we were using axios
    // With fetch API we handle this logic within our request method
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private saveTokens(accessToken: string, refreshToken: string, userId: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', userId);
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${config.API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Clear tokens if refresh fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      throw new Error('Failed to refresh token');
    }

    const data: RefreshTokenResponse = await response.json();
    this.saveTokens(data.accessToken, data.refreshToken, data.userId);
    
    return data.accessToken;
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  async request<T>(
    url: string,
    method: string = 'GET',
    data?: unknown,
    customHeaders: Record<string, string> = {},
    skipAuth: boolean = false
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${config.API_URL}${url}`, options);

      // If token expired (401), try to refresh it
      if (response.status === 401 && !skipAuth) {
        if (this.isRefreshing) {
          // Wait for the token refresh to complete
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((token: string) => {
              headers['Authorization'] = `Bearer ${token}`;
              options.headers = headers;
              
              // Retry the original request with new token
              fetch(`${config.API_URL}${url}`, options)
                .then(resp => resp.json())
                .then(data => resolve(data as T))
                .catch(err => reject(err));
            });
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);

          // Retry the request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          options.headers = headers;
          
          const retryResponse = await fetch(`${config.API_URL}${url}`, options);
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        } catch (error) {
          this.isRefreshing = false;
          throw error;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  get<T>(url: string, skipAuth = false): Promise<T> {
    return this.request<T>(url, 'GET', undefined, {}, skipAuth);
  }

  post<T>(url: string, data?: unknown, skipAuth = false): Promise<T> {
    return this.request<T>(url, 'POST', data, {}, skipAuth);
  }

  put<T>(url: string, data?: unknown, skipAuth = false): Promise<T> {
    return this.request<T>(url, 'PUT', data, {}, skipAuth);
  }

  delete<T>(url: string, skipAuth = false): Promise<T> {
    return this.request<T>(url, 'DELETE', undefined, {}, skipAuth);
  }

  async postFormData<T>(url: string, formData: FormData, skipAuth = false): Promise<T> {
    try {
      const headers: Record<string, string> = {};

      if (!skipAuth) {
        const token = this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const options: RequestInit = {
        method: 'POST',
        headers,
        body: formData,
      };

      const response = await fetch(`${config.API_URL}${url}`, options);

      // If token expired (401), try to refresh it
      if (response.status === 401 && !skipAuth) {
        if (this.isRefreshing) {
          // Wait for the token refresh to complete
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((token: string) => {
              headers['Authorization'] = `Bearer ${token}`;
              options.headers = headers;
              
              // Retry the original request with new token
              fetch(`${config.API_URL}${url}`, options)
                .then(resp => resp.json())
                .then(data => resolve(data as T))
                .catch(err => reject(err));
            });
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);

          // Retry the request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          options.headers = headers;
          
          const retryResponse = await fetch(`${config.API_URL}${url}`, options);
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        } catch (error) {
          this.isRefreshing = false;
          throw error;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('FormData request failed:', error);
      throw error;
    }
  }

  async upload<T>(url: string, formData: FormData, skipAuth = false): Promise<T> {
    try {
      const headers: Record<string, string> = {};

      if (!skipAuth) {
        const token = this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const options: RequestInit = {
        method: 'POST',
        headers,
        body: formData,
      };

      const response = await fetch(`${config.API_URL}${url}`, options);

      // If token expired (401), try to refresh it
      if (response.status === 401 && !skipAuth) {
        if (this.isRefreshing) {
          // Wait for the token refresh to complete
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((token: string) => {
              headers['Authorization'] = `Bearer ${token}`;
              options.headers = headers;
              
              // Retry the original request with new token
              fetch(`${config.API_URL}${url}`, options)
                .then(resp => resp.json())
                .then(data => resolve(data as T))
                .catch(err => reject(err));
            });
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);

          // Retry the request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          options.headers = headers;
          
          const retryResponse = await fetch(`${config.API_URL}${url}`, options);
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        } catch (error) {
          this.isRefreshing = false;
          throw error;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }
}

export const http = new HttpClient();
