
import React from 'react';
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
import { useCourses } from '@/hooks/useCourses';

// Mock users for admin dashboard
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    status: 'active',
    joinDate: '2023-06-15',
    coursesEnrolled: 3,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'mentor',
    status: 'active',
    joinDate: '2023-05-10',
    coursesCreated: 5,
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-04-01',
  },
  {
    id: '4',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'student',
    status: 'inactive',
    joinDate: '2023-07-20',
    coursesEnrolled: 1,
  },
  {
    id: '5',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'mentor',
    status: 'active',
    joinDate: '2023-06-05',
    coursesCreated: 2,
  },
];

// Mock forum posts for admin dashboard
const MOCK_FORUM_POSTS = [
  {
    id: '1',
    title: 'Question about East African languages',
    author: 'John Doe',
    category: 'Languages',
    status: 'active',
    postDate: '2023-08-10',
    repliesCount: 12,
  },
  {
    id: '2',
    title: 'Traditional cooking techniques discussion',
    author: 'Sarah Williams',
    category: 'Cuisine',
    status: 'active',
    postDate: '2023-08-05',
    repliesCount: 8,
  },
  {
    id: '3',
    title: 'Looking for African literature recommendations',
    author: 'Michael Johnson',
    category: 'Literature',
    status: 'flagged',
    postDate: '2023-08-15',
    repliesCount: 5,
  },
  {
    id: '4',
    title: 'Cultural adaptations in modern contexts',
    author: 'Jane Smith',
    category: 'History',
    status: 'active',
    postDate: '2023-08-12',
    repliesCount: 15,
  },
  {
    id: '5',
    title: 'Traditional vs modern wedding ceremonies in Kenya',
    author: 'John Doe',
    category: 'Culture',
    status: 'active',
    postDate: '2023-08-08',
    repliesCount: 20,
  },
];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { courses } = useCourses();
  
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
  
  // Stats calculations
  const totalStudents = MOCK_USERS.filter(user => user.role === 'student').length;
  const totalMentors = MOCK_USERS.filter(user => user.role === 'mentor').length;
  const totalCourses = courses.length;
  const totalForumPosts = MOCK_FORUM_POSTS.length;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                    {totalStudents}
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
                    {totalMentors}
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
                    {totalCourses}
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
                    {totalForumPosts}
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
                      />
                      <Button variant="outline" size="icon">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('dashboard.userName')}</TableHead>
                        <TableHead>{t('dashboard.email')}</TableHead>
                        <TableHead>{t('dashboard.role')}</TableHead>
                        <TableHead>{t('dashboard.status')}</TableHead>
                        <TableHead>{t('dashboard.joinDate')}</TableHead>
                        <TableHead>{t('dashboard.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_USERS.map((user) => (
                        <TableRow key={user.id}>
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
                          <TableCell>
                            <Badge
                              variant={user.status === 'active' ? 'default' : 'secondary'}
                              className={
                                user.status === 'active'
                                  ? 'bg-green-500'
                                  : 'bg-gray-500'
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.joinDate)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                {t('dashboard.edit')}
                              </Button>
                              {user.role !== 'admin' && (
                                <Button variant="destructive" size="sm">
                                  {t('dashboard.suspend')}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    {t('dashboard.exportData')}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      {t('dashboard.previous')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('dashboard.next')}
                    </Button>
                  </div>
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
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                      {courses.map((course) => (
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
                              <Button variant="destructive" size="sm">
                                {t('dashboard.remove')}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    {t('dashboard.exportData')}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      {t('dashboard.previous')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('dashboard.next')}
                    </Button>
                  </div>
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
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('dashboard.topic')}</TableHead>
                        <TableHead>{t('dashboard.author')}</TableHead>
                        <TableHead>{t('dashboard.category')}</TableHead>
                        <TableHead>{t('dashboard.status')}</TableHead>
                        <TableHead>{t('dashboard.datePosted')}</TableHead>
                        <TableHead>{t('dashboard.replies')}</TableHead>
                        <TableHead>{t('dashboard.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_FORUM_POSTS.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            {post.title}
                          </TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell>
                            <Badge
                              variant={post.status === 'active' ? 'default' : 'secondary'}
                              className={
                                post.status === 'active'
                                  ? 'bg-green-500'
                                  : post.status === 'flagged'
                                  ? 'bg-amber-500'
                                  : 'bg-gray-500'
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(post.postDate)}</TableCell>
                          <TableCell>{post.repliesCount}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                {t('dashboard.view')}
                              </Button>
                              {post.status === 'flagged' ? (
                                <Button variant="outline" size="sm">
                                  {t('dashboard.approve')}
                                </Button>
                              ) : (
                                <Button variant="destructive" size="sm">
                                  {t('dashboard.remove')}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    {t('dashboard.exportData')}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      {t('dashboard.previous')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('dashboard.next')}
                    </Button>
                  </div>
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
      <Footer />
    </>
  );
};

export default AdminDashboard;
