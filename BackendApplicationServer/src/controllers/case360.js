'use strict';

const store = require('../services/dataStore');

class Case360Controller {
  // PUBLIC_INTERFACE
  getById(req, res) {
    /** Get a 360-degree case object by caseId. */
    try {
      const { caseId } = req.params;
      const obj = store.getCase360(caseId);
      if (!obj) {
        return res.status(404).json({ code: 'not_found', message: `Case not found: ${caseId}` });
      }
      return res.status(200).json(obj);
    } catch (err) {
      return res.status(500).json({ code: 'internal_error', message: err.message });
    }
  }
}

module.exports = new Case360Controller();
