
import { Router } from 'express';
import { 
  getCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
} from '../controllers/courseCategory.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /course-categories:
 *   get:
 *     summary: Get all course categories
 *     tags: [Course Categories]
 *     responses:
 *       200:
 *         description: List of course categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseCategory'
 *       500:
 *         description: Server error
 */
router.get('/', getCourseCategories);

/**
 * @swagger
 * /course-categories:
 *   post:
 *     summary: Create a new course category
 *     tags: [Course Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created course category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseCategory'
 *       400:
 *         description: Invalid input or category already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.post('/', protect, adminOnly, createCourseCategory);

/**
 * @swagger
 * /course-categories/{id}:
 *   put:
 *     summary: Update a course category
 *     tags: [Course Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated course category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseCategory'
 *       400:
 *         description: Invalid input or category name already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, adminOnly, updateCourseCategory);

/**
 * @swagger
 * /course-categories/{id}:
 *   delete:
 *     summary: Delete a course category
 *     tags: [Course Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course category ID
 *     responses:
 *       200:
 *         description: Category removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, adminOnly, deleteCourseCategory);

export default router;
