import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEvents } from '@/hooks/useEvents';
import { useCategories } from '@/hooks/useCategories';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { createEvent } = useEvents();
  const { courseCategories, isLoadingCourseCategories } = useCategories();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setCategory('');
      setDate('');
      setTime('');
      setDuration(60);
      setIsOnline(true);
      setLocation('');
      setMeetingLink('');
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (courseCategories.length > 0 && !category) {
      setCategory(courseCategories[0].name);
    }
  }, [courseCategories, category]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category || !date || !time) return;
    
    try {
      setIsSubmitting(true);
      
      const eventDateTime = new Date(`${date}T${time}`);
      
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        category,
        date: eventDateTime.toISOString(),
        duration,
        type: category,
        capacity,
        isOnline,
        location: location.trim() || undefined,
        meetingLink: meetingLink.trim() || undefined,
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              {t('events.createNewEvent')}
            </DialogTitle>
            <DialogDescription>
              {t('events.createEventDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                {t('events.eventTitle')}
              </label>
              <Input
                id="title"
                placeholder={t('events.titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                {t('events.category')}
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={isLoadingCourseCategories}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('events.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {courseCategories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  {t('events.date')}
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  {t('events.time')}
                </label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                {t('events.duration')} (minutes)
              </label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="capacity" className="text-sm font-medium">
                {t('events.capacity')}
              </label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isOnline" 
                checked={isOnline} 
                onCheckedChange={(checked) => setIsOnline(checked === true)}
              />
              <label
                htmlFor="isOnline"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('events.isOnlineEvent')}
              </label>
            </div>
            
            {isOnline ? (
              <div className="space-y-2">
                <label htmlFor="meetingLink" className="text-sm font-medium">
                  {t('events.meetingLink')}
                </label>
                <Input
                  id="meetingLink"
                  placeholder={t('events.meetingLinkPlaceholder')}
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  {t('events.location')}
                </label>
                <Input
                  id="location"
                  placeholder={t('events.locationPlaceholder')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                {t('events.eventDescription')}
              </label>
              <Textarea
                id="description"
                placeholder={t('events.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim() || !description.trim() || !category || !date || !time}
            >
              {isSubmitting ? t('common.creating') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
