import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import UserController from "./users.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", UserController.getAllUsers);
router.put("/:userId", UserController.updateUser);
router.delete("/:userId", UserController.deleteUser);

export const usersRouter = router;
