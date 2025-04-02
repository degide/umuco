import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { Book, BarChart, Bell, Calendar, Clock, Zap } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useEvents } from '@/hooks/useEvents';
import { useNotifications } from '@/hooks/useNotifications';
import { CourseCard } from '@/components/courses/CourseCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { 
    courses, 
    isLoading: isLoadingCourses, 
    fetchEnrolledCourses,
    fetchRecommendedCourses 
  } = useCourses();
  
  const { 
    events, 
    isLoading: isLoadingEvents, 
    fetchEvents 
  } = useEvents();
  
  const {
    notifications,
    isLoading: isLoadingNotifications,
    fetchNotifications,
    markAsRead
  } = useNotifications();
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrolledCourses();
      fetchRecommendedCourses();
      fetchEvents(1, 5, '', '', true);
      fetchNotifications();
    }
  }, [isAuthenticated]);
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const handleCourseAction = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
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
  
  const enrolledCourses = courses.filter(course => course.enrolled);
  
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100);
  
  const recommendedCourses = courses.filter(course => !course.enrolled)
                                 .slice(0, 3);
  
  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.welcomeMessage')}, {user?.name.split(' ')[0]}!
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {t('dashboard.continueLearningSub')}
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Book className="h-6 w-6 text-umuco-secondary" />
                    {t('dashboard.activeCourses')}
                  </h2>
                  <a
                    href="/courses"
                    className="text-sm font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary"
                  >
                    View all
                  </a>
                </div>
                
                {isLoadingCourses ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umuco-primary"></div>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">
                      You haven't enrolled in any courses yet.
                    </p>
                    <a
                      href="/courses"
                      className="mt-4 inline-block rounded-md bg-umuco-primary px-4 py-2 text-sm font-medium text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
                    >
                      Browse Courses
                    </a>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {course.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {course.category} • {course.level}
                            </p>
                            
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                <span className="font-medium text-umuco-primary dark:text-umuco-tertiary">{course.progress || 0}%</span>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div 
                                  className="h-full rounded-full bg-umuco-primary dark:bg-umuco-tertiary" 
                                  style={{ width: `${course.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => handleCourseAction(course._id)}
                                className="rounded-md bg-umuco-primary px-3 py-1 text-sm font-medium text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
                              >
                                {t('courses.continue')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-umuco-secondary" />
                  {t('dashboard.completionRate')}
                </h2>
                
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map(course => (
                      <div key={course._id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{course.title}</span>
                          <span>{course.progress || 0}%</span>
                        </div>
                        <Progress value={course.progress || 0} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No enrolled courses to display progress
                    </p>
                  </div>
                )}
              </section>
              
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-6 w-6 text-umuco-secondary" />
                    {t('dashboard.recommendedCourses')}
                  </h2>
                </div>
                
                {isLoadingCourses ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umuco-primary"></div>
                  </div>
                ) : recommendedCourses.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">
                      No recommended courses available.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {recommendedCourses.map((course) => (
                      <div
                        key={course._id}
                        className="rounded-xl bg-white overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                      >
                        <div className="relative aspect-video">
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                          {course.price === 0 ? (
                            <div className="absolute top-2 right-2">
                              <span className="rounded-full bg-green-500/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                {t('courses.free')}
                              </span>
                            </div>
                          ) : (
                            <div className="absolute top-2 right-2">
                              <span className="rounded-full bg-umuco-secondary/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                ${course.price}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {course.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2" dangerouslySetInnerHTML={{__html: course.description}}>
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {course.duration} {t('courses.weeks')}
                              </span>
                            </div>
                            
                            <Button
                              onClick={() => handleCourseAction(course._id)}
                              className="rounded-md bg-umuco-primary px-3 py-1 text-sm font-medium text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
                            >
                              {t('courses.enroll')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
            
            <div className="space-y-8">
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-umuco-secondary" />
                    {t('dashboard.notifications')}
                  </span>
                  <span className="rounded-full bg-umuco-secondary px-2 py-0.5 text-xs font-medium text-white">
                    {unreadNotifications.length}
                  </span>
                </h2>
                
                {isLoadingNotifications ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-umuco-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification._id}
                        className={`rounded-lg p-3 ${
                          notification.read
                            ? 'bg-gray-50 dark:bg-gray-900/50'
                            : 'bg-umuco-primary/5 dark:bg-umuco-tertiary/10'
                        }`}
                        onClick={() => !notification.read && markAsRead(notification._id)}
                      >
                        <h3 className={`font-medium ${
                          notification.read
                            ? 'text-gray-900 dark:text-white'
                            : 'text-umuco-primary dark:text-umuco-tertiary'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                <a
                  href="/notifications"
                  className="mt-4 block text-center text-sm font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary"
                >
                  View all notifications
                </a>
              </section>
              
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-umuco-secondary" />
                  {t('dashboard.upcomingEvents')}
                </h2>
                
                {isLoadingEvents ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-umuco-primary"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      No upcoming events
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`rounded-md p-2 ${
                            event.type === 'webinar'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : event.type === 'workshop'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {event.type === 'webinar' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                                <path d="M12 8v.01"></path>
                                <path d="M12 12v4"></path>
                                <path d="M21.2 8c.2.7.3 1.4.3 2a10 10 0 1 1-5.9-9.1"></path>
                              </svg>
                            ) : event.type === 'workshop' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 10V6"></path>
                                <path d="M12 14v4"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatEventDate(event.date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <button 
                            className="text-xs font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary"
                            onClick={() => navigate(`/events/${event._id}`)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <a
                  href="/events"
                  className="mt-4 block text-center text-sm font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary"
                >
                  View all events
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
