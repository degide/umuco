
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  token: string;
  refreshToken: string;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    // Store tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  register: async (userData: RegisterData) => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    // Store tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

export default authService;
