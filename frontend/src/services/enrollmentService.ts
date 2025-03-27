
import api from './api';
import {Course} from "@/services/courseService.ts";

export interface Enrollment {
  _id: string;
  user: string;
  course: Course;
  progress: {
    lessonId: string;
    completed: boolean;
    lastAccessed: string;
  }[];
  completed: boolean;
  certificateIssued: boolean;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
}

export interface InstructorStats {
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  totalRevenue: number;
  courseStats: {
    courseId: string;
    title: string;
    students: number;
    rating: number;
    revenue: number;
  }[];
}

const enrollmentService = {
  enrollInCourse: async (courseId: string, paymentId?: string) => {
    const { data } = await api.post<Enrollment>('/enrollments', { courseId, paymentId });
    return data;
  },
  
  getUserEnrollments: async () => {
    const { data } = await api.get<Enrollment[]>('/enrollments');
    return data;
  },
  
  getEnrollmentById: async (enrollmentId: string) => {
    const { data } = await api.get<Enrollment>(`/enrollments/${enrollmentId}`);
    return data;
  },
  
  updateLessonProgress: async (enrollmentId: string, progress: LessonProgress) => {
    const { data } = await api.put<Enrollment>(`/enrollments/${enrollmentId}/progress`, progress);
    return data;
  },
  
  getInstructorStats: async () => {
    const { data } = await api.get<InstructorStats>('/enrollments/stats/instructor');
    return data;
  }
};

export default enrollmentService;
