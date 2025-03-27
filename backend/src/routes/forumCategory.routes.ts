
import { Router } from 'express';
import { 
  getForumCategories,
  createForumCategory,
  updateForumCategory,
  deleteForumCategory,
} from '../controllers/forumCategory.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /forum-categories:
 *   get:
 *     summary: Get all forum categories
 *     tags: [Forum Categories]
 *     responses:
 *       200:
 *         description: List of forum categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ForumCategory'
 *       500:
 *         description: Server error
 */
router.get('/', getForumCategories);

/**
 * @swagger
 * /forum-categories:
 *   post:
 *     summary: Create a new forum category
 *     tags: [Forum Categories]
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
 *         description: Created forum category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumCategory'
 *       400:
 *         description: Invalid input or category already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.post('/', protect, adminOnly, createForumCategory);

/**
 * @swagger
 * /forum-categories/{id}:
 *   put:
 *     summary: Update a forum category
 *     tags: [Forum Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum category ID
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
 *         description: Updated forum category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumCategory'
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
router.put('/:id', protect, adminOnly, updateForumCategory);

/**
 * @swagger
 * /forum-categories/{id}:
 *   delete:
 *     summary: Delete a forum category
 *     tags: [Forum Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum category ID
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
router.delete('/:id', protect, adminOnly, deleteForumCategory);

export default router;
