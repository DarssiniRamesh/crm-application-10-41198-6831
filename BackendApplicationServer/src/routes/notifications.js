'use strict';

const express = require('express');
const notificationsController = require('../controllers/notifications');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification services (email/SMS)
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Send notification via email or SMS
 *     description: Sends a mock notification and returns status=sent along with generated notificationId.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Notification sent confirmation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/', notificationsController.send.bind(notificationsController));

module.exports = router;
