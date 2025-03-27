
import { Request, Response } from 'express';
import ForumPost from '../models/forumPost.model';
import { AppError } from '../middleware/error.middleware';
import mongoose from 'mongoose';

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
export const getForumPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    const posts = await ForumPost.find(filter)
      .populate('author', 'name avatar role').populate('comments.user', 'name avatar role')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const totalPosts = await ForumPost.countDocuments(filter);
    
    res.json({
      posts,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get forum post by ID
// @route   GET /api/forum/:id
// @access  Public
export const getForumPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name avatar role')
      .populate('comments.user', 'name avatar role');
      
    if (post) {
      // Increment view count
      post.views += 1;
      await post.save();
      
      res.json(post);
    } else {
      res.status(404);
      throw new Error('Forum post not found');
    }
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Create a forum post
// @route   POST /api/forum
// @access  Private
export const createForumPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const post = new ForumPost({
      title,
      content,
      category,
      author: req.user.id,
    });
    
    const createdPost = await post.save();
    
    res.status(201).json(createdPost);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Update a forum post
// @route   PUT /api/forum/:id
// @access  Private
export const updateForumPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      res.status(404);
      throw new Error('Forum post not found');
    }
    
    // Check if user is post author or admin
    if (
      post.author.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this post');
    }
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    
    const updatedPost = await post.save();
    
    res.json(updatedPost);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Delete a forum post
// @route   DELETE /api/forum/:id
// @access  Private
export const deleteForumPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      res.status(404);
      throw new Error('Forum post not found');
    }
    
    // Check if user is post author or admin
    if (
      post.author.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }
    
    await post.deleteOne();
    
    res.json({ message: 'Forum post removed' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Add comment to forum post
// @route   POST /api/forum/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      res.status(404);
      throw new Error('Forum post not found');
    }
    
    const comment = {
      user: new mongoose.Types.ObjectId(req.user.id),
      text,
      createdAt: new Date(),
    };
    
    post.comments.push(comment);
    
    await post.save();
    
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Like a forum post
// @route   POST /api/forum/:id/like
// @access  Private
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      res.status(404);
      throw new Error('Forum post not found');
    }
    
    // Check if already liked
    const alreadyLiked = post.likes.find(
      (like) => like.toString() === req.user!.id
    );
    
    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user!.id
      );
    } else {
      // Like
      post.likes.push(new mongoose.Types.ObjectId(req.user.id));
    }
    
    await post.save();
    
    res.json({ 
      liked: !alreadyLiked,
      likeCount: post.likes.length 
    });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};
