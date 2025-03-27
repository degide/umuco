
import api from './api';

export interface ForumPost {
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

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
}

export interface CommentData {
  text: string;
}

const forumService = {
  getPosts: async (page = 1, limit = 10, category = '', searchQuery = '') => {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (category) params.append('category', category);
    if (searchQuery) params.append('search', searchQuery);
    
    const { data } = await api.get<{ 
      posts: ForumPost[], 
      totalPosts: number, 
      page: number, 
      totalPages: number 
    }>(`/forum?${params.toString()}`);
    
    return data;
  },
  
  getPostById: async (postId: string) => {
    const { data } = await api.get<ForumPost>(`/forum/${postId}`);
    return data;
  },
  
  createPost: async (postData: CreatePostData) => {
    const { data } = await api.post<ForumPost>('/forum', postData);
    return data;
  },
  
  updatePost: async (postId: string, postData: Partial<CreatePostData>) => {
    const { data } = await api.put<ForumPost>(`/forum/${postId}`, postData);
    return data;
  },
  
  deletePost: async (postId: string) => {
    await api.delete(`/forum/${postId}`);
  },
  
  addComment: async (postId: string, commentData: CommentData) => {
    const { data } = await api.post(`/forum/${postId}/comments`, commentData);
    return data;
  },
  
  likePost: async (postId: string) => {
    const { data } = await api.post(`/forum/${postId}/like`);
    return data;
  },
  
  getUserPosts: async () => {
    const { data } = await api.get<ForumPost[]>('/forum/user/posts');
    return data;
  }
};

export default forumService;
