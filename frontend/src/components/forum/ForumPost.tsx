
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { MessageSquare, Heart, EyeIcon, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ForumPostType {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  likes: string[];
  comments: {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    text: string;
    createdAt: string;
  }[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface ForumPostProps {
  post: ForumPostType;
  isExpanded?: boolean;
  onToggleExpand?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
}

export const ForumPost: React.FC<ForumPostProps> = ({
  post,
  isExpanded = false,
  onToggleExpand,
  onLike,
  onComment,
}) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  
  const isLiked = user && post.likes.includes(user.id);
  
  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(post._id);
    }
  };
  
  const handleLike = () => {
    if (onLike) {
      onLike(post._id);
    }
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && onComment) {
      onComment(post._id, comment);
      setComment('');
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Post header */}
      <div className="p-4 cursor-pointer" onClick={handleToggleExpand}>
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-umuco-secondary/10 hover:bg-umuco-secondary/20 text-umuco-secondary">
            {post.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        
        <p className={`text-gray-600 dark:text-gray-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {post.content}
        </p>
        
        {/* Author and stats row */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" fill={isLiked ? "currentColor" : "none"} />
              <span>{post.likes.length}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments.length}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpand();
              }}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Expanded section with comments */}
      {isExpanded && (
        <div className="border-t">
          {/* Like button and action bar */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={!isAuthenticated}
            >
              <Heart className="h-4 w-4 mr-2" fill={isLiked ? "white" : "none"} />
              {isLiked ? t('forum.liked') : t('forum.like')}
            </Button>
          </div>
          
          {/* Comments section */}
          <div className="p-4">
            <h4 className="font-medium mb-4">{t('forum.comments')} ({post.comments.length})</h4>
            
            {post.comments.length > 0 ? (
              <div className="space-y-4 mb-4">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                        <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.user.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">{t('forum.noComments')}</p>
            )}
            
            {/* Add comment form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment}>
                <Textarea
                  placeholder={t('forum.writeComment')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  type="submit" 
                  disabled={!comment.trim()}
                  size="sm"
                >
                  {t('forum.postComment')}
                </Button>
              </form>
            ) : (
              <div className="text-sm text-gray-500 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <User className="h-4 w-4 inline mr-2" />
                {t('forum.loginToComment')}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
