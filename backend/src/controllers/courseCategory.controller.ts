
import { Request, Response } from 'express';
import CourseCategory from '../models/courseCategory.model';
import { AppError } from '../middleware/error.middleware';

// @desc    Get all course categories
// @route   GET /api/course-categories
// @access  Public
export const getCourseCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CourseCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Create a course category
// @route   POST /api/course-categories
// @access  Private/Admin
export const createCourseCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    const existingCategory = await CourseCategory.findOne({ name });
    if (existingCategory) {
      res.status(400);
      throw new Error('Category already exists');
    }
    
    const category = new CourseCategory({
      name,
      description,
    });
    
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Update a course category
// @route   PUT /api/course-categories/:id
// @access  Private/Admin
export const updateCourseCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    const category = await CourseCategory.findById(req.params.id);
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    
    if (name && name !== category.name) {
      const existingCategory = await CourseCategory.findOne({ name });
      if (existingCategory) {
        res.status(400);
        throw new Error('Category name already exists');
      }
    }
    
    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Delete a course category
// @route   DELETE /api/course-categories/:id
// @access  Private/Admin
export const deleteCourseCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await CourseCategory.findById(req.params.id);
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};
