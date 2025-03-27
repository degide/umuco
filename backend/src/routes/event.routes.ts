
import { Router } from 'express';
import multer from 'multer';
import { 
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  uploadEventThumbnail,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents,
  getOrganizedEvents
} from '../controllers/event.controller';
import { protect, mentorOrAdminOnly } from '../middleware/auth.middleware';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, '/tmp');
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
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
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Filter for upcoming events only
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 page:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalEvents:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get('/', getEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
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
 *               - description
 *               - date
 *               - duration
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: number
 *                 description: Duration in minutes
 *               category:
 *                 type: string
 *               isOnline:
 *                 type: boolean
 *                 default: true
 *               location:
 *                 type: string
 *                 description: Required if not online
 *               meetingLink:
 *                 type: string
 *                 description: Required if online
 *     responses:
 *       201:
 *         description: Created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Mentor or admin access required
 *       500:
 *         description: Server error
 */
router.post('/', protect, mentorOrAdminOnly, createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: number
 *               category:
 *                 type: string
 *               isOnline:
 *                 type: boolean
 *               location:
 *                 type: string
 *               meetingLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not authorized to update this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, mentorOrAdminOnly, updateEvent);

/**
 * @swagger
 * /events/{id}/thumbnail:
 *   post:
 *     summary: Upload event thumbnail
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not authorized to update this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post('/:id/thumbnail', protect, mentorOrAdminOnly, upload.single('thumbnail'), uploadEventThumbnail);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event removed
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
 *         description: Forbidden - Not authorized to delete this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, mentorOrAdminOnly, deleteEvent);

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully registered for event
 *       400:
 *         description: Already registered
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post('/:id/register', protect, registerForEvent);

/**
 * @swagger
 * /events/{id}/register:
 *   delete:
 *     summary: Unregister from an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully unregistered from event
 *       400:
 *         description: Not registered for this event
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/register', protect, unregisterFromEvent);

/**
 * @swagger
 * /events/my-events:
 *   get:
 *     summary: Get events the current user is registered for
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's events
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/my-events', protect, getUserEvents);

/**
 * @swagger
 * /events/organized:
 *   get:
 *     summary: Get events organized by the current user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organized events
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Mentor or admin access required
 *       500:
 *         description: Server error
 */
router.get('/organized', protect, mentorOrAdminOnly, getOrganizedEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getEventById);

export default router;
