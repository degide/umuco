
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { Calendar, Clock, MapPin, Link as LinkIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventsPanelProps {
  events: any[];
  onRegister?: (eventId: string) => void;
  onViewAll?: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const EventsPanel: React.FC<EventsPanelProps> = ({
  events,
  onRegister,
  onViewAll,
  isLoading = false,
  title = 'Upcoming Events',
  description = 'Events you might be interested in',
}) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-umuco-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t('events.noEvents')}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {events.slice(0, 3).map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div key={event._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-umuco-primary/10 text-umuco-primary border-umuco-primary">
                      {event.category}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {formatDistance(eventDate, new Date(), { addSuffix: true })}
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {eventDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' • '}
                        {event.duration} min
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.isOnline && (
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Online event</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{event.organizer.name}</span>
                    </div>
                  </div>
                  {onRegister && (
                    <Button size="sm" className="w-full" onClick={() => onRegister(event._id)}>
                      {t('events.register')}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      {events.length > 0 && onViewAll && (
        <CardFooter className="border-t p-4">
          <Button variant="ghost" className="w-full" onClick={onViewAll}>
            {t('common.viewAll')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
