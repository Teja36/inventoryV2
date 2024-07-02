import { z } from "zod";

export const getAllUsersSchema = z.object({
  query: z.object({
    searchQuery: z.string().optional(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "Id is required!" }),
  }),
});

export const updateUserDetailsByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "Id is required!" }),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Name is too short!" })
      .optional(),
    phoneNo: z
      .string()
      .regex(/^\+91 \d{10}$/, {
        message: "Phone number must be in the format +91 9876543210",
      })
      .optional(),

    password: z.string({ message: "Password is missing!" }),
  }),
});

export const updateUserPhotoUrlByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "Id is required!" }),
  }),
  body: z.object({
    photoUrl: z.string().url({ message: "Invalid url!" }).optional(),
  }),
});

export const updateUserRoleOrStatusByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "Id is required!" }),
  }),
  body: z.object({
    role: z.enum(["user", "admin"], { message: "Invalid role!" }).optional(),
    status: z.boolean({ message: "Status should be a boolean!" }).optional(),
  }),
});

export const updateStatusByIdsSchema = z.object({
  body: z.object({
    userIds: z.array(z.string({ message: "Id is required!" })),
    status: z.boolean({ message: "Status should be a boolean!" }),
  }),
});

export const deleteUsersByIdsSchema = z.object({
  body: z.object({
    userIds: z.array(z.string({ message: "Id is required!" })),
  }),
});

export const deleteUserByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "Id is required!" }),
  }),
});
