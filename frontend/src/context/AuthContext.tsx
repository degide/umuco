import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { AuthResponse } from '@/services/authService';
import userService, { UserProfile, UpdateProfileData } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

export interface User {
  _id: string;
  id?: string; // Add this for compatibility
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Get user profile
        const userData = await userService.getProfile();
        setUser(preprocessUserData(userData));
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login({ email, password });
      setUser(preprocessUserData(userData));
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.register({ name, email, password });
      setUser(preprocessUserData(userData));
      toast({
        title: 'Welcome to Umuco!',
        description: 'Your account has been created successfully.',
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: 'Please check your information and try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    try {
      const updatedUser = await userService.updateProfile(data);
      const processedUser = preprocessUserData(updatedUser);
      setUser(processedUser);
      return processedUser;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const preprocessUserData = (userData: User): User => {
  return {
    ...userData,
    id: userData._id, // Add id as alias of _id
  };
};
