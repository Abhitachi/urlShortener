const pool = require("../config/db");

class analytics {
  static async urlVisits(urlId, userAgent, ipAddress, geolocation) {
    await pool.query(
      "INSERT INTO analytics (url_id, user_agent, ip_address, geolocation) VALUES ($1, $2, $3, $4)",
      [urlId, userAgent, ipAddress, geolocation]
    );
  }

  static async getUrlAnalytics(urlId) {
    const result = await pool.query(
      "select  * from analytics where url_id = $1",
      [urlId]
    );
    return result.rows;
  }

  static async getTopicAnalytics(topic) {
    const result = await pool.query(
      `SELECT u.short_url, u.created_at, COUNT(a.id) AS total_clicks
       FROM urls u
       LEFT JOIN analytics a ON u.id = a.url_id
       WHERE u.topic = $1
       GROUP BY u.short_url , u.created_at`,
      [topic]
    );
    return result.rows;
  }

  static async getUserAnalytics(userId) {
    const result = await pool.query(
      `select u.short_url, u.created_at, count(a.id) as total_clicks 
      from urls u
      LEFT JOIN analytics a ON u.id = a.url_id
      WHERE u.user_id = $1
      GROUP BY u.short_url, u.created_at`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = analytics;
