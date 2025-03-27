
import api from './api';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
  password?: string;
}

const userService = {
  getProfile: async () => {
    const { data } = await api.get<UserProfile>('/users/profile');
    return data;
  },
  
  updateProfile: async (profileData: UpdateProfileData) => {
    const { data } = await api.put<UserProfile>('/users/profile', profileData);
    return data;
  },
  
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const { data } = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },
  
  getUsers: async (page = 1, limit = 10) => {
    const { data } = await api.get(`/users?page=${page}&limit=${limit}`);
    return data;
  },
  
  getUserById: async (userId: string) => {
    const { data } = await api.get<UserProfile>(`/users/${userId}`);
    return data;
  },
  
  updateUserRole: async (userId: string, role: 'student' | 'mentor' | 'admin') => {
    const { data } = await api.put(`/users/${userId}/role`, { role });
    return data;
  }
};

export default userService;
