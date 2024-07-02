import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    `${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  res.status(500).json({
    status: "error",
    message: err.message,
  });
}
