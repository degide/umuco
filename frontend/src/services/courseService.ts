
import api from './api';
import {Enrollment} from "@/services/enrollmentService.ts";

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    _id: string;
    name: string;
    avatar?: string;
  };
  thumbnail?: string;
  category: string;
  level: string;
  duration: number;
  lessons: {
    _id: string;
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
  }[];
  enrolledCount: number;
  rating: number;
  isEnrolled?: boolean;
  enrolled?: boolean;
  progress?: number;
  reviews: {
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreate {
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  duration: number;
  lessons: {
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
  }[];
}

export interface CourseReview {
  rating: number;
  comment: string;
}

const courseService = {
  getCourses: async (page = 1, limit = 10, searchQuery = '', category = '', level = '') => {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (searchQuery) params.append('search', searchQuery);
    if (category) params.append('category', category);
    if (level) params.append('level', level);
    
    const { data } = await api.get<{ courses: Course[], total: number, page: number, totalPages: number }>(`/courses?${params.toString()}`);
    return data;
  },
  
  getEnrolledCourses: async () => {
    const { data } = await api.get<Enrollment[]>('/enrollments');
    return data;
  },
  
  getRecommendedCourses: async () => {
    const { data } = await api.get<Course[]>('/courses/recommended');
    return data;
  },
  
  getCourseById: async (courseId: string) => {
    const { data } = await api.get<Course>(`/courses/${courseId}`);
    return data;
  },
  
  createCourse: async (courseData: CourseCreate) => {
    const { data } = await api.post<Course>('/courses', courseData);
    return data;
  },
  
  updateCourse: async (courseId: string, courseData: Partial<CourseCreate>) => {
    const { data } = await api.put<Course>(`/courses/${courseId}`, courseData);
    return data;
  },
  
  deleteCourse: async (courseId: string) => {
    await api.delete(`/courses/${courseId}`);
  },
  
  uploadThumbnail: async (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    const { data } = await api.post(`/courses/${courseId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },
  
  enrollInCourse: async (courseId: string) => {
    const { data } = await api.post(`/enrollments`, {
      courseId: courseId
    });
    return data;
  },
  
  createReview: async (courseId: string, review: CourseReview) => {
    const { data } = await api.post(`/courses/${courseId}/reviews`, review);
    return data;
  },
  
  getCourseProgress: async (courseId: string) => {
    const { data } = await api.get(`/courses/${courseId}/progress`);
    return data;
  },
  
  updateCourseProgress: async (courseId: string, lessonId: string, completed: boolean) => {
    const { data } = await api.post(`/courses/${courseId}/progress`, {
      lessonId,
      completed
    });
    return data;
  }
};

export default courseService;
