import { pool } from "../../db";

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  role?: "admin" | "customer";
}

class UserService {
  static async getAllUsers() {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, created_at FROM users`
    );
    return result.rows;
  }

  static async getUserById(userId: number) {
    const result = await pool.query(
      `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async updateUser(userId: number, payload: UpdateUserPayload) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in payload) {
      fields.push(`${key} = $${index}`);
      values.push((payload as any)[key]);
      index++;
    }

    if (!fields.length) return null;

    const result = await pool.query(
      `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, name, email, phone, role;
      `,
      [...values, userId]
    );

    return result.rows[0];
  }

  static async deleteUser(userId: number) {
    // Check active bookings
    const bookingCheck = await pool.query(
      `
      SELECT id FROM bookings
      WHERE customer_id = $1 AND status = 'active'
      `,
      [userId]
    );

    if (bookingCheck.rows.length > 0) {
      throw new Error("User has active bookings");
    }

    await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  }
}

export default UserService;
