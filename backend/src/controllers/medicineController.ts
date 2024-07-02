import { desc, eq, ilike, inArray, count as recordCount } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { Request, Response } from "express";
import db from "../db/db_connect.js";
import { locations, medicines } from "../db/schema.js";

export const getAllMedicines = async (req: Request, res: Response) => {
  if (!res.locals.session) {
    return res.status(403).json({ error: "Access Denied!" });
  }

  let fetchedMedicines;
  let query = db
    .select({
      id: medicines.id,
      name: medicines.name,
      brand: medicines.brand,
      potency: medicines.potency,
      size: medicines.size,
      quantity: medicines.quantity,
      location: {
        row: locations.row,
        col: locations.col,
        shelf: locations.shelf,
        rack: locations.rack,
      },
    })
    .from(medicines)
    .innerJoin(locations, eq(medicines.id, locations.medicine_id))
    .$dynamic();

  let {
    searchQuery = "",
    sortBy = "",
    order = "asc",
    limit = 10,
    offset = 0,
  } = req.query;

  limit = Number(limit);
  offset = Number(offset);

  if (searchQuery)
    query = query.where(ilike(medicines.name, `%${searchQuery}%`));

  const applyOrdering = (
    baseQuery: typeof query,
    column: PgColumn<any>,
    order: string = "asc"
  ) =>
    order === "desc"
      ? baseQuery.orderBy(desc(column))
      : baseQuery.orderBy(column);

  if (sortBy) {
    switch (sortBy) {
      case "name":
        query = applyOrdering(query, medicines.name, order as string);
        break;
      case "potency":
        query = applyOrdering(query, medicines.potency, order as string);
        break;
      case "quantity":
        query = applyOrdering(query, medicines.quantity, order as string);
        break;
      case "brand":
        query = applyOrdering(query, medicines.brand, order as string);
        break;
      default:
        query = query.orderBy(medicines.id);
    }
  } else query = query.orderBy(medicines.id);

  query = query.limit(limit).offset(offset);

  try {
    let countQuery = db
      .select({ count: recordCount() })
      .from(medicines)
      .$dynamic();

    if (searchQuery)
      countQuery = countQuery.where(ilike(medicines.name, `%${searchQuery}%`));

    let count = await countQuery.execute();

    let totalPages = Math.ceil(count[0].count / limit);

    let currentPage = Math.floor(offset / limit) + 1;

    fetchedMedicines = await query.execute();

    res.status(200).json({
      totalItems: count[0].count,
      totalPages,
      currentPage,
      medicines: fetchedMedicines,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong!");
  }
};

export const getMedicineById = async (req: Request, res: Response) => {
  if (!res.locals.session) {
    return res.status(403).json({ error: "Access Denied!" });
  }

  const medicineId = Number(req.params.id);

  let medicineFound;

  if (isNaN(medicineId)) {
    res.status(400).send("Invalid id!");
    return;
  }

  try {
    medicineFound = await db
      .select({
        id: medicines.id,
        name: medicines.name,
        brand: medicines.brand,
        potency: medicines.potency,
        size: medicines.size,
        quantity: medicines.quantity,
        location: {
          row: locations.row,
          col: locations.col,
          shelf: locations.shelf,
          rack: locations.rack,
        },
      })
      .from(medicines)
      .where(eq(medicines.id, medicineId))
      .innerJoin(locations, eq(medicines.id, locations.medicine_id));
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong!");
  }

  if (!medicineFound) {
    return res.status(404).send("Medicine not found");
  }

  res.status(200).json(medicineFound);
};

export const getMedicinesByIds = async (req: Request, res: Response) => {
  if (!res.locals.session || !res.locals.user) {
    return res.status(403).json({ error: "Access Denied!" });
  }

  const { medicineIds } = req.body;

  if (medicineIds.length === 0) {
    res.status(400).send("Invalid ids!");
    return;
  }

  try {
    const medicinesFound = await db
      .select({
        id: medicines.id,
        name: medicines.name,
        brand: medicines.brand,
        potency: medicines.potency,
        size: medicines.size,
        quantity: medicines.quantity,
        location: {
          row: locations.row,
          col: locations.col,
          shelf: locations.shelf,
          rack: locations.rack,
        },
      })
      .from(medicines)
      .where(inArray(medicines.id, medicineIds))
      .innerJoin(locations, eq(medicines.id, locations.medicine_id));

    if (!medicinesFound) {
      return res.status(404).send("Medicines not found");
    }

    const medicineMap = new Map(
      medicinesFound.map((medicine) => [medicine.id, medicine])
    );

    const sortedMedicines = medicineIds
      .map((id: number) => medicineMap.get(id))
      .filter(Boolean);

    return res.status(200).json(sortedMedicines);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong!");
  }
};

export const createMedicine = async (req: Request, res: Response) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.status ||
    res.locals.user.role === "user"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const { name, potency, quantity, size, brand, location } = req.body;
  const { row, col, shelf, rack } = location;

  try {
    const [savedMedicine] = await db
      .insert(medicines)
      .values({
        name,
        potency,
        quantity,
        size,
        brand,
      })
      .returning();

    const [savedLocation] = await db
      .insert(locations)
      .values({
        row,
        col,
        shelf,
        rack,
        medicine_id: savedMedicine.id,
      })
      .returning();

    return res
      .status(201)
      .json({ ...savedMedicine, location: { ...savedLocation } });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong!");
  }
};

export const updateMedicine = async (req: Request, res: Response) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.status ||
    res.locals.user.role === "user"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const medicineId = Number(req.params.id);

  const { name, potency, quantity, size, brand, location } = req.body;
  const { row, col, shelf, rack } = location;

  try {
    const [updatedMedicine] = await db
      .update(medicines)
      .set({
        name,
        potency,
        quantity,
        size,
        brand,
      })
      .where(eq(medicines.id, medicineId))
      .returning();

    const [updatedLocation] = await db
      .update(locations)
      .set({
        row,
        col,
        shelf,
        rack,
        medicine_id: medicineId,
      })
      .where(eq(locations.medicine_id, medicineId))
      .returning();

    return res
      .status(200)
      .json({ ...updatedMedicine, location: { ...updatedLocation } });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error!");
  }
};

export const deleteMedicine = async (req: Request, res: Response) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.status ||
    res.locals.user.role === "user"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const medicineId = Number(req.params.id);

  try {
    await db.delete(medicines).where(eq(medicines.id, medicineId));
  } catch (err) {
    return res.status(500).send("Something went wrong!");
  }

  res.status(200).send("Medicine deleted!");
};
