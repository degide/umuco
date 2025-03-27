
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Umuco API',
      version: '1.0.0',
      description: 'API documentation for Umuco cultural learning platform',
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
      contact: {
        name: 'API Support',
        email: 'support@umuco.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['student', 'mentor', 'admin'] },
            avatar: { type: 'string' },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            instructor: { type: 'string' },
            thumbnail: { type: 'string' },
            category: { type: 'string' },
            level: { type: 'string' },
            duration: { type: 'number' },
            enrolledCount: { type: 'number' },
            rating: { type: 'number' },
          },
        },
        CourseCategory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ForumCategory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ForumPost: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            author: { 
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/User' }
              ]
            },
            category: { type: 'string' },
            likes: { type: 'array', items: { type: 'string' } },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { 
                    oneOf: [
                      { type: 'string' },
                      { $ref: '#/components/schemas/User' }
                    ]
                  },
                  text: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                }
              }
            },
            views: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            duration: { type: 'number' },
            organizer: { 
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/User' }
              ]
            },
            category: { type: 'string' },
            thumbnail: { type: 'string' },
            cloudinaryId: { type: 'string' },
            attendees: { 
              type: 'array', 
              items: { 
                oneOf: [
                  { type: 'string' },
                  { $ref: '#/components/schemas/User' }
                ]
              } 
            },
            location: { type: 'string' },
            isOnline: { type: 'boolean' },
            meetingLink: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Enrollment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { 
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/User' }
              ]
            },
            course: { 
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/Course' }
              ]
            },
            progress: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  lessonId: { type: 'string' },
                  completed: { type: 'boolean' },
                  lastAccessed: { type: 'string', format: 'date-time' },
                }
              }
            },
            completed: { type: 'boolean' },
            certificateIssued: { type: 'boolean' },
            paymentId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            type: { type: 'string', enum: ['system', 'course', 'forum', 'event'] },
            read: { type: 'boolean' },
            relatedId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Courses', description: 'Course management' },
      { name: 'Course Categories', description: 'Course category management' },
      { name: 'Forums', description: 'Forum management' },
      { name: 'Forum Categories', description: 'Forum category management' },
      { name: 'Events', description: 'Event management' },
      { name: 'Enrollments', description: 'Course enrollment management' },
      { name: 'Notifications', description: 'Notification management' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
