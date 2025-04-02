
import { Request, Response } from 'express';
import Enrollment from '../models/enrollment.model';
import Course from '../models/course.model';
import { AppError } from '../middleware/error.middleware';
import mongoose from 'mongoose';

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
export const enrollInCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, paymentId } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });
    
    if (existingEnrollment) {
      res.status(201).json(existingEnrollment);
      return;
    }
    
    // Create initial progress array with all lessons
    const progress = course.lessons.map((lesson) => ({
      lessonId: lesson._id,
      completed: false,
      lastAccessed: new Date(),
    }));
    
    // Create enrollment
    const enrollment = new Enrollment({
      user: req.user.id,
      course: courseId,
      progress,
      paymentId,
    });
    
    const createdEnrollment = await enrollment.save();
    
    // Increment enrolled count
    course.enrolledCount += 1;
    await course.save();
    
    res.status(201).json(createdEnrollment);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get all enrollments for a user
// @route   GET /api/enrollments
// @access  Private
export const getUserEnrollments = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({
        path: 'course',
        select: 'title thumbnail category level duration rating instructor',
        populate: {
          path: 'instructor',
          select: 'name avatar',
        },
      });
      
    res.json(enrollments);
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
export const getEnrollmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name avatar bio',
        },
      });
      
    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }
    
    // Check if user is enrolled or is instructor/admin
    if (
      enrollment.user.toString() !== req.user.id &&
        (enrollment.course as any).instructor._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to access this enrollment');
    }
    
    res.json(enrollment);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
export const updateLessonProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lessonId, completed } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }
    
    // Check if user is enrolled
    if (enrollment.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this enrollment');
    }
    
    // Find the lesson in progress array
    const lessonIndex = enrollment.progress.findIndex(
      (p) => p.lessonId.toString() === lessonId
    );
    
    if (lessonIndex === -1) {
      res.status(404);
      throw new Error('Lesson not found in this course');
    }
    
    // Update progress
    enrollment.progress[lessonIndex].completed = completed;
    enrollment.progress[lessonIndex].lastAccessed = new Date();
    
    // Check if all lessons are completed
    const allCompleted = enrollment.progress.every((p) => p.completed);
    if (allCompleted) {
      enrollment.completed = true;
    }
    
    const updatedEnrollment = await enrollment.save();
    
    res.json(updatedEnrollment);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get course completion statistics for instructor
// @route   GET /api/enrollments/stats/instructor
// @access  Private/Mentor
export const getInstructorStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    // Get all courses by instructor
    const courses = await Course.find({ instructor: req.user.id }).select('_id');
    const courseIds = courses.map((course) => course._id);
    
    // Get enrollments for these courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });
    
    // Calculate stats
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.completed).length;
    const completionRate = totalEnrollments > 0 
      ? (completedEnrollments / totalEnrollments) * 100 
      : 0;
    
    // Get completion stats per course
    const enrollmentsByCourse = await Enrollment.aggregate([
      {
        $match: {
          course: { $in: courseIds.map(id => new mongoose.Types.ObjectId((id as any).toString())) },
        },
      },
      {
        $group: {
          _id: '$course',
          totalEnrollments: { $sum: 1 },
          completedEnrollments: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo',
        },
      },
      {
        $unwind: '$courseInfo',
      },
      {
        $project: {
          _id: 1,
          courseTitle: '$courseInfo.title',
          totalEnrollments: 1,
          completedEnrollments: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedEnrollments', { $max: ['$totalEnrollments', 1] }] },
              100,
            ],
          },
        },
      },
    ]);
    
    res.json({
      totalEnrollments,
      completedEnrollments,
      completionRate,
      courseStats: enrollmentsByCourse,
    });
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};
