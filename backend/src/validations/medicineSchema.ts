import { z } from "zod";

const potencyPattern = /^\d+[A-Za-z]+$/;
const quantityPattern = /^\d+(ml|g)$/;

export const getMedicinesRequestSchema = z.object({
  query: z.object({
    searchQuery: z.string().optional(),
    sortBy: z.enum(["name", "potency", "quantity", "brand"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    limit: z.coerce.number().gte(5).lte(100).optional(),
    offset: z.coerce.number().nonnegative().optional(),
  }),
});

export const getMedicineByIdRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "Id is required!" }).positive(),
  }),
});

export const getMedicinesByIdsRequestSchema = z.object({
  body: z.object({
    medicineIds: z
      .array(z.coerce.number({ message: "Id is required!" }).positive())
      .nonempty()
      .max(10),
  }),
});

export const postMedicineRequestSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required!" }),
    brand: z.string({ message: "Brand is required!" }),
    potency: z
      .string({ message: "Potency is required!" })
      .regex(potencyPattern, {
        message:
          "Invalid potency format. Expected format is numeric followed by letters (e.g., '30C', '200C', '1M', '10M').",
      }),
    size: z.string({ message: "Size is required!" }).regex(quantityPattern, {
      message:
        "Invalid size format. Expected format is numeric followed by 'ml' or 'g' (e.g., '500ml', '200g').",
    }),
    quantity: z.number({ message: "Quantity is required!" }).min(1).max(10),
    location: z.object({
      row: z.number().positive(),
      col: z.number().positive(),
      shelf: z.enum(["left", "right", "bottom"]),
      rack: z.enum(["top", "middle", "bottom", ""]),
    }),
  }),
});

export const putMedicineRequestSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: "Id is required" })
      .positive({ message: "Id provided is invalid!" }),
  }),
  body: z.object({
    name: z.string({ message: "Name is required!" }),
    brand: z.string({ message: "Brand is required!" }),
    potency: z
      .string({ message: "Potency is required!" })
      .regex(potencyPattern, {
        message:
          "Invalid potency format. Expected format is numeric followed by letters (e.g., '30C', '200C', '1M', '10M').",
      }),
    size: z.string({ message: "Size is required!" }).regex(quantityPattern, {
      message:
        "Invalid size format. Expected format is numeric followed by 'ml' or 'g' (e.g., '500ml', '200g').",
    }),
    quantity: z.number({ message: "Quantity is required!" }).min(1).max(10),
    location: z.object({
      row: z.number().positive(),
      col: z.number().positive(),
      shelf: z.enum(["left", "right", "bottom"]),
      rack: z.enum(["top", "middle", "bottom", ""]),
    }),
  }),
});

export const deleteMedicineRequestSchema = z.object({
  params: z.object({
    id: z.coerce.number({ message: "Id provided is invalid!" }).positive(),
  }),
});
