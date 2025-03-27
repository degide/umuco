
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import courseService, { Course as BackendCourse, CourseCreate } from '@/services/courseService';
import { Course as FrontendCourse } from '@/components/courses/CourseCard';
import { toFrontendCourse, toFrontendCourses, toBackendCourse } from '@/adapters/courseAdapter';

export const useCourses = () => {
  const [courses, setCourses] = useState<FrontendCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<FrontendCourse[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCourses = useCallback(async (page = 1, limit = 10, searchQuery = '', category = '', level = '') => {
    try {
      setIsLoading(true);
      const data = await courseService.getCourses(page, limit, searchQuery, category, level);
      
      // Convert backend courses to frontend format
      const frontendCourses = toFrontendCourses(data.courses);
      
      setCourses(frontendCourses);
      setTotalCourses(data.total);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const fetchEnrolledCourses = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.getEnrolledCourses();
      
      // Convert backend courses to frontend format
      const frontendCourses = toFrontendCourses(data.map(e=> e.course));

      setEnrolledCourses(frontendCourses);
      setError(null);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError('Failed to load enrolled courses');
      toast({
        title: 'Error',
        description: 'Failed to load enrolled courses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedCourses = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.getRecommendedCourses();
      
      // Convert backend courses to frontend format
      const frontendCourses = toFrontendCourses(data);
      
      setCourses(frontendCourses);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommended courses:', err);
      setError('Failed to load recommended courses');
      toast({
        title: 'Error',
        description: 'Failed to load recommended courses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseById = async (courseId: string) => {
    try {
      setIsLoading(true);
      const backendCourse = await courseService.getCourseById(courseId);
      return toFrontendCourse(backendCourse);
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError('Failed to load course details');
      toast({
        title: 'Error',
        description: 'Failed to load course details',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async (courseData: CourseCreate) => {
    try {
      setIsLoading(true);
      const backendCourse = await courseService.createCourse(courseData);
      const newCourse = toFrontendCourse(backendCourse);
      setCourses(prevCourses => [...prevCourses, newCourse]);
      toast({
        title: 'Success',
        description: 'Course created successfully',
      });
      return newCourse;
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course');
      toast({
        title: 'Error',
        description: 'Failed to create course',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<FrontendCourse>) => {
    try {
      setIsLoading(true);
      // Convert frontend course data to backend format
      const backendCourseData = toBackendCourse(courseData);
      const updatedBackendCourse = await courseService.updateCourse(courseId, backendCourseData);
      const updatedCourse = toFrontendCourse(updatedBackendCourse);
      
      setCourses(prevCourses => 
        prevCourses.map(course => course.id === courseId ? updatedCourse : course)
      );
      
      toast({
        title: 'Success',
        description: 'Course updated successfully',
      });
      
      return updatedCourse;
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course');
      toast({
        title: 'Error',
        description: 'Failed to update course',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      setIsLoading(true);
      await courseService.deleteCourse(courseId);
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
      });
      return true;
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course');
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      await courseService.enrollInCourse(courseId);
      // Update the course in our local state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId ? { ...course, enrolled: true } : course
        )
      );
      
      toast({
        title: 'Success',
        description: 'Successfully enrolled in course',
      });
      
      return true;
    } catch (err) {
      console.error('Error enrolling in course:', err);
      toast({
        title: 'Error',
        description: 'Failed to enroll in course',
        variant: 'destructive',
      });
      return false;
    }
  };

  const uploadThumbnail = async (courseId: string, file: File) => {
    try {
      setIsLoading(true);
      const data = await courseService.uploadThumbnail(courseId, file);
      
      // Update course in state with new thumbnail
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, imageUrl: data.thumbnail } 
            : course
        )
      );
      
      toast({
        title: 'Success',
        description: 'Thumbnail uploaded successfully',
      });
      
      return data.thumbnail;
    } catch (err) {
      console.error('Error uploading thumbnail:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload thumbnail',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courses,
    totalCourses,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchCourses,
    enrolledCourses,
    fetchEnrolledCourses,
    fetchRecommendedCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    uploadThumbnail
  };
};
