
import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI

  try {
    if(!MONGO_URI) return;
    const conn = await mongoose.connect(MONGO_URI, {
      autoCreate: true,
      autoIndex: true,
      tls: false
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Mongo ERROR: ${error.message}`);
    } else {
      logger.error('Unknown error connecting to database');
    }
    process.exit(1);
  }
};

export default connectDB;
