import { hash, verify } from "@node-rs/argon2";
import { Request, Response } from "express";
import { generateIdFromEntropySize } from "lucia";
import db from "../db/db_connect.js";
import { users } from "../db/schema.js";
import { lucia } from "../auth/auth.js";
import { eq } from "drizzle-orm";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name, phoneNo } = req.body;

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10);

  try {
    await db.insert(users).values({
      id: userId,
      name,
      email,
      phoneNo,
      hashedPassword: passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    res.setHeader("Set-Cookie", sessionCookie.serialize());

    res.status(201).json({
      id: userId,
      name,
      email,
      phoneNo,
      photoUrl: null,
      role: "user",
      status: false,
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user)
    return res.status(400).json({ error: "Invalid email or password!" });

  if (user.status)
    return res
      .status(403)
      .json({ error: "Your account has been disabled by the admin!" });

  const validPassword = await verify(user.hashedPassword as string, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return res.status(400).json({ error: "Invalid email or password!" });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  res.setHeader("Set-Cookie", sessionCookie.serialize());

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNo: user.phoneNo,
    photoUrl: user.photoUrl,
    role: user.role,
    status: user.status,
  });
};

export const logout = async (req: Request, res: Response) => {
  if (res.locals.session) {
    await lucia.invalidateSession(res.locals.session.id);
  }
  res.sendStatus(204);
};

export const resetPassword = async (req: Request, res: Response) => {
  if (!res.locals.session || !res.locals.user)
    return res.status(403).json({ error: "Access Denied!" });

  const userId = res.locals.user.id;
  const { password, newPassword } = req.body;

  if (password === newPassword)
    return res
      .status(400)
      .json({ error: "New password can't be same as the old one" });

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return res.status(400).json({ error: "User not found!" });

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
      return res.status(400).json({ error: "Wrong password!" });
    }

    const passwordHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const { rowCount } = await db
      .update(users)
      .set({ hashedPassword: passwordHash })
      .where(eq(users.id, userId));

    if (rowCount === 1)
      return res
        .status(200)
        .json({ message: "Password updated successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
