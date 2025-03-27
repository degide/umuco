
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CourseForm from './CourseForm';
import { useCategories } from '@/hooks/useCategories';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const { courseCategories } = useCategories();

  const handleSubmit = (data: any) => {
    // Transform form data to match API expectations if needed
    const courseData = {
      ...data,
      price: data.isFree ? 0 : data.price || 0,
      duration: parseInt(data.duration, 10) || 1,
      lessons: data.sections.map((section: any, index: number) => ({
        title: section.title,
        content: section.content,
        videoUrl: section.videoUrl || '',
        duration: 30, // Default duration in minutes
        order: index,
      })),
    };
    
    onSubmit(courseData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('courses.editCourse') : t('courses.createNewCourse')}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('courses.editCourseDescription')
              : t('courses.createCourseDescription')}
          </DialogDescription>
        </DialogHeader>

        <CourseForm
          initialData={initialData}
          onSubmit={handleSubmit}
          categories={courseCategories.map(cat => cat.name)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
