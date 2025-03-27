
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
  totalAdmins: number;
  newUsersThisMonth: number;
  activeUsers: number;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<User[]>('/users');
      setUsers(data);
      
      // Calculate stats from the retrieved users
      const totalUsers = data.length;
      const totalStudents = data.filter(user => user.role === 'student').length;
      const totalMentors = data.filter(user => user.role === 'mentor').length;
      const totalAdmins = data.filter(user => user.role === 'admin').length;
      
      // Calculate new users this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = data.filter(
        user => new Date(user.createdAt) >= startOfMonth
      ).length;
      
      // For active users, we're just using a mock value
      // In a real app, this would be based on login activity
      const activeUsers = Math.round(totalUsers * 0.7);
      
      setStats({
        totalUsers,
        totalStudents,
        totalMentors,
        totalAdmins,
        newUsersThisMonth,
        activeUsers
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const getUserById = async (userId: string) => {
    try {
      const { data } = await api.get<User>(`/users/${userId}`);
      return data;
    } catch (err) {
      console.error('Error fetching user:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateUserRole = async (userId: string, role: 'student' | 'mentor' | 'admin') => {
    try {
      const { data } = await api.put<User>(`/users/${userId}/role`, { role });
      
      // Update the users list
      setUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? { ...user, role } : user))
      );
      
      // Update stats
      if (stats) {
        const prevUser = users.find(u => u._id === userId);
        if (prevUser) {
          const newStats = { ...stats };
          
          // Decrement previous role count
          if (prevUser.role === 'student') newStats.totalStudents--;
          else if (prevUser.role === 'mentor') newStats.totalMentors--;
          else if (prevUser.role === 'admin') newStats.totalAdmins--;
          
          // Increment new role count
          if (role === 'student') newStats.totalStudents++;
          else if (role === 'mentor') newStats.totalMentors++;
          else if (role === 'admin') newStats.totalAdmins++;
          
          setStats(newStats);
        }
      }
      
      toast({
        title: 'Success',
        description: `User role updated to ${role}`,
      });
      
      return data;
    } catch (err) {
      console.error('Error updating user role:', err);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    users,
    stats,
    isLoading,
    error,
    fetchUsers,
    getUserById,
    updateUserRole,
  };
};
