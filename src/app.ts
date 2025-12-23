import express, { Request, Response } from "express";
import { logger } from "./middlewares/logger";
import initDB from "./db";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";
import { usersRouter } from "./modules/users/users.routes";
import { bookingRouter } from "./modules/bookings/bookings.routes";
import { authRouter } from "./modules/auth/auth.routes";
const app = express();

// parser
app.use(express.json());

// initializing DB
initDB();

// vehicles api route
app.use("/vehicles", vehiclesRouter);

// users routers
app.use("/users", usersRouter);

// booking routers
app.use("/booking", bookingRouter);

// auth routers
app.use("/auth", authRouter);

// get method
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World! API is running ");
});

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;
