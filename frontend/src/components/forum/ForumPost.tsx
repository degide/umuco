
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Heart, Share, Flag, ThumbsUp, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface ForumPostType {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  createdAt: string;
  likes: number;
  views: number;
  replies: ForumReply[];
  isLiked?: boolean;
}

interface ForumPostProps {
  post: ForumPostType;
  isExpanded?: boolean;
  onToggleExpand?: (postId: string) => void;
}

export const ForumPost: React.FC<ForumPostProps> = ({ 
  post, 
  isExpanded = false,
  onToggleExpand
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPost, setLocalPost] = useState<ForumPostType>(post);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to like posts.",
        variant: "destructive",
      });
      return;
    }

    setLocalPost(prevPost => ({
      ...prevPost,
      likes: prevPost.isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
      isLiked: !prevPost.isLiked,
    }));
  };

  const handleReplyLike = (replyId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to like replies.",
        variant: "destructive",
      });
      return;
    }

    setLocalPost(prevPost => ({
      ...prevPost,
      replies: prevPost.replies.map(reply => 
        reply.id === replyId 
          ? {
              ...reply,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              isLiked: !reply.isLiked,
            }
          : reply
      ),
    }));
  };

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting this content. Our team will review it shortly.",
      variant: "default",
    });
  };

  const handleShare = () => {
    // In a real application, you would implement sharing functionality
    navigator.clipboard.writeText(`https://umuco.org/forum/post/${post.id}`);
    
    toast({
      title: "Link Copied",
      description: "Post link has been copied to your clipboard!",
      variant: "default",
    });
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to reply to posts.",
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please enter a reply before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReply: ForumReply = {
        id: `reply_${Date.now()}`,
        authorId: user?.id || 'unknown',
        authorName: user?.name || 'Anonymous',
        authorAvatar: user?.avatar || 'https://i.pravatar.cc/150?u=unknown',
        content: replyContent,
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      setLocalPost(prevPost => ({
        ...prevPost,
        replies: [...prevPost.replies, newReply],
      }));

      setReplyContent('');
      setIsSubmitting(false);

      toast({
        title: "Reply Posted",
        description: "Your reply has been added to the discussion.",
        variant: "default",
      });
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
      {/* Post Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img
              src={localPost.authorAvatar}
              alt={localPost.authorName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {localPost.authorName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatDate(localPost.createdAt)}</span>
                <span className="inline-block h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400"></span>
                <span className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700">
                  {localPost.category}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleReport()} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Report"
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {localPost.title}
        </h2>
        
        <div className="prose max-w-none dark:prose-invert prose-sm sm:prose-base">
          {isExpanded ? (
            <MarkdownViewer content={localPost.content} />
          ) : (
            <div className="line-clamp-3 text-gray-700 dark:text-gray-300">
              <MarkdownViewer content={localPost.content} />
            </div>
          )}
        </div>
        
        {!isExpanded && localPost.content.length > 250 && (
          <button
            onClick={() => onToggleExpand && onToggleExpand(localPost.id)}
            className="mt-2 text-sm font-medium text-umuco-primary dark:text-umuco-tertiary hover:underline"
          >
            Read more
          </button>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm ${
              localPost.isLiked
                ? 'text-umuco-secondary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            aria-label="Like"
          >
            <Heart className={`h-4 w-4 ${localPost.isLiked ? 'fill-umuco-secondary' : ''}`} />
            <span>{localPost.likes}</span>
          </button>
          
          <button
            onClick={() => onToggleExpand && onToggleExpand(localPost.id)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Replies"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{localPost.replies.length}</span>
          </button>
          
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>{localPost.views}</span>
          </div>
        </div>
        
        <button
          onClick={handleShare}
          className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Share"
        >
          <Share className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
      
      {/* Replies Section */}
      {isExpanded && (
        <div className="p-5">
          {localPost.replies.length > 0 ? (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {localPost.replies.length} {localPost.replies.length === 1 ? 'Reply' : 'Replies'}
              </h3>
              
              <div className="space-y-4">
                {localPost.replies.map((reply) => (
                  <div key={reply.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {reply.authorName}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleReport()} 
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Report"
                      >
                        <Flag className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="pl-11">
                      <MarkdownViewer content={reply.content} className="text-sm text-gray-700 dark:text-gray-300" />
                      
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() => handleReplyLike(reply.id)}
                          className={`flex items-center gap-1 text-xs ${
                            reply.isLiked
                              ? 'text-umuco-secondary'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                          aria-label="Like"
                        >
                          <ThumbsUp className={`h-3 w-3 ${reply.isLiked ? 'fill-umuco-secondary' : ''}`} />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-600" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('forum.noRepliesYet')}</p>
            </div>
          )}
          
          {/* Reply Form */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('forum.joinDiscussion')}
            </h3>
            
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply here..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
              ></textarea>
              
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-umuco-primary px-4 py-2 text-sm font-medium text-white hover:bg-umuco-primary/90 focus:outline-none focus:ring-2 focus:ring-umuco-primary focus:ring-offset-2 disabled:opacity-50 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90 dark:focus:ring-umuco-tertiary"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    t('forum.reply')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
