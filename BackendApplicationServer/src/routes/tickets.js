'use strict';

const express = require('express');
const ticketsController = require('../controllers/tickets');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: List tickets
 *     description: Returns a list of demo tickets. Supports basic pagination via query parameters.
 *     tags: [Tickets]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/sort'
 *       - $ref: '#/components/parameters/filter'
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *   post:
 *     summary: Create a new ticket
 *     description: Accepts a ticket payload and returns the created ticket.
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', ticketsController.list.bind(ticketsController));
router.post('/', ticketsController.create.bind(ticketsController));

module.exports = router;
