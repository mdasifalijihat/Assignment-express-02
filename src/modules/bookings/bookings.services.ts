import { pool } from "../../db";

interface CreateBookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

class BookingService {
  static async createBooking(payload: CreateBookingPayload) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1️⃣ Check vehicle availability
      const vehicleResult = await client.query(
        `SELECT * FROM vehicles WHERE id = $1`,
        [payload.vehicle_id]
      );

      const vehicle = vehicleResult.rows[0];
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle not available");
      }

      // 2️⃣ Calculate days
      const start = new Date(payload.rent_start_date);
      const end = new Date(payload.rent_end_date);

      if (end <= start) {
        throw new Error("Invalid rental date range");
      }

      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      const totalPrice = days * vehicle.daily_rent_price;

      // 3️⃣ Create booking
      const bookingResult = await client.query(
        `
        INSERT INTO bookings
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
          payload.customer_id,
          payload.vehicle_id,
          payload.rent_start_date,
          payload.rent_end_date,
          totalPrice,
        ]
      );

      // 4️⃣ Update vehicle status
      await client.query(
        `
        UPDATE vehicles
        SET availability_status = 'booked'
        WHERE id = $1
        `,
        [payload.vehicle_id]
      );

      await client.query("COMMIT");

      return bookingResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAllBookings() {
    const result = await pool.query(
      `
      SELECT * FROM bookings
      `
    );
    return result.rows;
  }

  static async getBookingsByUser(userId: number) {
    const result = await pool.query(
      `
      SELECT * FROM bookings
      WHERE customer_id = $1
      `,
      [userId]
    );
    return result.rows;
  }

  static async cancelBooking(bookingId: number, userId: number) {
    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [bookingId]
    );

    const booking = bookingResult.rows[0];
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.customer_id !== userId) {
      throw new Error("Unauthorized booking access");
    }

    if (new Date(booking.rent_start_date) <= new Date()) {
      throw new Error("Cannot cancel after rental start");
    }

    await pool.query(
      `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = $1
      `,
      [bookingId]
    );

    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `,
      [booking.vehicle_id]
    );
  }

  static async returnBooking(bookingId: number) {
    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [bookingId]
    );

    const booking = bookingResult.rows[0];
    if (!booking) {
      throw new Error("Booking not found");
    }

    await pool.query(
      `
      UPDATE bookings
      SET status = 'returned'
      WHERE id = $1
      `,
      [bookingId]
    );

    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `,
      [booking.vehicle_id]
    );
  }
}

export default BookingService;
