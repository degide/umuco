
import { Router } from 'express';
import { 
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markNotificationRead);
router.put('/read-all', protect, markAllNotificationsRead);
router.delete('/:id', protect, deleteNotification);

export default router;
