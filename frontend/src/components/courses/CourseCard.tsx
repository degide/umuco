
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, BarChart, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface Course {
  id: string;
  _id?: string; // Optional for compatibility with backend
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: string;
  duration: string;
  instructor: {
    name: string;
    _id?: string;
    avatarUrl: string;
  };
  enrolled?: boolean;
  progress?: number;
  isFree: boolean;
  price: number;
  rating: number;
  studentsCount: number;
  lessons: number;
  sections?: Array<{
    title: string;
    subtitle?: string;
    content: string;
    videoUrl?: string;
  }>;
  enrolledCount?: number;
  reviews?: Array<any>;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
}

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    onEnroll(course.id);
    
    // Redirect to learning page
    navigate(`/course/${course.id}/learn`);
  };
  
  return (
    <div 
      className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {course.category}
          </span>
        </div>
        {course.isFree ? (
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-green-500/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {t('courses.free')}
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-umuco-secondary/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              ${course.price}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${
              course.level === 'Beginner' 
                ? 'bg-green-500' 
                : course.level === 'Intermediate'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}></span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {course.level}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {course.title}
        </h3>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2" dangerouslySetInnerHTML={{__html: course.description}}>
        </p>

        <div className="mb-5 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
            {course.studentsCount} students
          </div>
        </div>

        {course.enrolled && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="font-medium text-umuco-primary dark:text-umuco-tertiary">{course.progress}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div 
                className="h-full rounded-full bg-umuco-primary dark:bg-umuco-tertiary" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={course.instructor.avatarUrl}
              alt={course.instructor.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {course.instructor.name}
            </span>
          </div>

          <button
            onClick={handleEnrollClick}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              course.enrolled
                ? 'bg-gray-100 text-umuco-primary hover:bg-gray-200 dark:bg-gray-700 dark:text-umuco-tertiary dark:hover:bg-gray-600'
                : 'bg-umuco-primary text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90'
            }`}
          >
            {course.enrolled ? t('courses.continue') : t('courses.enroll')}
          </button>
        </div>
      </div>
    </div>
  );
};
