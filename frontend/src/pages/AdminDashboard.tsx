
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Users, Book, MessageSquare, BarChart, User, Shield, Award } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses } from '@/hooks/useCourses';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useForumPosts } from '@/hooks/useForumPosts';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { courses, isLoading: isLoadingCourses } = useCourses();
  const { 
    users, 
    stats, 
    isLoading: isLoadingUsers,
    updateUserRole 
  } = useUserManagement();
  const { 
    posts: forumPosts, 
    isLoading: isLoadingForumPosts,
    deletePost 
  } = useForumPosts();
  
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [forumSearchQuery, setForumSearchQuery] = useState('');
  
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<'student' | 'mentor' | 'admin'>('student');
  
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-umuco-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  // Filter users based on search query
  const filteredUsers = users.filter(
    user => 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(
    course => 
      course.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(courseSearchQuery.toLowerCase()))
  );
  
  // Filter forum posts based on search query
  const filteredForumPosts = forumPosts.filter(
    post => 
      post.title.toLowerCase().includes(forumSearchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(forumSearchQuery.toLowerCase())
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleOpenRoleDialog = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };
  
  const handleUpdateRole = async () => {
    if (selectedUser && newRole) {
      try {
        await updateUserRole(selectedUser._id, newRole);
        setRoleDialogOpen(false);
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  };
  
  const handleOpenDeletePostDialog = (postId: string) => {
    setPostToDelete(postId);
    setDeletePostDialogOpen(true);
  };
  
  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        setDeletePostDialogOpen(false);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.adminDashboard')}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {t('dashboard.welcomeMessage')}, {user?.name}!
            </p>
          </div>
          
          {/* Overview Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.totalStudents')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isLoadingUsers ? '...' : stats?.totalStudents || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.totalMentors')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-500 mr-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isLoadingUsers ? '...' : stats?.totalMentors || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.totalCourses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Book className="h-8 w-8 text-green-500 mr-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isLoadingCourses ? '...' : courses.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.totalForumPosts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-orange-500 mr-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isLoadingForumPosts ? '...' : forumPosts.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="users">
            <TabsList className="mb-8">
              <TabsTrigger value="users">
                <User className="h-4 w-4 mr-2" />
                {t('dashboard.users')}
              </TabsTrigger>
              <TabsTrigger value="courses">
                <Book className="h-4 w-4 mr-2" />
                {t('dashboard.courses')}
              </TabsTrigger>
              <TabsTrigger value="forum">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('dashboard.forum')}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart className="h-4 w-4 mr-2" />
                {t('dashboard.analytics')}
              </TabsTrigger>
            </TabsList>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle>
                      {t('dashboard.userManagement')}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('dashboard.searchUsers')}
                        className="max-w-xs"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-umuco-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('dashboard.userName')}</TableHead>
                          <TableHead>{t('dashboard.email')}</TableHead>
                          <TableHead>{t('dashboard.role')}</TableHead>
                          <TableHead>{t('dashboard.joinDate')}</TableHead>
                          <TableHead>{t('dashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  user.role === 'admin' 
                                    ? 'border-red-500 text-red-500' 
                                    : user.role === 'mentor'
                                    ? 'border-purple-500 text-purple-500'
                                    : 'border-blue-500 text-blue-500'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOpenRoleDialog(user)}
                                >
                                  {t('dashboard.changeRole')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    {t('dashboard.exportData')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle>
                      {t('dashboard.courseManagement')}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('dashboard.searchCourses')}
                        className="max-w-xs"
                        value={courseSearchQuery}
                        onChange={(e) => setCourseSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingCourses ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-umuco-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('dashboard.courseTitle')}</TableHead>
                          <TableHead>{t('dashboard.category')}</TableHead>
                          <TableHead>{t('dashboard.instructor')}</TableHead>
                          <TableHead>{t('dashboard.pricing')}</TableHead>
                          <TableHead>{t('dashboard.students')}</TableHead>
                          <TableHead>{t('dashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0"
                                >
                                  {course.imageUrl && (
                                    <img 
                                      src={course.imageUrl} 
                                      alt={course.title} 
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>
                                <span className="line-clamp-1">{course.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell>{course.instructor?.name}</TableCell>
                            <TableCell>
                              {course.isFree ? (
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  {t('courses.free')}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-umuco-secondary text-umuco-secondary">
                                  ${course.price}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{course.studentsCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  {t('dashboard.view')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    {t('dashboard.exportData')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Forum Tab */}
            <TabsContent value="forum">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle>
                      {t('dashboard.forumManagement')}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('dashboard.searchDiscussions')}
                        className="max-w-xs"
                        value={forumSearchQuery}
                        onChange={(e) => setForumSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingForumPosts ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-umuco-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('dashboard.topic')}</TableHead>
                          <TableHead>{t('dashboard.author')}</TableHead>
                          <TableHead>{t('dashboard.category')}</TableHead>
                          <TableHead>{t('dashboard.datePosted')}</TableHead>
                          <TableHead>{t('dashboard.views')}</TableHead>
                          <TableHead>{t('dashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredForumPosts.map((post) => (
                          <TableRow key={post._id}>
                            <TableCell className="font-medium">
                              {post.title}
                            </TableCell>
                            <TableCell>{post.author.name}</TableCell>
                            <TableCell>{post.category}</TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell>{post.views}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  {t('dashboard.view')}
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleOpenDeletePostDialog(post._id)}
                                >
                                  {t('dashboard.remove')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    {t('dashboard.exportData')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.platformAnalytics')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.analyticsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      {t('dashboard.analyticsPlaceholder')}
                      <br />
                      <span className="text-sm">
                        (Recharts implementation will go here)
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Dialog for changing user role */}
      <AlertDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.changeUserRole')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.changeRoleDescription')} <strong>{selectedUser?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select
              value={newRole}
              onValueChange={(value: 'student' | 'mentor' | 'admin') => setNewRole(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog for deleting forum post */}
      <AlertDialog open={deletePostDialogOpen} onOpenChange={setDeletePostDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.confirmDeletePost')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.confirmDeletePostDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
