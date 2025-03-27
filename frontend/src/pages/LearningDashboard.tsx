
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Video, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import courseService from '@/services/courseService';
import enrollmentService from '@/services/enrollmentService';

const LearningDashboard = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: t('auth.required'),
        description: t('auth.loginToAccess'),
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate, toast, t]);
  
  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      if (!courseId || !isAuthenticated) return;
      
      try {
        setIsLoading(true);
        
        // Fetch course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // Fetch user enrollments
        const enrollments = await enrollmentService.getUserEnrollments();
        const currentEnrollment = enrollments.find(e => e.course.id === courseId);
        
        if (!currentEnrollment) {
          toast({
            title: t('courses.notEnrolled'),
            description: t('courses.enrollFirst'),
            variant: "destructive",
          });
          navigate('/courses');
          return;
        }
        
        setEnrollment(currentEnrollment);
        
        // Calculate progress
        if (currentEnrollment.progress.length > 0 && courseData.lessons.length > 0) {
          const completedLessons = currentEnrollment.progress.filter(p => p.completed).length;
          const progressPercentage = (completedLessons / courseData.lessons.length) * 100;
          setProgress(progressPercentage);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast({
          title: t('common.error'),
          description: t('courses.fetchError'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseAndEnrollment();
  }, [courseId, isAuthenticated, navigate, toast, t]);
  
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-umuco-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('courses.courseNotFound')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {t('courses.courseNotFoundDescription')}
            </p>
            <Button onClick={() => navigate('/courses')}>
              {t('courses.backToCourses')}
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Extract lessons from the course for the UI
  const sections = course.lessons.sort((a, b) => a.order - b.order);
  
  const handleComplete = async () => {
    try {
      if (!enrollment) return;
      
      const currentLesson = sections[activeSection];
      
      // Update lesson progress
      await enrollmentService.updateLessonProgress(enrollment._id, {
        lessonId: currentLesson._id,
        completed: true
      });
      
      // Calculate new progress
      const newProgress = Math.min(100, ((activeSection + 1) / sections.length) * 100);
      setProgress(newProgress);
      
      if (activeSection < sections.length - 1) {
        setActiveSection(activeSection + 1);
        toast({
          title: t('courses.sectionCompleted'),
          description: t('courses.movingToNextSection'),
        });
      } else if (newProgress >= 100) {
        toast({
          title: t('courses.courseCompleted'),
          description: t('courses.congratulations'),
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: t('common.error'),
        description: t('courses.progressUpdateError'),
        variant: "destructive",
      });
    }
  };
  
  // Function to render video content
  const renderVideo = (videoUrl) => {
    if (!videoUrl) return null;
    
    // Extract YouTube video ID from various formats of YouTube URLs
    const getYouTubeEmbedUrl = (url) => {
      // If it's already an embed URL
      if (url.includes('youtube.com/embed/')) return url;
      
      // Extract video ID from watch URL or youtu.be URL
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      
      return url;
    };
    
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden mb-6 bg-gray-200">
        <iframe 
          src={embedUrl}
          title={sections[activeSection].title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  
  // Check if the current lesson is completed
  const isCurrentLessonCompleted = () => {
    if (!enrollment || !sections[activeSection]) return false;
    
    const lessonId = sections[activeSection]._id;
    return enrollment.progress.some(p => p.lessonId === lessonId && p.completed);
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/courses')}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t('courses.backToCourses')}
                  </Button>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <img
                      src={course.instructor.avatar || "/placeholder.svg"}
                      alt={course.instructor.name}
                      className="h-6 w-6 rounded-full mr-2"
                    />
                    <span>{course.instructor.name}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {t('courses.progress')}
                    </span>
                    <span className="font-medium text-umuco-primary dark:text-umuco-tertiary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="mt-2" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t('courses.courseContent')}
                  </h3>
                  
                  {sections.map((section, index) => {
                    // Check if this lesson is completed
                    const isCompleted = enrollment?.progress.some(
                      p => p.lessonId === section._id && p.completed
                    );
                    
                    return (
                      <div 
                        key={section._id}
                        className={`flex items-start p-3 rounded-md cursor-pointer transition-colors ${
                          activeSection === index
                            ? 'bg-umuco-primary/10 dark:bg-umuco-tertiary/10'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveSection(index)}
                      >
                        <div className="flex-shrink-0 mt-0.5 mr-3">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : activeSection === index ? (
                            <Video className="h-5 w-5 text-umuco-primary dark:text-umuco-tertiary" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-medium ${
                            activeSection === index
                              ? 'text-umuco-primary dark:text-umuco-tertiary'
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {index + 1}. {section.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('courses.duration')}: {section.duration} {t('courses.minutes')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="lg:w-3/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {sections[activeSection]?.title}
                </h1>
                
                {/* Video (if available) */}
                {sections[activeSection]?.videoUrl && renderVideo(sections[activeSection].videoUrl)}
                
                {/* Content */}
                <div className="max-w-none">
                  <MarkdownViewer content={sections[activeSection]?.content} />
                </div>
                
                <div className="flex justify-between mt-10">
                  <Button
                    variant="outline"
                    onClick={() => activeSection > 0 && setActiveSection(activeSection - 1)}
                    disabled={activeSection === 0}
                  >
                    {t('courses.previousSection')}
                  </Button>
                  
                  {activeSection < sections.length - 1 ? (
                    <Button 
                      onClick={handleComplete}
                      disabled={isCurrentLessonCompleted()}
                    >
                      {t('courses.completeAndContinue')}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleComplete}
                      disabled={isCurrentLessonCompleted() || progress >= 100}
                    >
                      {t('courses.completeSection')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LearningDashboard;
