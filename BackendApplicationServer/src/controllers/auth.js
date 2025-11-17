'use strict';

/**
 * Authentication controller providing mock login for development.
 */
class AuthController {
  // PUBLIC_INTERFACE
  login(req, res) {
    /** Authenticate user and return a mock JWT token. Requires username and password strings. */
    try {
      const { username, password } = req.body || {};
      if (
        !username ||
        !password ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        username.trim().length === 0 ||
        password.trim().length === 0
      ) {
        return res.status(401).json({
          code: 'unauthorized',
          message: 'Invalid credentials',
        });
      }

      // Generate a deterministic mock token. No external services involved.
      const ts = Date.now();
      const token = `mock-jwt-${Buffer.from(`${username}:${ts}`).toString('base64')}`;

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({
        code: 'internal_error',
        message: err.message || 'Unexpected error',
      });
    }
  }
}

module.exports = new AuthController();
