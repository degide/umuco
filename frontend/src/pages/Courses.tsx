
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/components/courses/CourseCard';
import CourseDetailsModal from '@/components/courses/CourseDetailsModal';

const Courses = () => {
  const { t } = useTranslation();
  const { courses, enrollInCourse } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const handleOpenCourseDetails = (course: Course) => {
    setSelectedCourse(course);
  };
  
  const handleCloseCourseDetails = () => {
    setSelectedCourse(null);
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300 inline-block">
              {t('courses.exploreCourses')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('courses.exploreCoursesDescription')}
            </p>
          </div>
          
          <CourseGrid 
            courses={courses} 
            onEnroll={enrollInCourse}
            onCourseClick={handleOpenCourseDetails}
            showFilters={true}
          />
        </div>
      </main>
      
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={handleCloseCourseDetails}
        onEnroll={enrollInCourse}
      />
      
      <Footer />
    </>
  );
};

export default Courses;
