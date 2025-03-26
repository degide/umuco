
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Book, Plus, PlusCircle, Edit, Trash2, Info, DollarSign, Layers, Users, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CourseForm from '@/components/courses/CourseForm';
import { useCourses } from '@/hooks/useCourses';

const MentorDashboard = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-umuco-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || user?.role !== 'mentor') {
    return <Navigate to="/login" />;
  }

  const handleCreateCourse = (courseData) => {
    addCourse({
      ...courseData,
      instructor: {
        name: user?.name,
        avatarUrl: user?.avatar || 'https://i.pravatar.cc/150?img=5',
      },
      id: `course_${Date.now()}`,
      studentsCount: 0,
      rating: 0,
    });
    
    setIsCreateDialogOpen(false);
    toast({
      title: "Course created",
      description: "Your course has been created successfully.",
    });
  };

  const handleEditCourse = (courseData) => {
    updateCourse({
      ...selectedCourse,
      ...courseData,
    });
    
    setSelectedCourse(null);
    toast({
      title: "Course updated",
      description: "Your course has been updated successfully.",
    });
  };

  const handleDeleteCourse = (courseId) => {
    deleteCourse(courseId);
    
    toast({
      title: "Course deleted",
      description: "Your course has been deleted successfully.",
    });
  };

  const mentorCourses = courses.filter(
    (course) => course.instructor?.name === user?.name
  );
  
  // Calculate earnings
  const calculateTotalEarnings = () => {
    return mentorCourses.reduce((total, course) => {
      if (!course.isFree) {
        // Assume each enrollment is a sale for paid courses
        return total + (course.price || 0) * (course.studentsCount || 0);
      }
      return total;
    }, 0);
  };
  
  // Calculate monthly earnings (mock data)
  const calculateMonthlyEarnings = () => {
    return Math.round(calculateTotalEarnings() * 0.2); // 20% of total as this month's earnings
  };
  
  // Count published courses
  const publishedCoursesCount = mentorCourses.length;
  
  // Count total students
  const totalStudentsCount = mentorCourses.reduce(
    (total, course) => total + (course.studentsCount || 0), 
    0
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.mentorDashboard')}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                {t('dashboard.welcomeMessage')}, {user?.name}!
              </p>
            </div>
            
            <Button 
              className="mt-4 md:mt-0" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('courses.createCourse')}
            </Button>
          </div>
          
          {/* Dashboard Summary Cards */}
          <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('courses.totalEarnings')}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${calculateTotalEarnings().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.earningsOverview')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('courses.earningsThisMonth')}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${calculateMonthlyEarnings().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.revenue')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('courses.publishedCourses')}
                </CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedCoursesCount}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.courseStats')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('courses.enrolledStudents')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudentsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.totalStudents')}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="my-courses">
            <TabsList className="mb-8">
              <TabsTrigger value="my-courses">{t('courses.myCourses')}</TabsTrigger>
              <TabsTrigger value="stats">{t('dashboard.stats')}</TabsTrigger>
              <TabsTrigger value="earnings">{t('dashboard.earnings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-courses">
              {mentorCourses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                    <Book className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      {t('courses.noCourses')}
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t('courses.createFirst')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mentorCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={course.imageUrl || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80'}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {course.isFree ? (
                            <Badge variant="secondary" className="bg-green-500">
                              {t('courses.free')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-umuco-secondary">
                              ${course.price}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="flex justify-between">
                          <span>{course.category}</span>
                          <span>{course.level}</span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{course.studentsCount} {t('courses.students')}</span>
                          </div>
                          
                          {!course.isFree && (
                            <div className="flex items-center text-sm font-medium text-umuco-primary dark:text-umuco-tertiary">
                              <DollarSign className="mr-1 h-4 w-4" />
                              <span>${(course.price || 0) * (course.studentsCount || 0)}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="line-clamp-2 text-gray-600 dark:text-gray-400">
                          {course.description.replace(/<[^>]*>/g, '')}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t('courses.edit')}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('courses.delete')}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.courseStats')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.statsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {t('dashboard.totalCourses')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {mentorCourses.length}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {t('dashboard.totalStudents')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalStudentsCount}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {t('dashboard.averageRating')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {mentorCourses.length > 0
                            ? (
                                mentorCourses.reduce(
                                  (total, course) => total + (course.rating || 0),
                                  0
                                ) / mentorCourses.length
                              ).toFixed(1)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.earningsOverview')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.revenueDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {t('dashboard.paymentHistory')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mentorCourses
                            .filter(course => !course.isFree && course.studentsCount > 0)
                            .map((course) => (
                              <div key={course.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="h-10 w-10 rounded-full overflow-hidden">
                                    <img 
                                      src={course.imageUrl} 
                                      alt={course.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {course.studentsCount} enrollments at ${course.price}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-medium">${(course.price || 0) * (course.studentsCount || 0)}</p>
                              </div>
                            ))}
                          
                          {mentorCourses.filter(course => !course.isFree && course.studentsCount > 0).length === 0 && (
                            <p className="text-center text-muted-foreground py-6">
                              No payment history yet
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('courses.createCourse')}</DialogTitle>
            <DialogDescription>
              {t('courses.createCourseDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <CourseForm onSubmit={handleCreateCourse} />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Course Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('courses.editCourse')}</DialogTitle>
            <DialogDescription>
              {t('courses.editCourseDescription')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <CourseForm 
              initialData={selectedCourse} 
              onSubmit={handleEditCourse} 
            />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default MentorDashboard;
