
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Book, Award, Settings } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { useAuth } from '@/context/AuthContext';
import { CourseCard, Course } from '@/components/courses/CourseCard';

// Mock enrolled courses
const ENROLLED_COURSES: Course[] = [
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

// Mock achievements
const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'Fast Learner',
    description: 'Completed 3 courses in the first month',
    icon: '🚀',
    date: '2023-06-15',
  },
  {
    id: 2,
    title: 'Discussion Starter',
    description: 'Created 5 forum discussions',
    icon: '💬',
    date: '2023-07-02',
  },
  {
    id: 3,
    title: 'Cultural Explorer',
    description: 'Enrolled in courses from 3 different regions',
    icon: '🌍',
    date: '2023-07-20',
  },
];

const Profile = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Handle course actions
  const handleCourseAction = (courseId: string) => {
    // This would typically navigate to the course page
    console.log(`Continue course: ${courseId}`);
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
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Information Column */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <ProfileCard user={user!} isEditable={true} />
                
                {/* Account Settings */}
                <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-umuco-secondary" />
                    {t('profile.accountSettings')}
                  </h2>
                  
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                        Change Password
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                        Notification Settings
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                        Privacy Settings
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
                        Payment Methods
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Delete Account
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Courses and Activity Column */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Enrolled Courses */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Book className="h-6 w-6 text-umuco-secondary" />
                    {t('profile.enrolledCourses')}
                  </h2>
                  
                  {ENROLLED_COURSES.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {ENROLLED_COURSES.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          onEnroll={handleCourseAction}
                        />
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
                </div>
                
                {/* Achievements */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="h-6 w-6 text-umuco-secondary" />
                    {t('profile.achievements')}
                  </h2>
                  
                  <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {ACHIEVEMENTS.map((achievement) => (
                        <div key={achievement.id} className="rounded-lg border border-gray-200 p-4 transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700">
                          <div className="mb-2 text-3xl">{achievement.icon}</div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
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

export default Profile;
