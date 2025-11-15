const express = require('express');
const healthController = require('../controllers/health');

// Resource routers
const usersRouter = require('./users');
const ticketsRouter = require('./tickets');
const complaintsRouter = require('./complaints');
const case360Router = require('./case360');
const reportsRouter = require('./reports');
const notificationsRouter = require('./notifications');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount resource routers
router.use('/users', usersRouter);
router.use('/tickets', ticketsRouter);
router.use('/complaints', complaintsRouter);
router.use('/case360', case360Router);
router.use('/reports', reportsRouter);
router.use('/notifications', notificationsRouter);

module.exports = router;
