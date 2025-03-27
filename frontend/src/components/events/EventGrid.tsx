
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Calendar } from 'lucide-react';
import { EventCard } from './EventCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EventGridProps {
  events: any[];
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onEventClick?: (event: any) => void;
  showFilters?: boolean;
  categories?: string[];
  limit?: number;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onRegister,
  onUnregister,
  onEventClick,
  showFilters = false,
  categories = [],
  limit,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Apply filters
  let filteredEvents = [...events];
  
  // Search filter
  if (searchQuery) {
    filteredEvents = filteredEvents.filter(
      event => event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Category filter
  if (categoryFilter && categoryFilter !== 'all') {
    filteredEvents = filteredEvents.filter(
      event => event.category === categoryFilter
    );
  }
  
  // Apply limit if provided
  const displayEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;
  
  const handleEventClick = (event: any) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  return (
    <>
      {showFilters && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={t('events.searchPlaceholder')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('events.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('events.all')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {displayEvents.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {t('events.noEventsFound')}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('events.tryDifferentFilters')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              onRegister={onRegister}
              onUnregister={onUnregister}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      )}
    </>
  );
};
