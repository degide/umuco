
import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { ForumList } from '@/components/forum/ForumList';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCourses } from '@/hooks/useCourses';

const Index = () => {
  const { courses, enrollInCourse } = useCourses();
  
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        
        {/* Popular Courses Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Popular Courses
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Discover our most popular cultural courses and start your learning journey
              </p>
            </div>
            
            <CourseGrid 
              courses={courses} 
              onEnroll={enrollInCourse} 
              showFilters={false} 
              limit={3} 
            />
            
            <div className="mt-12 text-center">
              <a
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-umuco-primary px-6 py-3 text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
              >
                View All Courses
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>
        
        {/* Recent Discussions Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Join the Conversation
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Participate in our community discussions about African cultures and traditions
              </p>
            </div>
            
            <ForumList showFilters={false} limit={3} />
            
            <div className="mt-12 text-center">
              <a
                href="/forum"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-umuco-primary px-6 py-3 text-white hover:bg-umuco-primary/90 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
              >
                View All Discussions
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                What Our Community Says
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Hear from our students and mentors about their experiences with Umuco
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="rounded-xl p-6 glass">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/150?img=33"
                    alt="Testimonial"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Nala Kimani</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Student, Kenya</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "Umuco has transformed my understanding of my own cultural roots. The courses are engaging and the community discussions provide wonderful insights."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="rounded-xl p-6 glass">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/150?img=49"
                    alt="Testimonial"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Jean-Pierre Habimana</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mentor, Rwanda</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "As a mentor, I've seen firsthand how Umuco brings people together. The platform makes sharing cultural knowledge easy and engaging for learners of all backgrounds."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="rounded-xl p-6 glass">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/150?img=28"
                    alt="Testimonial"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Amara Osei</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Student, Ghana</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  "The personalized course recommendations have been spot on! I've discovered cultural connections I never knew existed, and the community is so supportive."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-umuco-primary text-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                Ready to Start Your Cultural Learning Journey?
              </h2>
              <p className="mb-8 text-lg text-white/80">
                Join thousands of learners experiencing African cultures through our personalized platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/register"
                  className="rounded-lg bg-white px-6 py-3 text-center font-medium text-umuco-primary hover:bg-gray-100 dark:bg-umuco-tertiary dark:text-gray-900 dark:hover:bg-umuco-tertiary/90"
                >
                  Sign Up Now
                </a>
                <a
                  href="/courses"
                  className="rounded-lg border border-white px-6 py-3 text-center font-medium text-white hover:bg-white/10"
                >
                  Explore Courses
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
