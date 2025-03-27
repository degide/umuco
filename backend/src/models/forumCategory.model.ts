
import mongoose, { Document, Schema } from 'mongoose';

export interface IForumCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const forumCategorySchema = new Schema<IForumCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ForumCategory = mongoose.model<IForumCategory>('ForumCategory', forumCategorySchema);

export default ForumCategory;
