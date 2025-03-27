
import { Router } from 'express';
import { 
  getForumPosts,
  getForumPostById,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  addComment,
  likePost
} from '../controllers/forum.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /forum:
 *   get:
 *     summary: Get all forum posts
 *     tags: [Forums]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term in title or content
 *     responses:
 *       200:
 *         description: List of forum posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ForumPost'
 *                 page:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalPosts:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get('/', getForumPosts);

/**
 * @swagger
 * /forum/{id}:
 *   get:
 *     summary: Get forum post by ID
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum post ID
 *     responses:
 *       200:
 *         description: Forum post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumPost'
 *       404:
 *         description: Forum post not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getForumPostById);

/**
 * @swagger
 * /forum:
 *   post:
 *     summary: Create a new forum post
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created forum post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumPost'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, createForumPost);

/**
 * @swagger
 * /forum/{id}:
 *   put:
 *     summary: Update a forum post
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated forum post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForumPost'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not authorized to update this post
 *       404:
 *         description: Forum post not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, updateForumPost);

/**
 * @swagger
 * /forum/{id}:
 *   delete:
 *     summary: Delete a forum post
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum post ID
 *     responses:
 *       200:
 *         description: Forum post removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not authorized to delete this post
 *       404:
 *         description: Forum post not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, deleteForumPost);

/**
 * @swagger
 * /forum/{id}/comments:
 *   post:
 *     summary: Add a comment to a forum post
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Forum post not found
 *       500:
 *         description: Server error
 */
router.post('/:id/comments', protect, addComment);

/**
 * @swagger
 * /forum/{id}/like:
 *   post:
 *     summary: Like or unlike a forum post
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Forum post ID
 *     responses:
 *       200:
 *         description: Like status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                 likeCount:
 *                   type: number
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Forum post not found
 *       500:
 *         description: Server error
 */
router.post('/:id/like', protect, likePost);

export default router;
