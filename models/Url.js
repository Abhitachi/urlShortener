const pool = require("../config/db");

class Url {
  static async createUrl(longurl, shorturl, userId, topic) {
    console.log(userId, "id");
    const result = await pool.query(
      "insert into urls (long_url, short_url, user_id, topic) values ($1, $2, $3, $4) returning *",
      [longurl, shorturl, userId, topic]
    );
    return result.rows[0];
  }

  static async findUrl(shorturl) {
    const result = await pool.query("select * from urls where short_url = $1", [
      shorturl,
    ]);
    return result.rows[0];
  }

  static async findLongUrl(longurl) {
    const result = await pool.query("select * from urls where long_url = $1", [
      longurl,
    ]);
    return result.rows[0];
  }

  static async totalUrl() {
    const result = await pool.query("select * from urls");
    return result.rows.length;
  }
}

module.exports = Url;
