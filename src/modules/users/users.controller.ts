import { Request, Response } from "express";
import UserService from "./users.services";

interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: "admin" | "customer";
  };
}

class UserController {
  static async getAllUsers(req: AuthRequest, res: Response) {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const users = await UserService.getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  }

  static async updateUser(req: AuthRequest, res: Response) {
    const targetUserId = Number(req.params.userId);
    const loggedInUser = req.user!;

    // Customer can update only own profile
    if (
      loggedInUser.role === "customer" &&
      loggedInUser.userId !== targetUserId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own profile",
      });
    }

    // Customer cannot update role
    if (loggedInUser.role === "customer" && "role" in req.body) {
      return res.status(403).json({
        success: false,
        message: "Role change not allowed",
      });
    }

    try {
      const user = await UserService.updateUser(targetUserId, req.body);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    try {
      await UserService.deleteUser(Number(req.params.userId));
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default UserController;
