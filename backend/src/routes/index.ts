
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import courseRoutes from './course.routes';
import enrollmentRoutes from './enrollment.routes';
import forumRoutes from './forum.routes';
import healthRoutes from './health.routes';
import courseCategoryRoutes from './courseCategory.routes';
import forumCategoryRoutes from './forumCategory.routes';
import eventRoutes from './event.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/forum', forumRoutes);
router.use('/course-categories', courseCategoryRoutes);
router.use('/forum-categories', forumCategoryRoutes);
router.use('/events', eventRoutes);
router.use('/notifications', notificationRoutes);
router.use('/health', healthRoutes);

export default router;
