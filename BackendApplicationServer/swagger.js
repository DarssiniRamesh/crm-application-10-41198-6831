const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM Backend API',
      version: '1.0.0',
      description: 'Demo API endpoints for CRM Application 1.0. Provides users, tickets, complaints, case360, reports, and notifications for frontend integration.',
    },
    tags: [
      { name: 'Health', description: 'Service health checks' },
      { name: 'Users', description: 'User management' },
      { name: 'Tickets', description: 'Ticket management' },
      { name: 'Complaints', description: 'Complaint management' },
      { name: 'Case360', description: '360-degree case view' },
      { name: 'Reports', description: 'Reporting endpoints' },
      { name: 'Notifications', description: 'Notification services' },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            roles: { type: 'array', items: { type: 'string' } },
            status: { type: 'string' },
          },
          required: ['id', 'username', 'email', 'roles'],
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            category: { type: 'string' },
            subCategory: { type: 'string' },
            severity: { type: 'string' },
            description: { type: 'string' },
            requestor: { $ref: '#/components/schemas/User' },
            status: { type: 'string' },
            assignedAgent: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['type', 'description', 'requestor', 'status'],
        },
        Complaint: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            severity: { type: 'string' },
            description: { type: 'string' },
            requestor: { $ref: '#/components/schemas/User' },
            status: { type: 'string' },
            escalationDetails: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['type', 'description', 'requestor', 'status'],
        },
        Case360: {
          type: 'object',
          properties: {
            caseId: { type: 'string' },
            summary: { type: 'string' },
            lifecycleStatus: { type: 'string' },
            relatedSolutions: { type: 'array', items: { type: 'string' } },
            agentMapping: { type: 'string' },
            interactionHistory: { type: 'array', items: { type: 'string' } },
          },
          required: ['caseId', 'summary', 'lifecycleStatus'],
        },
        Report: {
          type: 'object',
          properties: {
            reportId: { type: 'string' },
            type: { type: 'string' },
            dateRange: { type: 'string' },
            data: { type: 'object' },
          },
          required: ['reportId', 'type', 'data'],
        },
        Notification: {
          type: 'object',
          properties: {
            notificationId: { type: 'string' },
            type: { type: 'string' },
            recipient: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'string' },
            sentAt: { type: 'string', format: 'date-time' },
          },
          required: ['type', 'recipient', 'message'],
        },
        Error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' },
          },
          required: ['code', 'message'],
        },
      },
      parameters: {
        page: { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        pageSize: { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 20 } },
        sort: { name: 'sort', in: 'query', schema: { type: 'string' } },
        filter: { name: 'filter', in: 'query', schema: { type: 'string' } },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed for the request.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
