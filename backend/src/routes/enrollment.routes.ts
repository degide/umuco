
import { Router } from 'express';
import { 
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentById,
  updateLessonProgress,
  getInstructorStats
} from '../controllers/enrollment.controller';
import { protect, mentorOrAdminOnly } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID of the course to enroll in
 *               paymentId:
 *                 type: string
 *                 description: Payment reference ID (optional)
 *     responses:
 *       201:
 *         description: Successfully enrolled in course
 *       400:
 *         description: Already enrolled or invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/', protect, enrollInCourse);

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get all enrollments for the current user
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's enrollments
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, getUserEnrollments);

/**
 * @swagger
 * /enrollments/stats/instructor:
 *   get:
 *     summary: Get course completion statistics for instructor
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEnrollments:
 *                   type: number
 *                 completedEnrollments:
 *                   type: number
 *                 completionRate:
 *                   type: number
 *                 courseStats:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Mentor or admin access required
 *       500:
 *         description: Server error
 */
router.get('/stats/instructor', protect, mentorOrAdminOnly, getInstructorStats);

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment details
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not authorized to access this enrollment
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getEnrollmentById);

/**
 * @swagger
 * /enrollments/{id}/progress:
 *   put:
 *     summary: Update lesson progress
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *               - completed
 *             properties:
 *               lessonId:
 *                 type: string
 *                 description: ID of the lesson
 *               completed:
 *                 type: boolean
 *                 description: Completion status
 *     responses:
 *       200:
 *         description: Updated enrollment
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not authorized to update this enrollment
 *       404:
 *         description: Enrollment or lesson not found
 *       500:
 *         description: Server error
 */
router.put('/:id/progress', protect, updateLessonProgress);

export default router;
