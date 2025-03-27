
import { Request, Response } from 'express';
import ForumCategory from '../models/forumCategory.model';
import { AppError } from '../middleware/error.middleware';

// @desc    Get all forum categories
// @route   GET /api/forum-categories
// @access  Public
export const getForumCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await ForumCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Create a forum category
// @route   POST /api/forum-categories
// @access  Private/Admin
export const createForumCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    const existingCategory = await ForumCategory.findOne({ name });
    if (existingCategory) {
      res.status(400);
      throw new Error('Category already exists');
    }
    
    const category = new ForumCategory({
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

// @desc    Update a forum category
// @route   PUT /api/forum-categories/:id
// @access  Private/Admin
export const updateForumCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    const category = await ForumCategory.findById(req.params.id);
    
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    
    if (name && name !== category.name) {
      const existingCategory = await ForumCategory.findOne({ name });
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

// @desc    Delete a forum category
// @route   DELETE /api/forum-categories/:id
// @access  Private/Admin
export const deleteForumCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await ForumCategory.findById(req.params.id);
    
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
