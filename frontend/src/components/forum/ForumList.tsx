
import React, { useState, useEffect } from 'react';
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
import { useForumPosts } from '@/hooks/useForumPosts';
import { useAuth } from '@/context/AuthContext';
import { useCategories } from '@/hooks/useCategories';

export interface ForumListProps {
  showFilters?: boolean;
  onCreatePost?: () => void;
  limit?: number;
}

export const ForumList: React.FC<ForumListProps> = ({ 
  showFilters = false, 
  onCreatePost,
  limit 
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { 
    posts, 
    isLoading, 
    fetchPosts,
    likePost,
    addComment
  } = useForumPosts();
  const { forumCategories, isLoadingForumCategories } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPosts(1, limit || 10, categoryFilter !== 'all' ? categoryFilter : '', searchQuery);
  }, [searchQuery, categoryFilter, limit]);
  
  // Display posts based on limit
  const displayPosts = limit ? posts.slice(0, limit) : posts;
  
  const handleToggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };
  
  const handleLikePost = (postId: string) => {
    if (isAuthenticated) {
      likePost(postId);
    }
  };
  
  const handleAddComment = (postId: string, comment: string) => {
    if (isAuthenticated && comment.trim()) {
      addComment(postId, comment);
    }
  };
  
  if (isLoading || isLoadingForumCategories) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umuco-primary"></div>
      </div>
    );
  }
  
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
                {forumCategories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
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
      
      {displayPosts.length === 0 ? (
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
          {displayPosts.map((post) => (
            <ForumPost 
              key={post._id} 
              post={post} 
              isExpanded={expandedPostId === post._id}
              onToggleExpand={handleToggleExpand}
              onLike={handleLikePost}
              onComment={handleAddComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
