import { Router } from "express";
import {
  createMedicine,
  deleteMedicine,
  getAllMedicines,
  getMedicineById,
  getMedicinesByIds,
  updateMedicine,
} from "../controllers/medicineController.js";
import { validateRequestData } from "../middleware/validationMiddleware.js";
import {
  deleteMedicineRequestSchema,
  getMedicineByIdRequestSchema,
  getMedicinesByIdsRequestSchema,
  getMedicinesRequestSchema,
  postMedicineRequestSchema,
  putMedicineRequestSchema,
} from "../validations/medicineSchema.js";

const router = Router();

router.get(
  "/",
  validateRequestData(getMedicinesRequestSchema),
  getAllMedicines
);

router.get(
  "/:id",
  validateRequestData(getMedicineByIdRequestSchema),
  getMedicineById
);

router.post(
  "/bulk-fetch",
  validateRequestData(getMedicinesByIdsRequestSchema),
  getMedicinesByIds
);

router.post(
  "/",
  validateRequestData(postMedicineRequestSchema),
  createMedicine
);

router.put(
  "/:id",
  validateRequestData(putMedicineRequestSchema),
  updateMedicine
);

router.delete(
  "/:id",
  validateRequestData(deleteMedicineRequestSchema),
  deleteMedicine
);

export default router;
