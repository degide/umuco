
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MessageSquare, Plus } from 'lucide-react';
import { ForumPost, ForumPostType } from './ForumPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ForumListProps {
  showFilters?: boolean;
  onCreatePost?: () => void;
  limit?: number;
}

// Mock forum data
const MOCK_POSTS: ForumPostType[] = [
  {
    id: '1',
    title: 'Learning Wolof: My Journey So Far',
    content: 'I\'ve been learning Wolof for about 3 months now and wanted to share my experience...',
    authorId: 'user1',
    authorName: 'Aminata Diop',
    authorAvatar: 'https://i.pravatar.cc/150?img=44',
    category: 'Languages',
    createdAt: '2023-05-15T14:32:00Z',
    likes: 24,
    views: 342,
    replies: [],
    isLiked: false,
  },
  {
    id: '2',
    title: 'Traditional Cooking Techniques from East Africa',
    content: 'I recently attended a workshop on traditional East African cooking methods...',
    authorId: 'user2',
    authorName: 'James Ouma',
    authorAvatar: 'https://i.pravatar.cc/150?img=68',
    category: 'Food & Cuisine',
    createdAt: '2023-05-12T09:15:00Z',
    likes: 18,
    views: 273,
    replies: [],
  },
  {
    id: '3',
    title: 'Wedding Ceremonies Across African Cultures',
    content: 'The diversity of wedding traditions across the continent is fascinating...',
    authorId: 'user3',
    authorName: 'Zainab Ahmed',
    authorAvatar: 'https://i.pravatar.cc/150?img=41',
    category: 'Traditions & Ceremonies',
    createdAt: '2023-05-10T11:45:00Z',
    likes: 32,
    views: 415,
    replies: [],
  },
  {
    id: '4',
    title: 'Modern African Literature Recommendations',
    content: 'I\'ve been exploring contemporary African literature and wanted to share some gems...',
    authorId: 'user4',
    authorName: 'Kwame Mensah',
    authorAvatar: 'https://i.pravatar.cc/150?img=60',
    category: 'Literature & Philosophy',
    createdAt: '2023-05-08T16:20:00Z',
    likes: 27,
    views: 389,
    replies: [],
  },
  {
    id: '5',
    title: 'Drumming Patterns of West Africa',
    content: 'As someone who\'s been studying West African percussion for years...',
    authorId: 'user5',
    authorName: 'Abdul Sankara',
    authorAvatar: 'https://i.pravatar.cc/150?img=52',
    category: 'Music & Arts',
    createdAt: '2023-05-05T13:10:00Z',
    likes: 15,
    views: 241,
    replies: [],
  },
];

export const ForumList: React.FC<ForumListProps> = ({ 
  showFilters = false, 
  onCreatePost,
  limit 
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  
  // Apply filters and search
  let filteredPosts = [...MOCK_POSTS];
  
  if (searchQuery) {
    filteredPosts = filteredPosts.filter(
      post => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (categoryFilter && categoryFilter !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
  }

  // Apply limit if provided
  if (limit && limit > 0) {
    filteredPosts = filteredPosts.slice(0, limit);
  }
  
  // Categories for filter
  const categories = [
    'General',
    'Food & Cuisine',
    'Languages',
    'Traditions & Ceremonies',
    'Music & Arts',
    'Literature & Philosophy',
    'History',
  ];

  const handleToggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };
  
  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={t('forum.searchPlaceholder')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('courses.filterBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('courses.all')}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {onCreatePost && (
            <Button onClick={onCreatePost} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {t('forum.createPost')}
            </Button>
          )}
        </div>
      )}
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {t('forum.noPostsFound')}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('forum.noPostsFoundDescription')}
          </p>
          {onCreatePost && (
            <Button onClick={onCreatePost} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              {t('forum.createPost')}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <ForumPost 
              key={post.id} 
              post={post} 
              isExpanded={expandedPostId === post.id}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};
