
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useForumPosts } from '@/hooks/useForumPosts';
import { useCategories } from '@/hooks/useCategories';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { createPost } = useForumPosts();
  const { forumCategories, isLoadingForumCategories } = useCategories();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setCategory('');
    }
  }, [isOpen]);
  
  // Set default category when categories are loaded
  useEffect(() => {
    if (forumCategories.length > 0 && !category) {
      setCategory(forumCategories[0].name);
    }
  }, [forumCategories, category]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) return;
    
    try {
      setIsSubmitting(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
      });
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
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
              <MessageSquare className="h-5 w-5 mr-2" />
              {t('forum.createNewPost')}
            </DialogTitle>
            <DialogDescription>
              {t('forum.createPostDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                {t('forum.postTitle')}
              </label>
              <Input
                id="title"
                placeholder={t('forum.titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                {t('forum.category')}
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={isLoadingForumCategories}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('forum.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {forumCategories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                {t('forum.postContent')}
              </label>
              <Textarea
                id="content"
                placeholder={t('forum.contentPlaceholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px]"
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
              disabled={isSubmitting || !title.trim() || !content.trim() || !category}
            >
              {isSubmitting ? t('common.posting') : t('common.post')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
