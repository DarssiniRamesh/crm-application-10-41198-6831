'use strict';

const store = require('../services/dataStore');

class ReportsController {
  // PUBLIC_INTERFACE
  get(req, res) {
    /** Generate a mock report by type, e.g., type=summary. */
    try {
      const { type, dateRange } = req.query || {};
      if (!type) {
        return res.status(400).json({ code: 'validation_error', message: 'Query parameter "type" is required' });
      }
      const report = store.getReport(type, dateRange);
      return res.status(200).json(report);
    } catch (err) {
      return res.status(400).json({ code: 'validation_error', message: err.message });
    }
  }
}

module.exports = new ReportsController();
