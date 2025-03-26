
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, Users, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/components/courses/CourseCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import PaymentModal from './PaymentModal';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  if (!course) return null;
  
  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast({
        title: t('auth.required'),
        description: t('auth.loginToEnroll'),
        variant: "destructive",
      });
      onClose();
      navigate('/login');
      return;
    }
    
    // If course is paid and not already enrolled, show payment modal
    if (!course.isFree && !course.enrolled) {
      setIsPaymentModalOpen(true);
      return;
    }
    
    onEnroll(course.id);
    // Redirect to learning page
    navigate(`/course/${course.id}/learn`);
  };

  // Use default placeholder if image doesn't exist
  const courseImage = course.imageUrl || '/placeholder.svg';
  const instructorAvatar = course.instructor?.avatarUrl || '/placeholder.svg';
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] h-auto max-h-[90%] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{course.title}</DialogTitle>
            <DialogDescription>
              {course.instructor?.name && (
                <div className="flex items-center mt-2">
                  <img
                    src={instructorAvatar}
                    alt={course.instructor.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span>{t('courses.by')} {course.instructor.name}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 max-h-full overflow-y-auto py-4">
            <div className="space-y-4 pr-4">
              <div className="relative aspect-video rounded-lg overflow-y-auto">
                <img
                  src={courseImage}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {course.isFree ? (
                    <Badge className="bg-green-500">
                      {t('courses.free')}
                    </Badge>
                  ) : (
                    <Badge className="bg-umuco-secondary">
                      ${course.price}
                    </Badge>
                  )}
                  <Badge>{course.level}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
                  <span>{course.studentsCount || 0} {t('courses.students')}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('courses.about')}</h3>
                <div className="text-gray-600 dark:text-gray-300">
                  <MarkdownViewer content={course.description} />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('courses.whatYouWillLearn')}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 mt-1 text-green-500" />
                    <span>{t('courses.learningPoint1', { category: course.category })}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 mt-1 text-green-500" />
                    <span>{t('courses.learningPoint2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 mt-1 text-green-500" />
                    <span>{t('courses.learningPoint3')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-4 w-4 mt-1 text-green-500" />
                    <span>{t('courses.learningPoint4')}</span>
                  </li>
                </ul>
              </div>
              
              {course.sections && course.sections.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('courses.courseContent')}</h3>
                  <div className="space-y-2">
                    {course.sections.map((section, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <h4 className="font-medium">{index + 1}. {section.title}</h4>
                        {section.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{section.subtitle}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
            {course.enrolled ? (
              <Button onClick={() => navigate(`/course/${course.id}/learn`)}>
                {t('courses.continueLearning')}
              </Button>
            ) : (
              <Button onClick={handleEnroll}>
                {t('courses.enroll')} {!course.isFree && `• $${course.price}`}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <PaymentModal 
        course={course}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={onEnroll}
      />
    </>
  );
};

export default CourseDetailsModal;
