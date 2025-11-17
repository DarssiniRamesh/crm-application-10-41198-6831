'use strict';

const express = require('express');
const complaintsController = require('../controllers/complaints');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management
 */

/**
 * @swagger
 * /complaints:
 *   get:
 *     summary: List complaints
 *     description: Returns a list of demo complaints. Supports basic pagination via query parameters.
 *     tags: [Complaints]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/sort'
 *       - $ref: '#/components/parameters/filter'
 *     responses:
 *       200:
 *         description: List of complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Complaint'
 *   post:
 *     summary: Create a new complaint
 *     description: Accepts a complaint payload and returns the created complaint.
 *     tags: [Complaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Complaint'
 *     responses:
 *       201:
 *         description: Complaint created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Complaint'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', complaintsController.list.bind(complaintsController));
router.post('/', complaintsController.create.bind(complaintsController));

module.exports = router;
