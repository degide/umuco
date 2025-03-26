
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { AuthModal } from '@/components/shared/AuthModal';
import { useAuth } from '@/context/AuthContext';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('register');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // If already logged in, go to dashboard
      window.location.href = '/dashboard';
    } else {
      // Show registration modal
      setAuthType('register');
      setShowAuthModal(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pt-32 pb-16 dark:from-gray-900 dark:to-gray-800">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-umuco-secondary/10 blur-3xl"></div>
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-umuco-primary/10 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Hero Content */}
          <div className="order-2 lg:order-1">
            <div className="flex flex-col items-start space-y-6 md:max-w-xl">
              <div className="inline-block rounded-full bg-umuco-primary/10 px-4 py-1 text-sm font-medium text-umuco-primary dark:bg-umuco-tertiary/10 dark:text-umuco-tertiary">
                ✨ Cultural eLearning Platform
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                {t('home.heroTitle')}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('home.heroSubtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group btn btn-primary flex items-center gap-2"
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <Link to="/courses" className="btn btn-ghost">
                  {t('home.exploreCourses')}
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-umuco-primary dark:text-umuco-tertiary">25k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-umuco-primary dark:text-umuco-tertiary">120+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-umuco-primary dark:text-umuco-tertiary">15</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-umuco-secondary to-umuco-tertiary opacity-30 blur"></div>
              <div className="glass relative rounded-2xl overflow-hidden border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1524414621493-7dec026782c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="African students learning on a laptop" 
                  className="h-full w-full object-cover"
                  width={600}
                  height={400}
                />
              </div>
              
              {/* Floating Card Effect 1 */}
              <div className="glass absolute -top-6 -right-6 w-40 animate-float rounded-lg p-4 shadow-lg border border-white/20 dark:border-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500 p-2">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">AI Learning</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Personalized</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Card Effect 2 */}
              <div className="glass absolute -bottom-6 -left-6 w-40 animate-float rounded-lg p-4 shadow-lg border border-white/20 dark:border-gray-800/30" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-umuco-secondary p-2">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">Cultural</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Authentic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
      />
    </section>
  );
};
