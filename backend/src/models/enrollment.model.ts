
import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  progress: {
    lessonId: mongoose.Types.ObjectId;
    completed: boolean;
    lastAccessed: Date;
  }[];
  completed: boolean;
  certificateIssued: boolean;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: [
      {
        lessonId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        lastAccessed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only enroll in a course once
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);

export default Enrollment;
