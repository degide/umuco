
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, GraduationCap, BookOpen, Users, Globe, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { useCourses } from '@/hooks/useCourses';
import { ForumList } from '@/components/forum/ForumList';
import { useForumPosts } from '@/hooks/useForumPosts';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { courses, enrollInCourse, isLoading: isLoadingCourses } = useCourses();
  const { posts, isLoading: isLoadingPosts } = useForumPosts();
  
  // Featured courses - show first 3 with highest ratings
  const featuredCourses = [...courses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  // Featured discussions - show first 3 with highest views
  const featuredDiscussions = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 text-center bg-gradient-to-b from-umuco-primary/5 to-transparent dark:from-umuco-primary/10">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-umuco-primary to-umuco-secondary">
              {t('home.heroTitle')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/courses')}>
              {t('home.exploreCourses')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/forum')}>
              {t('home.joinForum')}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('home.whyChooseUmuco')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-umuco-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-umuco-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature1Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('home.feature1Description')}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-umuco-secondary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-umuco-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature2Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('home.feature2Description')}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature3Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('home.feature3Description')}</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.feature4Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('home.feature4Description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured courses section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('home.featuredCourses')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('home.featuredCoursesDescription')}
              </p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" onClick={() => navigate('/courses')}>
              {t('home.viewAllCourses')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <CourseGrid 
            courses={featuredCourses} 
            onEnroll={enrollInCourse}
            limit={3}
          />
        </div>
      </section>
      
      {/* Forum preview section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('home.communityDiscussions')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('home.communityDiscussionsDescription')}
              </p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" onClick={() => navigate('/forum')}>
              {t('home.viewAllDiscussions')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <ForumList limit={3} />
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-gradient-to-r from-umuco-primary to-umuco-secondary text-white">
        <div className="container px-4 mx-auto text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t('home.ctaDescription')}
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-umuco-primary hover:bg-white/90"
            onClick={() => navigate('/register')}
          >
            {t('home.startLearning')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Home;
