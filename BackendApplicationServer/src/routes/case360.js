'use strict';

const express = require('express');
const caseController = require('../controllers/case360');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Case360
 *   description: "360-degree case view"
 */

/**
 * @swagger
 * /case360/{caseId}:
 *   get:
 *     summary: Get 360 view of a case
 *     description: "Returns a complete 360-degree object for a case by ID. Known seeded caseId: CSE-1001."
 *     tags: [Case360]
 *     parameters:
 *       - name: caseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case 360 view
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case360'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:caseId', caseController.getById.bind(caseController));

module.exports = router;
