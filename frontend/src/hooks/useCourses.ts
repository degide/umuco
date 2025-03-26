import { useState, useEffect } from 'react';
import { Course } from '@/components/courses/CourseCard';

// Mock courses data with sections
const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to Swahili Language',
    description: 'Learn the basics of Swahili, one of the most widely spoken languages in Africa.',
    imageUrl: 'https://images.unsplash.com/photo-1528459199957-0ff28496a7f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=824&q=80',
    category: 'Languages',
    level: 'Beginner',
    duration: '6 weeks',
    instructor: {
      name: 'Sarah Odhiambo',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    isFree: true,
    rating: 4.7,
    studentsCount: 1245,
    sections: [
      {
        title: 'Introduction to Swahili',
        subtitle: 'Understanding the basics',
        content: 'Swahili, also known as Kiswahili, is a Bantu language that serves as a lingua franca in much of East Africa. It is the national language of Kenya and Tanzania, and is widely spoken in Uganda, Rwanda, Burundi, and the eastern part of the Democratic Republic of Congo. In this section, we will learn about the origins of Swahili and its importance in African culture.',
        videoUrl: 'https://www.youtube.com/watch?v=mWNLvr9wMW0'
      },
      {
        title: 'Basic Greetings and Introductions',
        subtitle: 'Making a good first impression',
        content: 'Learning how to greet people and introduce yourself is essential when starting to learn any language. In this section, we will cover common Swahili greetings for different times of day, and how to introduce yourself and ask basic questions about others.',
        videoUrl: 'https://www.youtube.com/watch?v=OKhXOi0iiM0'
      },
      {
        title: 'Essential Vocabulary',
        subtitle: 'Building your word bank',
        content: 'To begin communicating in Swahili, you need to build a foundation of essential vocabulary. This section will introduce you to common nouns, verbs, and adjectives that are frequently used in everyday conversations.',
        videoUrl: 'https://www.youtube.com/watch?v=1U3VYgRnU5I'
      }
    ]
  },
  {
    id: '2',
    title: 'Traditional African Drumming',
    description: 'Explore the rich rhythmic traditions of West African drumming and its cultural significance.',
    imageUrl: 'https://images.unsplash.com/photo-1516685304081-de7947d419d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Music',
    level: 'Intermediate',
    duration: '8 weeks',
    instructor: {
      name: 'Kwame Mensah',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
    isFree: false,
    price: 49.99,
    rating: 4.9,
    studentsCount: 872,
    sections: [
      {
        title: 'Introduction to African Drumming',
        subtitle: 'Cultural context and significance',
        content: 'African drumming traditions are integral to the cultural heritage of many African societies. In this section, we will explore the historical and cultural significance of drumming across different regions of Africa, and understand how drumming functions as both a form of communication and a means of cultural expression.',
        videoUrl: 'https://www.youtube.com/watch?v=Q-Y7oKVdO-o'
      },
      {
        title: 'Djembe Basics',
        subtitle: 'Getting started with the most popular African drum',
        content: 'The djembe is one of the most recognized African drums worldwide. In this section, we will learn about the construction of the djembe, the different sounds it can produce, and basic hand techniques for playing this versatile instrument.',
        videoUrl: 'https://www.youtube.com/watch?v=IZ_W5nPWTZQ'
      }
    ]
  },
  {
    id: '3',
    title: 'East African Cuisine',
    description: 'Learn to prepare delicious dishes from Kenya, Tanzania, and Uganda with authentic ingredients and techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80',
    category: 'Cuisine',
    level: 'Beginner',
    duration: '4 weeks',
    instructor: {
      name: 'Amina Hassan',
      avatarUrl: 'https://i.pravatar.cc/150?img=10',
    },
    isFree: false,
    price: 39.99,
    rating: 4.5,
    studentsCount: 634,
  },
  {
    id: '4',
    title: 'African Mythology and Storytelling',
    description: 'Discover the ancient myths, legends, and storytelling traditions from across the African continent.',
    imageUrl: 'https://images.unsplash.com/photo-1616667664034-c947c1e2cf29?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Literature',
    level: 'Intermediate',
    duration: '10 weeks',
    instructor: {
      name: 'Chinua Achebe',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    isFree: true,
    rating: 4.8,
    studentsCount: 1893,
  },
  {
    id: '5',
    title: 'Contemporary African Art',
    description: 'Explore the vibrant world of modern African art and its influence on global artistic movements.',
    imageUrl: 'https://images.unsplash.com/photo-1524414621493-7dec026782c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Art',
    level: 'Advanced',
    duration: '12 weeks',
    instructor: {
      name: 'Ezra Wangari',
      avatarUrl: 'https://i.pravatar.cc/150?img=15',
    },
    isFree: false,
    price: 59.99,
    rating: 4.6,
    studentsCount: 427,
  },
  {
    id: '6',
    title: 'Traditional African Textiles',
    description: 'Learn about the diverse fabric traditions and textile techniques from different African regions.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1701205420783-29caf70c5364?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Crafts',
    level: 'Beginner',
    duration: '6 weeks',
    instructor: {
      name: 'Grace Ndlovu',
      avatarUrl: 'https://i.pravatar.cc/150?img=23',
    },
    isFree: false,
    price: 44.99,
    rating: 4.3,
    studentsCount: 521,
  },
];

export const useCourses = () => {
  // Load courses from local storage or use initial data
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('umuco_courses');
    return savedCourses ? JSON.parse(savedCourses) : INITIAL_COURSES;
  });

  // Update local storage when courses change
  useEffect(() => {
    localStorage.setItem('umuco_courses', JSON.stringify(courses));
  }, [courses]);

  // Add a new course
  const addCourse = (course: Course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
  };

  // Update an existing course
  const updateCourse = (updatedCourse: Course) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  // Delete a course
  const deleteCourse = (courseId: string) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );
  };

  // Enroll in a course
  const enrollInCourse = (courseId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              enrolled: true,
              progress: course.progress || 0,
              studentsCount: (course.studentsCount || 0) + 1,
            }
          : course
      )
    );
  };

  // Update course progress
  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              progress,
            }
          : course
      )
    );
  };

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    updateCourseProgress,
  };
};
