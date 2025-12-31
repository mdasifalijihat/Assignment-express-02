import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import UserController from "./users.controller";

const router = Router();

// router.use(authMiddleware);

router.get("/", authMiddleware, UserController.getAllUsers);
router.put("/:userId", authMiddleware, UserController.updateUser);
router.delete("/:userId", authMiddleware, UserController.deleteUser);

export const usersRouter = router;
