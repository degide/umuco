
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import eventService, { Event, EventCreate } from '@/services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async (page = 1, limit = 10, category = '', search = '', upcoming = false) => {
    try {
      setIsLoading(true);
      const data = await eventService.getEvents(page, limit, search, category, upcoming);
      setEvents(data.events);
      setTotalEvents(data.totalEvents);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [toast]);

  const fetchUserEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getUserEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user events:', err);
      setError('Failed to fetch user events');
      toast({
        title: 'Error',
        description: 'Failed to fetch your registered events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizedEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getOrganizedEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching organized events:', err);
      setError('Failed to fetch organized events');
      toast({
        title: 'Error',
        description: 'Failed to fetch your organized events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: EventCreate) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prevEvents => [newEvent, ...prevEvents]);
      setTotalEvents(prev => prev + 1);
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<EventCreate>) => {
    try {
      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      setEvents(prevEvents =>
        prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
      );
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      setTotalEvents(prev => prev - 1);
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting event:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const registerForEvent = async (eventId: string) => {
    try {
      await eventService.registerForEvent(eventId);
      // Refetch the event to get updated attendees
      const updatedEvent = await eventService.getEventById(eventId);
      setEvents(prevEvents =>
        prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
      );
      toast({
        title: 'Success',
        description: 'Successfully registered for event',
      });
    } catch (err) {
      console.error('Error registering for event:', err);
      toast({
        title: 'Error',
        description: 'Failed to register for event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    try {
      await eventService.unregisterFromEvent(eventId);
      // Refetch the event to get updated attendees
      const updatedEvent = await eventService.getEventById(eventId);
      setEvents(prevEvents =>
        prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
      );
      toast({
        title: 'Success',
        description: 'Successfully unregistered from event',
      });
    } catch (err) {
      console.error('Error unregistering from event:', err);
      toast({
        title: 'Error',
        description: 'Failed to unregister from event',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    events,
    totalEvents,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchEvents,
    fetchUserEvents,
    fetchOrganizedEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
  };
};
