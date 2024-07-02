import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(3, { message: "Name is too short" }),
    email: z.string().email({ message: "Invalid email!" }),
    phoneNo: z
      .string({ message: "Phone no is required" })
      .regex(/^\+91 \d{10}$/, {
        message: "Phone number must be in the format +91 9876543210",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be 8 characters long" }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email or password!" }),
    password: z.string({ message: "Invalid email or password!" }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string({ message: "Password is missing!" }),
    newPassword: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
        }
      ),
  }),
});
