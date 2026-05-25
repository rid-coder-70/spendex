import axios, { AxiosInstance, AxiosError } from 'axios';

const getBaseURL = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) return 'http://localhost:5000/api';
  

  const normalizedUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  

  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
};

const API_URL = getBaseURL();

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          this.clearAuthCookie();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const localToken = localStorage.getItem('token');
    if (localToken) return localToken;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') return value;
    }
    
    return null;
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  setAuthCookie(token: string): void {
    if (typeof window !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
  }

  clearAuthCookie(): void {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; path=/; max-age=0';
    }
  }

  get<T = any>(url: string, params?: any) {
    return this.client.get<T>(url, { params });
  }

  post<T = any>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  put<T = any>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  delete<T = any>(url: string) {
    return this.client.delete<T>(url);
  }

  upload<T = any>(url: string, formData: FormData) {
    return this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiClient = new APIClient();