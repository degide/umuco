
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';

const CategoryManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    courseCategories,
    forumCategories,
    createCourseCategory,
    updateCourseCategory,
    deleteCourseCategory,
    createForumCategory,
    updateForumCategory,
    deleteForumCategory,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryType, setCategoryType] = useState<'course' | 'forum'>('course');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleOpenModal = (type: 'course' | 'forum', category?: any) => {
    setCategoryType(type);
    if (category) {
      setIsEditing(true);
      setSelectedCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
    } else {
      setIsEditing(false);
      setSelectedCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedCategory(null);
    setCategoryName('');
    setCategoryDescription('');
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const categoryData = {
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      };

      if (isEditing && selectedCategory) {
        if (categoryType === 'course') {
          await updateCourseCategory(selectedCategory._id, categoryData);
        } else {
          await updateForumCategory(selectedCategory._id, categoryData);
        }
        toast({
          title: 'Success',
          description: `${categoryType} category updated successfully`,
        });
      } else {
        if (categoryType === 'course') {
          await createCourseCategory(categoryData);
        } else {
          await createForumCategory(categoryData);
        }
        toast({
          title: 'Success',
          description: `${categoryType} category created successfully`,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} category`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (type: 'course' | 'forum', categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      if (type === 'course') {
        await deleteCourseCategory(categoryId);
      } else {
        await deleteForumCategory(categoryId);
      }
      toast({
        title: 'Success',
        description: `${type} category deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: `Failed to delete ${type} category`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.categoryManagement')}</h2>
      </div>

      <Tabs defaultValue="course">
        <TabsList className="mb-4">
          <TabsTrigger value="course">{t('admin.courseCategories')}</TabsTrigger>
          <TabsTrigger value="forum">{t('admin.forumCategories')}</TabsTrigger>
        </TabsList>

        <TabsContent value="course">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('admin.courseCategories')}</h3>
              <Button onClick={() => handleOpenModal('course')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.addCategory')}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.name')}</TableHead>
                  <TableHead>{t('admin.description')}</TableHead>
                  <TableHead className="w-[100px]">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      {t('admin.noCategories')}
                    </TableCell>
                  </TableRow>
                ) : (
                  courseCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal('course', category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete('course', category._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="forum">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('admin.forumCategories')}</h3>
              <Button onClick={() => handleOpenModal('forum')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.addCategory')}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.name')}</TableHead>
                  <TableHead>{t('admin.description')}</TableHead>
                  <TableHead className="w-[100px]">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forumCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      {t('admin.noCategories')}
                    </TableCell>
                  </TableRow>
                ) : (
                  forumCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="truncate max-w-xs">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal('forum', category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete('forum', category._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? t('admin.editCategory', { type: categoryType })
                : t('admin.addCategory', { type: categoryType })}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? t('admin.editCategoryDescription')
                : t('admin.addCategoryDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.name')} *
              </label>
              <Input
                id="name"
                placeholder={t('admin.categoryNamePlaceholder')}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('admin.description')}
              </label>
              <Input
                id="description"
                placeholder={t('admin.categoryDescriptionPlaceholder')}
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? t('common.update') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
