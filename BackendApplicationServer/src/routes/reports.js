'use strict';

const express = require('express');
const reportsController = require('../controllers/reports');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting endpoints
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Generate and download reports
 *     description: Returns a JSON payload of report data. Currently supports type=summary for enriched mock data.
 *     tags: [Reports]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: summary
 *       - name: dateRange
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: last-30-days
 *     responses:
 *       200:
 *         description: Report data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', reportsController.get.bind(reportsController));

module.exports = router;
