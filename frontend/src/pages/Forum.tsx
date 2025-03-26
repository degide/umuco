
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ForumList } from '@/components/forum/ForumList';
import CreatePostModal from '@/components/forum/CreatePostModal';

const Forum = () => {
  const { t } = useTranslation();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('forum.recentDiscussions')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Join conversations about African cultures, traditions, and contemporary issues. 
              Share your thoughts and learn from others in our community.
            </p>
          </div>
          
          <ForumList 
            showFilters={true} 
            onCreatePost={() => setIsCreatePostModalOpen(true)} 
          />
          
          <CreatePostModal 
            isOpen={isCreatePostModalOpen} 
            onClose={() => setIsCreatePostModalOpen(false)} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Forum;
