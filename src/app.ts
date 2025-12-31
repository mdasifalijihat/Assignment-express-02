import express, { Request, Response } from "express";
import cors from "cors";
import { logger } from "./middlewares/logger";

import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";
import { usersRouter } from "./modules/users/users.routes";
import { bookingRouter } from "./modules/bookings/bookings.routes";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();

// ==============================
// MIDDLEWARES
// ==============================
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// global logger
app.use(logger);

// ==============================
// ROUTES
// ==============================
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Vehicle Rental API is running");
});

app.use("/vehicles", logger, vehiclesRouter);
app.use("/users", logger, usersRouter);
app.use("/bookings", logger, bookingRouter);
app.use("/auth", logger, authRouter);

// ==============================
// NOT FOUND ROUTE
// ==============================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("❌ Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
