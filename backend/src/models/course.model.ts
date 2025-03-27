
import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  instructor: mongoose.Types.ObjectId;
  thumbnail?: string;
  cloudinaryId?: string;
  category: string;
  level: string;
  duration: number;
  lessons: {
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
  }[];
  enrolledCount: number;
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
    },
    cloudinaryId: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    level: {
      type: String,
      required: [true, 'Please add a level'],
    },
    duration: {
      type: Number,
      required: [true, 'Please add a duration'],
    },
    lessons: [
      {
        title: {
          type: String,
          required: [true, 'Please add a lesson title'],
        },
        content: {
          type: String,
          required: [true, 'Please add lesson content'],
        },
        videoUrl: {
          type: String,
        },
        duration: {
          type: Number,
          required: [true, 'Please add lesson duration'],
        },
        order: {
          type: Number,
          required: [true, 'Please add lesson order'],
        },
      },
    ],
    enrolledCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate average rating before saving
courseSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
  }
  next();
});

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
