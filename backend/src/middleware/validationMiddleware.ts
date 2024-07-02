import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateRequestData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors
          .map((issue: any) => issue.message)
          .join(", ");
        res.status(400).json({ error: errorMessages });
        return;
      }

      res.status(500).json({ error: "Internal Server Error!" });
      next(err);
    }
  };
}
