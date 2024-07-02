import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import db from "../db/db_connect.js";
import { users } from "../db/schema.js";
import { unlink } from "fs/promises";
import path from "path";

export const uploadFile = async (req: Request, res: Response) => {
  if (!res.locals.session || !res.locals.user)
    return res.status(403).json({ error: "Access Denied!" });

  if (!req.file) {
    return res.status(400).json({ error: "File is required!" });
  }

  const userId = res.locals.user.id;

  const fileUrl = `${process.env.BASE_URL}/public/${req.file.filename}`;

  try {
    const [{ photoUrl: oldPhotoUrl }] = await db
      .select({ photoUrl: users.photoUrl })
      .from(users)
      .where(eq(users.id, userId));

    if (oldPhotoUrl) {
      const oldFilename = oldPhotoUrl?.substring(
        oldPhotoUrl.lastIndexOf("/") + 1
      );

      const filePath = path.join(
        __dirname,
        "../public/profile-pics",
        oldFilename
      );

      await unlink(filePath);
    }

    const result = await db
      .update(users)
      .set({ photoUrl: fileUrl })
      .where(eq(users.id, userId));

    if (result.rowCount === 0)
      return res.status(500).json({ error: "Something went wrong!" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error!" });
  }

  res.status(200).json({ photoUrl: fileUrl });
};
