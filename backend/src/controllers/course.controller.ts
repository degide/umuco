
import { Request, Response } from 'express';
import Course from '../models/course.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { AppError } from '../middleware/error.middleware';
import fs from 'fs';
import mongoose from 'mongoose';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.level) {
      filter.level = req.query.level;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const totalCourses = await Course.countDocuments(filter);
    
    res.json({
      courses,
      page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses,
    });
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('reviews.user', 'name avatar');
      
    if (course) {
      res.json(course);
    } else {
      res.status(404);
      throw new Error('Course not found');
    }
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Mentor/Admin
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      price, 
      category, 
      level, 
      duration, 
      lessons 
    } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const course = new Course({
      title,
      description,
      price,
      instructor: req.user.id,
      category,
      level,
      duration,
      lessons: lessons || [],
    });
    
    const createdCourse = await course.save();
    
    res.status(201).json(createdCourse);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Mentor/Admin
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      price, 
      category, 
      level, 
      duration, 
      lessons 
    } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if user is course instructor or admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this course');
    }
    
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = category || course.category;
    course.level = level || course.level;
    course.duration = duration || course.duration;
    
    if (lessons) {
      course.lessons = lessons;
    }
    
    const updatedCourse = await course.save();
    
    res.json(updatedCourse);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Upload course thumbnail
// @route   POST /api/courses/:id/thumbnail
// @access  Private/Mentor/Admin
export const uploadCourseThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if user is course instructor or admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this course');
    }
    
    // Delete old thumbnail if exists
    if (course.cloudinaryId) {
      await deleteFromCloudinary(course.cloudinaryId);
    }
    
    // Upload new thumbnail
    const result = await uploadToCloudinary(req.file.path, 'umuco/courses');
    
    // Update course thumbnail
    course.thumbnail = result.secure_url;
    course.cloudinaryId = result.public_id;
    
    await course.save();
    
    // Delete file from server
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      thumbnail: result.secure_url,
      cloudinaryId: result.public_id,
    });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Mentor/Admin
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if user is course instructor or admin
    if (
      course.instructor.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this course');
    }
    
    // Delete thumbnail from cloudinary if exists
    if (course.cloudinaryId) {
      await deleteFromCloudinary(course.cloudinaryId);
    }
    
    await course.deleteOne();
    
    res.json({ message: 'Course removed' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Create new review
// @route   POST /api/courses/:id/reviews
// @access  Private
export const createCourseReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    // Check if user already reviewed
    const alreadyReviewed = course.reviews.find(
      (r) => r.user.toString() === req.user!.id
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Course already reviewed');
    }
    
    const review = {
      user: new mongoose.Types.ObjectId(req.user.id),
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };
    
    course.reviews.push(review);
    
    await course.save();
    
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};
