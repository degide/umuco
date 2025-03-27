
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import forumService, { ForumPost, CreatePostData } from '@/services/forumService';
import { useAuth } from '@/context/AuthContext';

export const useForumPosts = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPosts = async (page = 1, limit = 10, category = '', search = '') => {
    try {
      setIsLoading(true);
      const data = await forumService.getPosts(page, limit, category, search);
      setPosts(data.posts);
      setTotalPosts(data.totalPosts);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching forum posts:', err);
      setError('Failed to fetch forum posts');
      toast({
        title: 'Error',
        description: 'Failed to fetch forum posts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [toast]);

  const createPost = async (postData: CreatePostData) => {
    try {
      const newPost = await forumService.createPost(postData);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setTotalPosts(prev => prev + 1);
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
      return newPost;
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updatePost = async (postId: string, postData: Partial<CreatePostData>) => {
    try {
      const updatedPost = await forumService.updatePost(postId, postData);
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      );
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });
      return updatedPost;
    } catch (err) {
      console.error('Error updating post:', err);
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await forumService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setTotalPosts(prev => prev - 1);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { liked, likeCount } = await forumService.likePost(postId);
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const updatedPost = { ...post };
            if (liked) {
              updatedPost.likes = [...updatedPost.likes, user!.id];
            } else {
              updatedPost.likes = updatedPost.likes.filter(id => id !== user!.id);
            }
            return updatedPost;
          }
          return post;
        })
      );
      return { liked, likeCount };
    } catch (err) {
      console.error('Error liking post:', err);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const addComment = async (postId: string, comment: string) => {
    try {
      await forumService.addComment(postId, { text: comment });
      // Refetch the post to get the updated comments
      const updatedPost = await forumService.getPostById(postId);
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? updatedPost : post))
      );
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    posts,
    totalPosts,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
  };
};
