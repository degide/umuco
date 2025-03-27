
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { Book, BookOpen, Users, CalendarDays, PlusCircle, Edit } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useEvents } from '@/hooks/useEvents';
import { CourseCard } from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateEventModal from '@/components/events/CreateEventModal';
import { EventsPanel } from '@/components/dashboard/EventsPanel';
import CreateCourseModal from '@/components/courses/CreateCourseModal';

const MentorDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { 
    courses, 
    isLoading: isLoadingCourses,
    createCourse,
    updateCourse 
  } = useCourses();
  
  const { 
    events, 
    isLoading: isLoadingEvents, 
    fetchOrganizedEvents
  } = useEvents();
  
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  
  useEffect(() => {
    fetchOrganizedEvents();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-umuco-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || user?.role !== 'mentor') {
    return <Navigate to="/login" />;
  }
  
  // Filter for instructor's courses
  const instructorCourses = courses.filter(course => {
    if (course.instructor && user) {
      // Safely access _id with optional chaining
      return (course.instructor._id && course.instructor._id === user.id) || course.instructor.name === user.name;
    }
    return false;
  });
  
  // Get total enrolled students
  const totalStudents = instructorCourses.reduce((acc, course) => acc + (course.enrolledCount || 0), 0);
  
  const handleCreateCourse = async (courseData) => {
    try {
      await createCourse(courseData);
      setIsCreateCourseModalOpen(false);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };
  
  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setIsCreateCourseModalOpen(true);
  };
  
  const handleUpdateCourse = async (courseData) => {
    try {
      await updateCourse(courseToEdit._id, courseData);
      setIsCreateCourseModalOpen(false);
      setCourseToEdit(null);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-umuco-primary to-umuco-secondary">
              {t('dashboard.welcome')}, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('dashboard.mentorDashboardDescription')}
            </p>
          </div>
          
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.yourCourses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-umuco-primary mr-3" />
                  <div className="text-2xl font-bold">
                    {isLoadingCourses ? '...' : instructorCourses.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.totalStudents')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <div className="text-2xl font-bold">
                    {isLoadingCourses ? '...' : totalStudents}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.scheduledEvents')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarDays className="h-8 w-8 text-green-500 mr-3" />
                  <div className="text-2xl font-bold">
                    {isLoadingEvents ? '...' : events.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content Tabs */}
          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">
                <Book className="mr-2 h-4 w-4" />
                {t('dashboard.myCourses')}
              </TabsTrigger>
              <TabsTrigger value="events">
                <CalendarDays className="mr-2 h-4 w-4" />
                {t('dashboard.myEvents')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{t('dashboard.yourCourses')}</h2>
                <Button onClick={() => {
                  setCourseToEdit(null);
                  setIsCreateCourseModalOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('dashboard.createNewCourse')}
                </Button>
              </div>
              
              {isLoadingCourses ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umuco-primary"></div>
                </div>
              ) : instructorCourses.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-center mb-2">
                      {t('dashboard.noCourses')}
                    </h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                      {t('dashboard.noCoursesDescription')}
                    </p>
                    <Button onClick={() => {
                      setCourseToEdit(null);
                      setIsCreateCourseModalOpen(true);
                    }}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('dashboard.createFirstCourse')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {instructorCourses.map((course) => (
                    <div key={course._id} className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full"
                        onClick={() => handleEditCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <CourseCard
                        key={course._id}
                        course={course}
                        onEnroll={() => {}}
                        onClick={() => navigate(`/course/${course._id}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="events">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{t('dashboard.yourEvents')}</h2>
                <Button onClick={() => setIsCreateEventModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('dashboard.createNewEvent')}
                </Button>
              </div>
              
              <EventsPanel 
                events={events}
                isLoading={isLoadingEvents}
                title={t('dashboard.organizedEvents')}
                description={t('dashboard.organizedEventsDescription')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <CreateEventModal 
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      />
      
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => {
          setIsCreateCourseModalOpen(false);
          setCourseToEdit(null);
        }}
        onSubmit={courseToEdit ? handleUpdateCourse : handleCreateCourse}
        initialData={courseToEdit}
        isEditing={!!courseToEdit}
      />
      
      <Footer />
    </>
  );
};

export default MentorDashboard;
