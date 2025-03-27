
import api from './api';

export interface CourseCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
}

const categoryService = {
  // Course Categories
  getCourseCategories: async () => {
    const { data } = await api.get<CourseCategory[]>('/course-categories');
    return data;
  },
  
  createCourseCategory: async (categoryData: CategoryCreate) => {
    const { data } = await api.post<CourseCategory>('/course-categories', categoryData);
    return data;
  },
  
  updateCourseCategory: async (categoryId: string, categoryData: Partial<CategoryCreate>) => {
    const { data } = await api.put<CourseCategory>(`/course-categories/${categoryId}`, categoryData);
    return data;
  },
  
  deleteCourseCategory: async (categoryId: string) => {
    await api.delete(`/course-categories/${categoryId}`);
  },
  
  // Forum Categories
  getForumCategories: async () => {
    const { data } = await api.get<ForumCategory[]>('/forum-categories');
    return data;
  },
  
  createForumCategory: async (categoryData: CategoryCreate) => {
    const { data } = await api.post<ForumCategory>('/forum-categories', categoryData);
    return data;
  },
  
  updateForumCategory: async (categoryId: string, categoryData: Partial<CategoryCreate>) => {
    const { data } = await api.put<ForumCategory>(`/forum-categories/${categoryId}`, categoryData);
    return data;
  },
  
  deleteForumCategory: async (categoryId: string) => {
    await api.delete(`/forum-categories/${categoryId}`);
  },
};

export default categoryService;
