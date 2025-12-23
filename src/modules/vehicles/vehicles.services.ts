import { pool } from "../../db";

export interface VehiclePayload {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "available" | "booked";
}

class VehicleService {
  static async createVehicle(payload: VehiclePayload) {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status = "available",
    } = payload;

    const result = await pool.query(
      `
      INSERT INTO vehicles
      (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    return result.rows[0];
  }

  static async getAllVehicles() {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
  }

  static async getVehicleById(vehicleId: number) {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      vehicleId,
    ]);
    return result.rows[0];
  }

  static async updateVehicle(
    vehicleId: number,
    payload: Partial<VehiclePayload>
  ) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in payload) {
      fields.push(`${key} = $${index}`);
      values.push((payload as any)[key]);
      index++;
    }

    if (!fields.length) return null;

    const result = await pool.query(
      `
      UPDATE vehicles
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *;
      `,
      [...values, vehicleId]
    );

    return result.rows[0];
  }

  static async deleteVehicle(vehicleId: number) {
    // Active booking check
    const bookingCheck = await pool.query(
      `
      SELECT id FROM bookings
      WHERE vehicle_id = $1 AND status = 'active'
      `,
      [vehicleId]
    );

    if (bookingCheck.rows.length > 0) {
      throw new Error("Vehicle has active bookings");
    }

    await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId]);
  }
}

export default VehicleService;
