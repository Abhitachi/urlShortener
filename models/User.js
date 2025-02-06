const pool = require("../config/db");

class User {
  static async findUser(googleId) {
    const result = await pool.query(
      "select * from users where google_id = $1",
      [googleId]
    );
    return result.rows[0];
  }

  static async findUserById(userId) {
    const result = await pool.query("select * from users where id = $1", [
      userId,
    ]);
    return result.rows[0];
  }

  static async createUser(googleId, email) {
    const result = await pool.query(
      "insert into users (google_id, email) values ($1, $2) returning *",
      [googleId, email]
    );
    return result.rows[0];
  }
}

module.exports = User;
