
import { Request, Response } from 'express';
import Notification from '../models/notification.model';
import { AppError } from '../middleware/error.middleware';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalNotifications = await Notification.countDocuments({ user: req.user.id });
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });
    
    res.json({
      notifications,
      unreadCount,
      totalNotifications,
      page,
      totalPages: Math.ceil(totalNotifications / limit),
    });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    
    // Check if notification belongs to user
    if (notification.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this notification');
    }
    
    notification.read = true;
    await notification.save();
    
    res.json({ success: true });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );
    
    res.json({ success: true });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    
    // Check if notification belongs to user
    if (notification.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this notification');
    }
    
    await notification.deleteOne();
    
    res.json({ success: true });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};
