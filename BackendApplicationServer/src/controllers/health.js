const healthService = require('../services/health');

class HealthController {
  // PUBLIC_INTERFACE
  /**
   * Handle health check requests.
   * Returns service health status JSON including environment and timestamp.
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {void} Sends JSON { status, message, timestamp, environment }
   */
  check(req, res) {
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }
}

module.exports = new HealthController();
