
import mongoose, { Document, Schema } from 'mongoose';
import User from "./user.model"

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  organizer: mongoose.Types.ObjectId;
  category: string;
  thumbnail?: string;
  cloudinaryId?: string;
  attendees: mongoose.Types.ObjectId[];
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EventCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - duration
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         category:
 *           type: string
 *         isOnline:
 *           type: boolean
 *           default: true
 *         location:
 *           type: string
 *           description: Required if not online
 *         meetingLink:
 *           type: string
 *           description: Required if online
 */

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Event duration is required'],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
    },
    thumbnail: {
      type: String,
    },
    cloudinaryId: {
      type: String,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: User,
      },
    ],
    location: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    meetingLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
