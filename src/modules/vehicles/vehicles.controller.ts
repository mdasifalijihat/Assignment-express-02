import { Request, Response } from "express";
import VehicleService from "./vehicles.services";

class VehicleController {
  static async createVehicle(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllVehicles(req: Request, res: Response) {
    const vehicles = await VehicleService.getAllVehicles();
    res.json({
      success: true,
      data: vehicles,
    });
  }

  static async getVehicle(req: Request, res: Response) {
    const vehicle = await VehicleService.getVehicleById(
      Number(req.params.vehicleId)
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  }

  static async updateVehicle(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.updateVehicle(
        Number(req.params.vehicleId),
        req.body
      );

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found or no data to update",
        });
      }

      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteVehicle(req: Request, res: Response) {
    try {
      await VehicleService.deleteVehicle(Number(req.params.vehicleId));
      res.json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default VehicleController;
