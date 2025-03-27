
import React from 'react';
import { formatDistance } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export interface EventProps {
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    duration: number;
    organizer: {
      _id: string;
      name: string;
      avatar?: string;
    };
    category: string;
    thumbnail?: string;
    attendees: {
      _id: string;
      name: string;
      avatar?: string;
    }[];
    location?: string;
    isOnline: boolean;
    meetingLink?: string;
  };
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onClick?: () => void;
}

export const EventCard: React.FC<EventProps> = ({
  event,
  onRegister,
  onUnregister,
  onClick,
}) => {
  const { user } = useAuth();
  
  const isAttending = event.attendees.some(attendee => attendee._id === user?.id);
  const isOrganizer = event.organizer._id === user?.id;
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegister) {
      onRegister(event._id);
    }
  };
  
  const handleUnregisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnregister) {
      onUnregister(event._id);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      {event.thumbnail && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-umuco-primary/10 text-umuco-primary border-umuco-primary">
            {event.category}
          </Badge>
          <div className="text-sm text-gray-500">
            {formatDistance(eventDate, new Date(), { addSuffix: true })}
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            {eventDate.toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            {eventDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' • '}
            {event.duration} minutes
          </span>
        </div>
        {event.location && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.location}</span>
          </div>
        )}
        {event.isOnline && event.meetingLink && (
          <div className="flex items-center text-sm">
            <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span className="truncate">Online meeting</span>
          </div>
        )}
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span>{event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isOrganizer ? (
          <Button variant="outline" className="w-full" disabled>
            You are the organizer
          </Button>
        ) : isPastEvent ? (
          <Button variant="outline" className="w-full" disabled>
            Event has ended
          </Button>
        ) : isAttending ? (
          <Button 
            variant="outline" 
            className="w-full border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleUnregisterClick}
          >
            Unregister
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleRegisterClick}
          >
            Register
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
