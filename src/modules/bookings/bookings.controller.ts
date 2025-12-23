import { Request, Response } from "express";
import BookingService from "./bookings.services";

interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: "admin" | "customer";
  };
}

class BookingController {
  static async createBooking(req: AuthRequest, res: Response) {
    try {
      const booking = await BookingService.createBooking({
        ...req.body,
        customer_id: req.user!.userId,
      });

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getBookings(req: AuthRequest, res: Response) {
    const { role, userId } = req.user!;

    const bookings =
      role === "admin"
        ? await BookingService.getAllBookings()
        : await BookingService.getBookingsByUser(userId);

    res.json({
      success: true,
      data: bookings,
    });
  }

  static async cancelBooking(req: AuthRequest, res: Response) {
    try {
      await BookingService.cancelBooking(
        Number(req.params.bookingId),
        req.user!.userId
      );

      res.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async returnBooking(req: AuthRequest, res: Response) {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can return booking",
      });
    }

    try {
      await BookingService.returnBooking(Number(req.params.bookingId));

      res.json({
        success: true,
        message: "Vehicle returned successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default BookingController;
