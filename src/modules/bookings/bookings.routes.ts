import { Router } from "express";
import BookingController from "./bookings.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getBookings);
router.put("/:bookingId/cancel", BookingController.cancelBooking);
router.put("/:bookingId/return", BookingController.returnBooking);

export const bookingRouter = router;
