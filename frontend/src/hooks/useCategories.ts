
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import categoryService, { CourseCategory, ForumCategory, CategoryCreate } from '@/services/categoryService';

export const useCategories = () => {
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
  const [isLoadingCourseCategories, setIsLoadingCourseCategories] = useState<boolean>(true);
  const [isLoadingForumCategories, setIsLoadingForumCategories] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchCourseCategories = async () => {
    try {
      setIsLoadingCourseCategories(true);
      const data = await categoryService.getCourseCategories();
      setCourseCategories(data);
    } catch (err) {
      console.error('Error fetching course categories:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch course categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCourseCategories(false);
    }
  };

  const fetchForumCategories = async () => {
    try {
      setIsLoadingForumCategories(true);
      const data = await categoryService.getForumCategories();
      setForumCategories(data);
    } catch (err) {
      console.error('Error fetching forum categories:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch forum categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingForumCategories(false);
    }
  };

  useEffect(() => {
    fetchCourseCategories();
    fetchForumCategories();
  }, [toast]);

  const createCourseCategory = async (categoryData: CategoryCreate) => {
    try {
      const newCategory = await categoryService.createCourseCategory(categoryData);
      setCourseCategories(prev => [...prev, newCategory]);
      toast({
        title: 'Success',
        description: 'Course category created successfully',
      });
      return newCategory;
    } catch (err) {
      console.error('Error creating course category:', err);
      toast({
        title: 'Error',
        description: 'Failed to create course category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCourseCategory = async (categoryId: string, categoryData: Partial<CategoryCreate>) => {
    try {
      const updatedCategory = await categoryService.updateCourseCategory(categoryId, categoryData);
      setCourseCategories(prev => 
        prev.map(category => (category._id === categoryId ? updatedCategory : category))
      );
      toast({
        title: 'Success',
        description: 'Course category updated successfully',
      });
      return updatedCategory;
    } catch (err) {
      console.error('Error updating course category:', err);
      toast({
        title: 'Error',
        description: 'Failed to update course category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCourseCategory = async (categoryId: string) => {
    try {
      await categoryService.deleteCourseCategory(categoryId);
      setCourseCategories(prev => prev.filter(category => category._id !== categoryId));
      toast({
        title: 'Success',
        description: 'Course category deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting course category:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete course category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const createForumCategory = async (categoryData: CategoryCreate) => {
    try {
      const newCategory = await categoryService.createForumCategory(categoryData);
      setForumCategories(prev => [...prev, newCategory]);
      toast({
        title: 'Success',
        description: 'Forum category created successfully',
      });
      return newCategory;
    } catch (err) {
      console.error('Error creating forum category:', err);
      toast({
        title: 'Error',
        description: 'Failed to create forum category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateForumCategory = async (categoryId: string, categoryData: Partial<CategoryCreate>) => {
    try {
      const updatedCategory = await categoryService.updateForumCategory(categoryId, categoryData);
      setForumCategories(prev => 
        prev.map(category => (category._id === categoryId ? updatedCategory : category))
      );
      toast({
        title: 'Success',
        description: 'Forum category updated successfully',
      });
      return updatedCategory;
    } catch (err) {
      console.error('Error updating forum category:', err);
      toast({
        title: 'Error',
        description: 'Failed to update forum category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteForumCategory = async (categoryId: string) => {
    try {
      await categoryService.deleteForumCategory(categoryId);
      setForumCategories(prev => prev.filter(category => category._id !== categoryId));
      toast({
        title: 'Success',
        description: 'Forum category deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting forum category:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete forum category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    courseCategories,
    forumCategories,
    isLoadingCourseCategories,
    isLoadingForumCategories,
    fetchCourseCategories,
    fetchForumCategories,
    createCourseCategory,
    updateCourseCategory,
    deleteCourseCategory,
    createForumCategory,
    updateForumCategory,
    deleteForumCategory,
  };
};
