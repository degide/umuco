
import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    login(email, password).then(()=> {
      toast({
        title: "Success",
        description: "You have been logged in successfully!",
        variant: "default",
      });
    }).catch(error=> {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    }).finally(()=> {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if(user) {
      if(user.role == "mentor") {
        navigate("/mentor-dashboard");
      } else if(user.role == "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate, user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 md:pt-60 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md">
            <div className="rounded-xl bg-white p-8 shadow-md dark:bg-gray-800">
              <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                {t('auth.welcomeBack')}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth.password')}
                    </label>
                    <a href="#" className="text-xs text-umuco-primary hover:underline dark:text-umuco-tertiary">
                      {t('auth.forgotPassword')}
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
                    placeholder="••••••••"
                  />
                </div>
                
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
                  ) : (
                    t('auth.signIn')
                  )}
                </button>
              </form>
              
              <div className="mt-6 flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <span className="mx-4 flex-shrink text-sm text-gray-500 dark:text-gray-400">{t('auth.orContinueWith')}</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  Facebook
                </button>
                <button className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Mail className="h-5 w-5 text-red-500" />
                  Google
                </button>
              </div>
              
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="font-medium text-umuco-primary hover:underline dark:text-umuco-tertiary">
                  {t('common.signup')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
