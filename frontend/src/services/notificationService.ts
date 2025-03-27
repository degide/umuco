
import api from './api';

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  link?: string;
  type?: 'course' | 'forum' | 'event' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

const notificationService = {
  getNotifications: async (page = 1, limit = 10) => {
    const { data } = await api.get<{
      notifications: Notification[],
      unreadCount: number,
      totalNotifications: number,
      page: number,
      totalPages: number
    }>(`/notifications?page=${page}&limit=${limit}`);
    return data;
  },
  
  markAsRead: async (notificationId: string) => {
    const { data } = await api.put<{ success: boolean }>(`/notifications/${notificationId}/read`);
    return data;
  },
  
  markAllAsRead: async () => {
    const { data } = await api.put<{ success: boolean }>('/notifications/read-all');
    return data;
  },
  
  deleteNotification: async (notificationId: string) => {
    const { data } = await api.delete<{ success: boolean }>(`/notifications/${notificationId}`);
    return data;
  }
};

export default notificationService;
