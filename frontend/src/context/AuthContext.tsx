
import React, { createContext, useContext, useState, useEffect } from 'react';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  bio?: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student' as const,
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Eager learner interested in East African history and languages.',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'mentor' as const,
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Cultural expert with 10 years of experience teaching Swahili.',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Platform administrator and content manager.',
  },
];

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on load
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('umuco_user');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      // Simulate network delay for loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    checkAuthStatus();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // Simulate API request
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Remove password from user object before storing
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('umuco_user', JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    // Simulate API request
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(u => u.email === email);
        
        if (existingUser) {
          setIsLoading(false);
          reject(new Error('Email already in use'));
        } else {
          // Create new user
          const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            role: 'student' as const,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
          };
          
          setUser(newUser);
          localStorage.setItem('umuco_user', JSON.stringify(newUser));
          setIsLoading(false);
          resolve();
        }
      }, 1000); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('umuco_user');
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem('umuco_user', JSON.stringify(updatedUser));
        }
        setIsLoading(false);
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
