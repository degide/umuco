
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen, Clock } from 'lucide-react';
import { CourseCard, Course } from './CourseCard';
import CourseDetailsModal from './CourseDetailsModal';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CourseGridProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  onCourseClick?: (course: Course) => void;
  showFilters?: boolean;
  limit?: number;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ 
  courses, 
  onEnroll,
  onCourseClick,
  showFilters = false,
  limit
}) => {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  
  // Apply filters
  let filteredCourses = [...courses];
  
  // Search filter
  if (searchQuery) {
    filteredCourses = filteredCourses.filter(
      course => course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Category filter
  if (categoryFilter && categoryFilter !== 'all') {
    filteredCourses = filteredCourses.filter(
      course => course.category === categoryFilter
    );
  }
  
  // Level filter
  if (levelFilter && levelFilter !== 'all') {
    filteredCourses = filteredCourses.filter(
      course => course.level === levelFilter
    );
  }
  
  // Apply limit if provided
  const displayCourses = limit ? filteredCourses.slice(0, limit) : filteredCourses;
  
  const handleCourseClick = (course: Course) => {
    if (onCourseClick) {
      onCourseClick(course);
    } else {
      setSelectedCourse(course);
    }
  };
  
  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  // Get unique categories and levels for filters
  const categories = Array.from(new Set(courses.map(course => course.category))).filter(Boolean);
  const levels = Array.from(new Set(courses.map(course => course.level))).filter(Boolean);
  
  return (
    <>
      {showFilters && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={t('courses.searchPlaceholder')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('courses.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('courses.all')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('courses.level')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('courses.all')}</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {displayCourses.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {t('courses.noCoursesFound')}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('courses.tryDifferentFilters')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={onEnroll}
              onClick={() => handleCourseClick(course)}
            />
          ))}
        </div>
      )}
      
      {!onCourseClick && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={handleCloseModal}
          onEnroll={onEnroll}
        />
      )}
    </>
  );
};
