import { verify } from "@node-rs/argon2";
import { eq, ilike, inArray } from "drizzle-orm";
import { Request, Response } from "express";
import db from "../db/db_connect.js";
import { users } from "../db/schema.js";

export const getAllUsers = async (req: Request, res: Response) => {
  if (!res.locals.session) {
    return res.status(403).json({ error: "Access Denied!" });
  }

  let fetchedUsers;

  let query = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phoneNo: users.phoneNo,
      photoUrl: users.photoUrl,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .$dynamic();

  let { searchQuery = "" } = req.query;

  if (searchQuery) query = query.where(ilike(users.name, `%${searchQuery}%`));

  query = query.orderBy(users.id);

  try {
    fetchedUsers = await query.execute();
    res.status(200).json(fetchedUsers);
  } catch (err) {
    return res.status(500).send("Something went wrong!");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  if (!res.locals.session)
    return res.status(403).json({ error: "Access Denied!" });

  const userId = req.params.id;

  try {
    let [userData] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNo: users.phoneNo,
        photoUrl: users.photoUrl,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!userData) return res.status(404).json({ error: "User not found!" });

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).send("Something went wrong!");
  }
};

export const updateStatusByIds = async (req: Request, res: Response) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.role !== "admin"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const { userIds, status } = req.body;

  try {
    const result = await db
      .update(users)
      .set({ status })
      .where(inArray(users.id, userIds));

    return res.status(200).json({ message: "Status updated successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const updateUserDetailsById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (!res.locals.session || !res.locals.user || res.locals.user.id !== userId)
    return res.status(403).json({ error: "Access Denied!" });

  const { name, phoneNo, password } = req.body;

  try {
    const [user] = await db
      .select({ hashedPassword: users.hashedPassword })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const validPassword = await verify(
      user.hashedPassword as string,
      password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        phoneNo,
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        phoneNo: users.phoneNo,
      });

    if (!updatedUser)
      return res.status(404).json({ error: "Invalid credentials!" });

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).send("Something went wrong!");
  }
};

export const updateUserRoleOrStatusById = async (
  req: Request,
  res: Response
) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.role !== "admin"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const userId = req.params.id;
  const { role, status } = req.body;

  try {
    if (role === "user" || role === "admin") {
      const [updatedRole] = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, userId))
        .returning({ id: users.id, role: users.role });

      if (!updatedRole)
        return res.status(404).json({ error: "User not found!" });

      return res.status(200).json(updatedRole);
    } else {
      const [updatedStatus] = await db
        .update(users)
        .set({ status })
        .where(eq(users.id, userId))
        .returning({ id: users.id, status: users.status });

      if (!updatedStatus)
        return res.status(404).json({ error: "User not found!" });

      return res.status(200).json(updatedStatus);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Something went wrong!", errorCode: err });
  }
};

export const deleteUsersByIds = async (req: Request, res: Response) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.role !== "admin"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const { userIds } = req.body;

  try {
    await db.delete(users).where(inArray(users.id, userIds));
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
  return res.sendStatus(200);
};

export const deleteUserById = async (req: Request, res: Response) => {
  if (
    !res.locals.session ||
    !res.locals.user ||
    res.locals.user.role !== "admin"
  )
    return res.status(403).json({ error: "Access Denied!" });

  const userId = req.params.id;

  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
  return res.sendStatus(200);
};
