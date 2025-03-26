
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Globe, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-umuco-primary dark:text-white">
              <span className="text-umuco-secondary">U</span>muco
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs">
              A smart cultural eLearning and discussion forum platform for personalized learning and cultural knowledge sharing.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-umuco-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-umuco-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-umuco-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  {t('common.courses')}
                </Link>
              </li>
              <li>
                <Link
                  to="/forum"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  {t('common.forum')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  Cultural Heritage
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  Languages
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  Arts & Music
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  Traditional Knowledge
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  Modern Africa
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-umuco-secondary shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  Kigali Innovation City, Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-umuco-secondary shrink-0" />
                <a 
                  href="mailto:info@umuco.rw" 
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  info@umuco.rw
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-umuco-secondary shrink-0" />
                <a 
                  href="tel:+250781234567" 
                  className="text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
                >
                  +250 781 234 567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {year} Umuco. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-umuco-primary dark:text-gray-400 dark:hover:text-umuco-tertiary transition-colors"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
