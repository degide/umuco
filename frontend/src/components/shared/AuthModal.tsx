
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Facebook, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'login') {
        await login(email, password);
        toast({
          title: "Success",
          description: "You have been logged in successfully!",
          variant: "default",
        });
        onClose();
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match!",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        await register(name, email, password);
        toast({
          title: "Success",
          description: "Your account has been created!",
          variant: "default",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900 animate-scale-in">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {type === 'login' ? t('auth.welcomeBack') : t('auth.newAccount')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.fullName')}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
              />
            </div>
            
            {type === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
                />
              </div>
            )}
            
            {type === 'login' && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-umuco-primary hover:underline dark:text-umuco-tertiary">
                  {t('auth.forgotPassword')}
                </a>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-umuco-primary px-4 py-2 text-white shadow-sm hover:bg-umuco-primary/90 focus:outline-none focus:ring-2 focus:ring-umuco-primary focus:ring-offset-2 disabled:opacity-50 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90 dark:focus:ring-umuco-tertiary"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : type === 'login' ? (
                t('auth.signIn')
              ) : (
                t('common.signup')
              )}
            </button>
          </form>
          
          <div className="mt-4 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500 dark:text-gray-400">{t('auth.orContinueWith')}</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook
            </button>
            <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Mail className="h-5 w-5 text-red-500" />
              Google
            </button>
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {type === 'login' ? (
              <>
                {t('auth.noAccount')}{' '}
                <a href="/register" className="font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary">
                  {t('common.signup')}
                </a>
              </>
            ) : (
              <>
                {t('auth.alreadyAccount')}{' '}
                <a href="/login" className="font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary">
                  {t('common.login')}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
