
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if link is active
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled 
        ? 'bg-white/80 dark:bg-umuco-dark/80 backdrop-blur-md shadow-sm py-3' 
        : 'bg-transparent py-5'}`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link 
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-umuco-primary dark:text-white transition-all"
        >
          <span className="text-umuco-secondary">U</span>muco
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link ${isLinkActive('/') && 'nav-link-active'}`}
            >
              {t('common.home')}
            </Link>
            <Link 
              to="/courses" 
              className={`nav-link ${isLinkActive('/courses') && 'nav-link-active'}`}
            >
              {t('common.courses')}
            </Link>
            <Link 
              to="/forum" 
              className={`nav-link ${isLinkActive('/forum') && 'nav-link-active'}`}
            >
              {t('common.forum')}
            </Link>
            {isAuthenticated && (
              <Link 
                to={user.role == "mentor"? "/mentor-dashboard" : user.role == "admin"? "/admin-dashboard" : "/dashboard"}
                className={`nav-link ${(isLinkActive('/dashboard') || isLinkActive("/mentor-dashboard") || isLinkActive("/admin-dashboard")) && 'nav-link-active'}`}
              >
                {t('common.dashboard')}
              </Link>
            )}
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSelector />
          
          {isAuthenticated ? (
            <div className="relative group">
              <Link 
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-gray-100 p-1 pr-4 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 rounded-full bg-gray-300 p-1 dark:bg-gray-700" />
                )}
                <span className="text-sm font-medium">{user?.name.split(' ')[0]}</span>
              </Link>
              <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('common.profile')}
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link 
                to="/login" 
                className="btn btn-ghost"
              >
                {t('common.login')}
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
              >
                {t('common.signup')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute inset-x-0 top-full animate-slide-in">
          <div className="flex flex-col p-4 space-y-3">
            <Link 
              to="/" 
              className={`text-lg font-medium ${isLinkActive('/') ? 'text-umuco-secondary' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {t('common.home')}
            </Link>
            <Link 
              to="/courses" 
              className={`text-lg font-medium ${isLinkActive('/courses') ? 'text-umuco-secondary' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {t('common.courses')}
            </Link>
            <Link 
              to="/forum" 
              className={`text-lg font-medium ${isLinkActive('/forum') ? 'text-umuco-secondary' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {t('common.forum')}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`text-lg font-medium ${isLinkActive('/dashboard') ? 'text-umuco-secondary' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {t('common.dashboard')}
              </Link>
            )}
            <div className="pt-2 flex items-center justify-between">
              <LanguageSelector />
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/profile"
                    className="text-lg font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('common.profile')}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-lg font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="btn btn-ghost"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    {t('common.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
