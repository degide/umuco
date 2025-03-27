
import { Request, Response } from 'express';
import Event from '../models/event.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { AppError } from '../middleware/error.middleware';
import fs from 'fs';
import mongoose from 'mongoose';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
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
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    // Only get upcoming events
    if (req.query.upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    
    const events = await Event.find(filter)
      .populate('organizer', 'name avatar')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });
      
    const totalEvents = await Event.countDocuments(filter);
    
    res.json({
      events,
      page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (error) {
    const err = error as AppError;
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar bio')
      .populate('attendees', 'name avatar');
      
    if (event) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Mentor/Admin
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      date, 
      duration, 
      category,
      location,
      isOnline,
      meetingLink
    } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const event = new Event({
      title,
      description,
      date,
      duration,
      organizer: req.user.id,
      category,
      location,
      isOnline: isOnline || true,
      meetingLink,
      attendees: [req.user.id], // Organizer is automatically an attendee
    });
    
    const createdEvent = await event.save();
    
    // Notify students about the new event
    const students = await User.find({ role: 'student' });
    
    const notifications = students.map(student => ({
      user: student._id,
      title: 'New Event',
      message: `A new event "${title}" has been created.`,
      type: 'event',
      relatedId: createdEvent._id,
    }));
    
    await Notification.insertMany(notifications);
    
    res.status(201).json(createdEvent);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Mentor/Admin
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      date, 
      duration, 
      category,
      location,
      isOnline,
      meetingLink
    } = req.body;
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    
    // Check if user is event organizer or admin
    if (
      event.organizer.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this event');
    }
    
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date ? new Date(date) : event.date;
    event.duration = duration || event.duration;
    event.category = category || event.category;
    event.location = location !== undefined ? location : event.location;
    event.isOnline = isOnline !== undefined ? isOnline : event.isOnline;
    event.meetingLink = meetingLink !== undefined ? meetingLink : event.meetingLink;
    
    const updatedEvent = await event.save();
    
    // Notify attendees about the event update
    const notifications = event.attendees.map(attendeeId => ({
      user: attendeeId,
      title: 'Event Updated',
      message: `The event "${event.title}" has been updated.`,
      type: 'event',
      relatedId: event._id,
    }));
    
    await Notification.insertMany(notifications);
    
    res.json(updatedEvent);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Upload event thumbnail
// @route   POST /api/events/:id/thumbnail
// @access  Private/Mentor/Admin
export const uploadEventThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    
    // Check if user is event organizer or admin
    if (
      event.organizer.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this event');
    }
    
    // Delete old thumbnail if exists
    if (event.cloudinaryId) {
      await deleteFromCloudinary(event.cloudinaryId);
    }
    
    // Upload new thumbnail
    const result = await uploadToCloudinary(req.file.path, 'umuco/events');
    
    // Update event thumbnail
    event.thumbnail = result.secure_url;
    event.cloudinaryId = result.public_id;
    
    await event.save();
    
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

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Mentor/Admin
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    
    // Check if user is event organizer or admin
    if (
      event.organizer.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this event');
    }
    
    // Delete thumbnail from cloudinary if exists
    if (event.cloudinaryId) {
      await deleteFromCloudinary(event.cloudinaryId);
    }
    
    await event.deleteOne();
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    
    // Check if user is already registered
    const alreadyRegistered = event.attendees.some(
      attendee => attendee.toString() === req.user!.id
    );
    
    if (alreadyRegistered) {
      res.status(400);
      throw new Error('Already registered for this event');
    }
    
    // Add user to attendees
    event.attendees.push(new mongoose.Types.ObjectId(req.user.id));
    
    await event.save();
    
    // Create notification for event organizer
    const user = await User.findById(req.user.id);
    
    await Notification.create({
      user: event.organizer,
      title: 'New Event Registration',
      message: `${user!.name} has registered for your event "${event.title}".`,
      type: 'event',
      relatedId: event._id,
    });
    
    res.status(201).json({ message: 'Successfully registered for event' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Unregister from an event
// @route   DELETE /api/events/:id/register
// @access  Private
export const unregisterFromEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    
    // Check if event has already passed
    if (new Date(event.date) < new Date()) {
      res.status(400);
      throw new Error('Cannot unregister from past events');
    }
    
    // Check if user is registered
    const isRegistered = event.attendees.some(
      attendee => attendee.toString() === req.user!.id
    );
    
    if (!isRegistered) {
      res.status(400);
      throw new Error('Not registered for this event');
    }
    
    // Remove user from attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.user!.id
    );
    
    await event.save();
    
    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get user's registered events
// @route   GET /api/events/my-events
// @access  Private
export const getUserEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    const events = await Event.find({ attendees: req.user.id })
      .populate('organizer', 'name avatar')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};

// @desc    Get events organized by user
// @route   GET /api/events/organized
// @access  Private/Mentor/Admin
export const getOrganizedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const events = await Event.find({ organizer: req.user.id })
      .populate('attendees', 'name avatar')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    const err = error as AppError;
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
};
