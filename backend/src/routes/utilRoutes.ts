import { Router } from "express";
import {
  getDashboardData,
  getGraphData,
  getMedicineAutocompleteData,
} from "../controllers/utilController.js";

const utilRouter = Router();

utilRouter.get("/graph-data", getGraphData);

utilRouter.get("/dashboard-data", getDashboardData);

utilRouter.get("/medicine-autocomplete", getMedicineAutocompleteData);

export default utilRouter;
