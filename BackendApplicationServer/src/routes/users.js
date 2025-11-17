'use strict';

const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users
 *     description: Returns a list of demo users. Supports basic pagination via query parameters.
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/sort'
 *       - $ref: '#/components/parameters/filter'
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', usersController.list.bind(usersController));

module.exports = router;
