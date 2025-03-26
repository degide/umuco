
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Book, BarChart, Bell, Calendar, Clock, Zap } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/components/courses/CourseCard';

// Mock courses for the dashboard
const ACTIVE_COURSES: Course[] = [
  {
    id: '4',
    title: 'African Mythology and Storytelling',
    description: 'Discover the ancient myths, legends, and storytelling traditions from across the African continent.',
    imageUrl: 'https://images.unsplash.com/photo-1616667664034-c947c1e2cf29?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Literature',
    level: 'Intermediate',
    duration: '10 weeks',
    instructor: {
      name: 'Chinua Achebe',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    isFree: true,
    rating: 4.8,
    studentsCount: 1893,
    enrolled: true,
    progress: 35,
  },
  {
    id: '6',
    title: 'Traditional African Textiles',
    description: 'Learn about the diverse fabric traditions and textile techniques from different African regions.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1701205420783-29caf70c5364?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Crafts',
    level: 'Beginner',
    duration: '6 weeks',
    instructor: {
      name: 'Grace Ndlovu',
      avatarUrl: 'https://i.pravatar.cc/150?img=23',
    },
    isFree: false,
    price: 44.99,
    rating: 4.3,
    studentsCount: 521,
    enrolled: true,
    progress: 65,
  },
];

const RECOMMENDED_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to Swahili Language',
    description: 'Learn the basics of Swahili, one of the most widely spoken languages in Africa.',
    imageUrl: 'https://images.unsplash.com/photo-1528459199957-0ff28496a7f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=824&q=80',
    category: 'Languages',
    level: 'Beginner',
    duration: '6 weeks',
    instructor: {
      name: 'Sarah Odhiambo',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    isFree: true,
    rating: 4.7,
    studentsCount: 1245,
  },
  {
    id: '2',
    title: 'Traditional African Drumming',
    description: 'Explore the rich rhythmic traditions of West African drumming and its cultural significance.',
    imageUrl: 'https://images.unsplash.com/photo-1516685304081-de7947d419d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Music',
    level: 'Intermediate',
    duration: '8 weeks',
    instructor: {
      name: 'Kwame Mensah',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
    isFree: false,
    price: 49.99,
    rating: 4.9,
    studentsCount: 872,
  },
];

// Mock notifications
const NOTIFICATIONS = [
  {
    id: 1,
    title: 'New course recommendation',
    message: 'Based on your interests, we recommend "East African Cuisine Masterclass"',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    title: 'Forum activity',
    message: 'Someone replied to your post "Traditional vs modern wedding ceremonies in Kenya"',
    time: '1 day ago',
    read: true,
  },
  {
    id: 3,
    title: 'Course update',
    imageUrl: 'https://images.unsplash.com/photo-1616667664034-c947c1e2cf29?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    message: 'New content has been added to "African Mythology and Storytelling"',
    time: '3 days ago',
    read: true,
  },
];

// Mock events
const EVENTS = [
  {
    id: 1,
    title: 'Live Q&A Session: West African Music',
    date: '2023-08-15T15:00:00',
    type: 'webinar',
  },
  {
    id: 2,
    title: 'Virtual Cooking Workshop: Ethiopian Cuisine',
    date: '2023-08-20T13:30:00',
    type: 'workshop',
  },
  {
    id: 3,
    title: 'Cultural Forum: The Future of African Languages',
    date: '2023-08-25T18:00:00',
    type: 'forum',
  },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Format date for events
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Handle course actions
  const handleCourseAction = (courseId: string) => {
    // This would typically navigate to the course page
    console.log(`Action for course: ${courseId}`);
  };
  
  // Show login page if not authenticated
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.welcomeMessage')}, {user?.name.split(' ')[0]}!
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {t('dashboard.continueLearningSub')}
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Courses */}
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
                
                {ACTIVE_COURSES.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {ACTIVE_COURSES.map((course) => (
                      <div
                        key={course.id}
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
                                <span className="font-medium text-umuco-primary dark:text-umuco-tertiary">{course.progress}%</span>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div 
                                  className="h-full rounded-full bg-umuco-primary dark:bg-umuco-tertiary" 
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => handleCourseAction(course.id)}
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
                ) : (
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
                )}
              </section>
              
              {/* Course Completion Rate */}
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-umuco-secondary" />
                  {t('dashboard.completionRate')}
                </h2>
                
                <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Charts will be implemented with Recharts
                  </p>
                </div>
              </section>
              
              {/* Recommended Courses */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-6 w-6 text-umuco-secondary" />
                    {t('dashboard.recommendedCourses')}
                  </h2>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {RECOMMENDED_COURSES.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-xl bg-white overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                    >
                      <div className="relative aspect-video">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                        {course.isFree ? (
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
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-umuco-primary dark:text-umuco-tertiary" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {course.duration}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleCourseAction(course.id)}
                            className="rounded-md bg-umuco-primary px-3 py-1 text-sm font-medium text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
                          >
                            {t('courses.enroll')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            {/* Sidebar Column */}
            <div className="space-y-8">
              {/* Notifications */}
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-umuco-secondary" />
                    {t('dashboard.notifications')}
                  </span>
                  <span className="rounded-full bg-umuco-secondary px-2 py-0.5 text-xs font-medium text-white">
                    {NOTIFICATIONS.filter(n => !n.read).length}
                  </span>
                </h2>
                
                <div className="space-y-4">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg p-3 ${
                        notification.read
                          ? 'bg-gray-50 dark:bg-gray-900/50'
                          : 'bg-umuco-primary/5 dark:bg-umuco-tertiary/10'
                      }`}
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
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                
                <a
                  href="#"
                  className="mt-4 block text-center text-sm font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary"
                >
                  View all notifications
                </a>
              </section>
              
              {/* Upcoming Events */}
              <section className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-umuco-secondary" />
                  {t('dashboard.upcomingEvents')}
                </h2>
                
                <div className="space-y-4">
                  {EVENTS.map((event) => (
                    <div
                      key={event.id}
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
                        <button className="text-xs font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary">
                          Add to calendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <a
                  href="#"
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
