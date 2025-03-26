
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = [
    'General',
    'Food & Cuisine',
    'Languages',
    'Traditions & Ceremonies',
    'Music & Arts',
    'Literature & Philosophy',
    'History',
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      toast({
        title: t('forum.validation.title'),
        description: t('forum.validation.allFieldsRequired'),
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call to create the post
    // For now, we'll just show a success message
    toast({
      title: t('forum.postCreated'),
      description: t('forum.postCreatedDescription'),
    });
    
    onClose();
    
    // Reset form
    setTitle('');
    setContent('');
    setCategory('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('forum.createNewPost')}</DialogTitle>
          <DialogDescription>
            {t('forum.createPostDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">{t('forum.postTitle')}</Label>
              <Input
                id="post-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('forum.titlePlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-category">{t('forum.category')}</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger id="post-category">
                  <SelectValue placeholder={t('forum.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-content">{t('forum.content')}</Label>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder={t('forum.contentPlaceholder')}
                minHeight="200px"
              />
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {t('forum.publish')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
