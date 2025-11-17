'use strict';

const store = require('../services/dataStore');

class TicketsController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** List demo tickets with optional pagination (page, pageSize). */
    try {
      const { page, pageSize, sort, filter } = req.query || {};
      const data = store.getTickets({
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        sort,
        filter,
      });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ code: 'internal_error', message: err.message });
    }
  }

  // PUBLIC_INTERFACE
  create(req, res) {
    /** Create a new demo ticket. Required: type, description, requestor (object or {id}). */
    try {
      const ticket = store.addTicket(req.body || {});
      return res.status(201).json(ticket);
    } catch (err) {
      return res.status(400).json({ code: 'validation_error', message: err.message });
    }
  }
}

module.exports = new TicketsController();
