import {Course as BackendCourse} from '@/services/courseService';
import {Course as FrontendCourse} from '@/components/courses/CourseCard';

/**
 * Transforms a backend course object to frontend format
 */
export const toFrontendCourse = (course: BackendCourse): FrontendCourse => {
  return {
    id: course._id,
    _id: course._id, // Keep for compatibility
    title: course.title,
    description: course.description,
    imageUrl: course.thumbnail || '/placeholder.svg',
    price: course.price,
    category: course.category,
    level: course.level,
    duration: `${course.duration} min`,
    instructor: {
      name: course.instructor.name,
      _id: course.instructor._id,
      avatarUrl: course.instructor.avatar || '/placeholder.svg'
    },
    rating: course.rating,
    studentsCount: course.enrolledCount,
    enrolledCount: course.enrolledCount, // Keep for compatibility
    isFree: course.price === 0,
    enrolled: course.isEnrolled || false, // Will be set based on user enrollments
    progress: course.progress || 0, // Will be set based on user progress
    lessons: course.lessons?.length,
    reviews: course.reviews, // Keep for compatibility
    createdAt: course.createdAt, // Keep for compatibility
    updatedAt: course.updatedAt, // Keep for compatibility
    thumbnail: course.thumbnail, // Added for Dashboard.tsx
  };
};

/**
 * Transform an array of backend courses to frontend format
 */
export const toFrontendCourses = (courses: BackendCourse[]): FrontendCourse[] => {
  return courses.map(course => toFrontendCourse(course));
};

/**
 * Transforms a frontend course object to backend format for creation/updates
 */
export const toBackendCourse = (course: Partial<FrontendCourse>): Partial<BackendCourse> => {
  const backendCourse: Partial<BackendCourse> = {
    title: course.title,
    description: course.description,
    price: course.price,
    category: course.category,
    level: course.level
  };

  // Convert duration string to number if provided
  if (course.duration) {
    const durationMatch = course.duration.match(/\d+/);
    if (durationMatch) {
      backendCourse.duration = parseInt(durationMatch[0], 10);
    }
  }

  // If _id exists, include it
  if (course._id) {
    backendCourse._id = course._id;
  }
  
  // If regular id exists but _id doesn't, use id for _id
  else if (course.id) {
    backendCourse._id = course.id;
  }

  return backendCourse;
};

/**
 * Helper function to convert frontend Course to backend Course specifically for PaymentModal
 * This ensures the _id field is always present when required and all required properties are included
 */
export const toBackendCourseWithId = (course: FrontendCourse): BackendCourse => {
  // Start with a minimal BackendCourse with all required properties
  return {
    _id: course._id || course.id,
    title: course.title,
    description: course.description,
    price: course.price,
    instructor: {
      _id: course.instructor._id || 'instructorId', // Use a default if not available
      name: course.instructor.name,
      avatar: course.instructor.avatarUrl
    },
    category: course.category,
    level: course.level,
    duration: parseInt(course.duration) || 0,
    lessons: [],
    enrolledCount: course.studentsCount || course.enrolledCount || 0,
    rating: course.rating || 0,
    reviews: course.reviews || [],
    createdAt: course.createdAt || new Date().toISOString(),
    updatedAt: course.updatedAt || new Date().toISOString()
  };
};
