import { type ApiKey } from '../types';
const API_BASE_URL = import.meta.env.PROD ? 'https://5000-i7weffsm09qhtij2rxepw-b433e9c8.manusvm.computer/api' : '/api';

export class ApiService {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getKeys(): Promise<ApiKey[]> {
    const response = await this.request('/keys');
    return response.keys || [];
  }

  static async createKey(name?: string): Promise<ApiKey> {
    const response = await this.request('/keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return response.key;
  }

  static async deleteKey(id: string): Promise<void> {
    await this.request(`/keys/${id}`, {
      method: 'DELETE',
    });
  }

  static async updateKey(id: string, name: string): Promise<ApiKey> {
    const response = await this.request(`/keys/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    return response.key;
  }

  static async getConfig(): Promise<{ maxKeys: number; expirationDays: number }> {
    const response = await this.request('/config');
    return response.config;
  }
}

