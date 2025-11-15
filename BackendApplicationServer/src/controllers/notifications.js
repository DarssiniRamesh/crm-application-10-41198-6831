'use strict';

const store = require('../services/dataStore');

class NotificationsController {
  // PUBLIC_INTERFACE
  send(req, res) {
    /** Send a mock notification (email/SMS) and return status=sent. */
    try {
      const result = store.sendNotification(req.body || {});
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ code: 'validation_error', message: err.message });
    }
  }
}

module.exports = new NotificationsController();
