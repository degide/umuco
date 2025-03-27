
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Notification } from '@/services/notificationService';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umuco-primary"></div>
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          {t('notifications.noNotifications')}
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t('notifications.noNotificationsDescription')}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          {t('notifications.markAllAsRead')}
        </Button>
      </div>
      
      {notifications.map((notification) => (
        <Card key={notification._id} className={notification.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900 border-l-4 border-l-umuco-primary'}>
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{notification.title}</CardTitle>
              <span className="text-xs text-gray-500">
                {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
              </span>
            </div>
            <CardDescription>
              {notification.type === 'course' && 'Course update'}
              {notification.type === 'forum' && 'Forum activity'}
              {notification.type === 'event' && 'Event update'}
              {notification.type === 'system' && 'System message'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onMarkAsRead(notification._id)}
              >
                <Check className="mr-2 h-4 w-4" />
                {t('notifications.markAsRead')}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(notification._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('notifications.delete')}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
