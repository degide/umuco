
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Notification } from '@/services/notificationService';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewAll?: () => void;
  isLoading?: boolean;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('notifications.notifications')}</CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-umuco-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('notifications.notifications')}</CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            {t('notifications.markAllAsRead')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t('notifications.noNotifications')}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.slice(0, 5).map((notification) => (
              <div 
                key={notification._id} 
                className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !notification.read ? 'border-l-4 border-l-umuco-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="mt-1 h-7 text-xs"
                      onClick={() => onMarkAsRead(notification._id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      {t('notifications.markAsRead')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {notifications.length > 0 && onViewAll && (
        <CardFooter className="border-t p-4">
          <Button variant="ghost" className="w-full" onClick={onViewAll}>
            {t('common.viewAll')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
