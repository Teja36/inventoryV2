import { Router } from "express";
import {
  login,
  signUp,
  logout,
  resetPassword,
} from "../controllers/authController.js";
import { validateRequestData } from "../middleware/validationMiddleware.js";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validations/authSchema.js";
import { validateUserSession } from "../middleware/validateSession.js";

const authRouter = Router();

authRouter.post("/signup", validateRequestData(signupSchema), signUp);

authRouter.post("/login", validateRequestData(loginSchema), login);

authRouter.post("/logout", validateUserSession, logout);

authRouter.put(
  "/reset-password",
  validateRequestData(resetPasswordSchema),
  validateUserSession,
  resetPassword
);

export default authRouter;
