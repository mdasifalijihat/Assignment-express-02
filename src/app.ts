import express, { Request, Response } from "express";
import { logger } from "./middlewares/logger";
import initDB from "./db";
const app = express();

// parser
app.use(express.json());

// initializing DB
initDB();

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
