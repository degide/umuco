import api from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  organizer: {
    _id: string;
    name: string;
    avatar?: string;
  };
  attendees: {
    _id: string;
    name: string;
    avatar?: string;
  }[];
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventCreate {
  title: string;
  description: string;
  date: string;
  location?: string;
  type: string;
  capacity: number;
  category: string;
  duration: number;
  isOnline?: boolean;
  meetingLink?: string;
}

const eventService = {
  getEvents: async (page = 1, limit = 10, search = '', category = '', upcoming = false) => {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (upcoming) params.append('upcoming', 'true');
    
    const { data } = await api.get<{ events: Event[]; total: number; page: number; totalPages: number; totalEvents: number }>(`/events?${params.toString()}`);
    return data;
  },
  
  getEventById: async (eventId: string) => {
    const { data } = await api.get<Event>(`/events/${eventId}`);
    return data;
  },
  
  getUserEvents: async () => {
    const { data } = await api.get<Event[]>('/events/registered');
    return data;
  },
  
  getOrganizedEvents: async () => {
    const { data } = await api.get<Event[]>('/events/organized');
    return data;
  },
  
  createEvent: async (eventData: EventCreate) => {
    const { data } = await api.post<Event>('/events', eventData);
    return data;
  },
  
  updateEvent: async (eventId: string, eventData: Partial<EventCreate>) => {
    const { data } = await api.put<Event>(`/events/${eventId}`, eventData);
    return data;
  },
  
  deleteEvent: async (eventId: string) => {
    await api.delete(`/events/${eventId}`);
  },
  
  registerForEvent: async (eventId: string) => {
    const { data } = await api.post(`/events/${eventId}/register`);
    return data;
  },
  
  unregisterFromEvent: async (eventId: string) => {
    const { data } = await api.post(`/events/${eventId}/unregister`);
    return data;
  }
};

export default eventService;
