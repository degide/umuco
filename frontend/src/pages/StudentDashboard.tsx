
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Clock, CalendarDays } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useEvents } from '@/hooks/useEvents';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { EventsPanel } from '@/components/dashboard/EventsPanel';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { courses, enrolledCourses, fetchEnrolledCourses, isLoading: isLoadingCourses } = useCourses();
  const { 
    events, 
    isLoading: isLoadingEvents, 
    fetchEvents, 
    registerForEvent 
  } = useEvents();
  const {
    notifications,
    isLoading: isLoadingNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  useEffect(() => {
    // Fetch upcoming events
    fetchEvents(1, 10, '', '', true);
  }, [fetchEvents]);

  useEffect(() => {
    if(!enrolledCourses || enrolledCourses.length === 0) {
      fetchEnrolledCourses()
    }
  }, []);

  useEffect(() => {
    if(!enrolledCourses || enrolledCourses.length === 0) {

    }
  }, [enrolledCourses]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-umuco-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Filter for in-progress courses (those with progress > 0 but < 100)
  const inProgressCourses = enrolledCourses.filter(course => course.progress! > 0 && course.progress! < 100);
  
  // Get recommended courses (not enrolled, based on categories of enrolled courses)
  const enrolledCategories = enrolledCourses.map(course => course.category);
  const recommendedCourses = courses
    .filter(course => 
      !course.enrolled && 
      enrolledCategories.includes(course.category)
    )
    .slice(0, 3);
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-umuco-primary to-umuco-secondary">
              {t('dashboard.welcome')}, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('dashboard.studentDashboardDescription')}
            </p>
          </div>
          
          {/* Overview section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.enrolledCourses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-umuco-primary mr-3" />
                  <div className="text-2xl font-bold">
                    {isLoadingCourses ? '...' : enrolledCourses.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.coursesInProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-amber-500 mr-3" />
                  <div className="text-2xl font-bold">
                    {isLoadingCourses ? '...' : inProgressCourses.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.upcomingEvents')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarDays className="h-8 w-8 text-blue-500 mr-3" />
                  <div className="text-2xl font-bold">
                    {isLoadingEvents ? '...' : events.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.unreadNotifications')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="relative">
                    <GraduationCap className="h-8 w-8 text-green-500 mr-3" />
                    {!isLoadingNotifications && notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold">
                    {isLoadingNotifications ? '...' : notifications.filter(n => !n.read).length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left column - Active courses */}
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t('dashboard.activeCourses')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.activeCoursesDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCourses ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-umuco-primary"></div>
                    </div>
                  ) : enrolledCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium">{t('dashboard.noEnrolledCourses')}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {t('dashboard.noEnrolledCoursesDescription')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enrolledCourses.map(course => (
                        <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={course.imageUrl} 
                                alt={course.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium mb-1 truncate">{course.title}</h4>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <span>{course.instructor.name}</span>
                                <span className="mx-2">•</span>
                                <span>{course.level}</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between mb-1">
                                  <span>{t('dashboard.progress')}</span>
                                  <span>{course.progress || 0}%</span>
                                </div>
                                <Progress value={course.progress || 0} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Tabs defaultValue="upcoming" className="mb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {t('dashboard.upcomingEvents')}
                  </TabsTrigger>
                  <TabsTrigger value="recommended">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t('dashboard.recommendedForYou')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  <EventsPanel 
                    events={events}
                    onRegister={registerForEvent}
                    isLoading={isLoadingEvents}
                    title={t('dashboard.upcomingEvents')}
                    description={t('dashboard.upcomingEventsDescription')}
                  />
                </TabsContent>
                
                <TabsContent value="recommended">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('dashboard.recommendedForYou')}</CardTitle>
                      <CardDescription>
                        {t('dashboard.recommendedDescription')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {isLoadingCourses ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-umuco-primary"></div>
                        </div>
                      ) : recommendedCourses.length === 0 ? (
                        <div className="text-center py-8">
                          <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
                          <p className="mt-2 text-gray-500">
                            {t('dashboard.noRecommendations')}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {recommendedCourses.map(course => (
                            <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <div className="flex items-start gap-3">
                                <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                                  <img 
                                    src={course.imageUrl} 
                                    alt={course.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{course.title}</h4>
                                  <div className="text-xs text-gray-500 mt-1">
                                    <span>{course.instructor.name}</span>
                                    <span className="mx-1">•</span>
                                    <span>{course.level}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right column - Notifications */}
            <div>
              <NotificationsPanel 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                isLoading={isLoadingNotifications}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StudentDashboard;
