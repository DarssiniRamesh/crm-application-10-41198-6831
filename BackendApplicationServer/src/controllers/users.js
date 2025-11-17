'use strict';

const store = require('../services/dataStore');

class UsersController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** List demo users with optional pagination (page, pageSize). */
    try {
      const { page, pageSize, sort, filter } = req.query || {};
      const data = store.getUsers({
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
}

module.exports = new UsersController();
