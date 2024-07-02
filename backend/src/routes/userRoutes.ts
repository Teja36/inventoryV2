import { Router } from "express";
import {
  deleteUserById,
  deleteUsersByIds,
  getAllUsers,
  getUserById,
  updateStatusByIds,
  updateUserDetailsById,
  updateUserRoleOrStatusById,
} from "../controllers/userController.js";
import { validateRequestData } from "../middleware/validationMiddleware.js";
import {
  deleteUserByIdSchema,
  deleteUsersByIdsSchema,
  getAllUsersSchema,
  getUserByIdSchema,
  updateStatusByIdsSchema,
  updateUserDetailsByIdSchema,
  updateUserRoleOrStatusByIdSchema,
} from "../validations/userSchema.js";

const userRouter = Router();

userRouter.get("/", validateRequestData(getAllUsersSchema), getAllUsers);

userRouter.get("/:id", validateRequestData(getUserByIdSchema), getUserById);

userRouter.patch(
  "/",
  validateRequestData(updateStatusByIdsSchema),
  updateStatusByIds
);

userRouter.put(
  "/:id",
  validateRequestData(updateUserDetailsByIdSchema),
  updateUserDetailsById
);

//TODO: Fix this type error.
userRouter.patch(
  "/:id",
  validateRequestData(updateUserRoleOrStatusByIdSchema),
  updateUserRoleOrStatusById
);

userRouter.delete(
  "/",
  validateRequestData(deleteUsersByIdsSchema),
  deleteUsersByIds
);

userRouter.delete(
  "/:id",
  validateRequestData(deleteUserByIdSchema),
  deleteUserById
);

export default userRouter;
