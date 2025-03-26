
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Users, Book, Award, Clock, Save, X } from 'lucide-react';
import { useAuth, User } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileCardProps {
  user: User;
  isEditable?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  isEditable = false 
}) => {
  const { t } = useTranslation();
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        name,
        bio,
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setName(user.name);
    setBio(user.bio || '');
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl bg-white shadow-md overflow-hidden dark:bg-gray-800">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-umuco-primary to-umuco-tertiary"></div>
      
      <div className="px-6 pb-6">
        {/* Avatar and Edit Button */}
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="relative">
            <img
              src={user.avatar || 'https://i.pravatar.cc/150?img=default'}
              alt={user.name}
              className="h-32 w-32 rounded-full border-4 border-white object-cover dark:border-gray-800"
            />
            
            {user.role !== 'student' && (
              <div className="absolute bottom-0 right-0 rounded-full bg-white p-1 dark:bg-gray-800">
                <div className="rounded-full bg-umuco-secondary px-2 py-1 text-xs font-medium text-white">
                  {user.role === 'mentor' ? 'Mentor' : 'Admin'}
                </div>
              </div>
            )}
          </div>
          
          {isEditable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-20 flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Edit className="h-4 w-4" />
              {t('profile.editProfile')}
            </button>
          )}
          
          {isEditing && (
            <div className="mt-20 flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center gap-1 rounded-md bg-umuco-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-umuco-primary/90 disabled:opacity-50 dark:bg-umuco-tertiary dark:hover:bg-umuco-tertiary/90"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t('profile.saveChanges')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-umuco-primary focus:outline-none focus:ring-1 focus:ring-umuco-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-umuco-tertiary dark:focus:ring-umuco-tertiary"
                ></textarea>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-umuco-secondary" />
                  8 Followers
                </div>
                <div className="flex items-center gap-1">
                  <Book className="h-4 w-4 text-umuco-secondary" />
                  5 Courses
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-umuco-secondary" />
                  12 Achievements
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-umuco-secondary" />
                  Joined June 2023
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300">
                {user.bio || 'No bio available. Add a bio to tell others about yourself.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
