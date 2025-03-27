
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import notificationService, { Notification } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(page, limit);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setTotalNotifications(data.totalNotifications);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const removedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
      setTotalNotifications(prev => prev - 1);
      // If we removed an unread notification, decrease the unread count
      if (removedNotification && !removedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast({
        title: 'Success',
        description: 'Notification deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  return {
    notifications,
    unreadCount,
    totalNotifications,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
