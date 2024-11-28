import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      console.log({ err });

      if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((issue) => {
          const path = issue.path.join(".");
          return `${path}: ${issue.message}`;
        });

        res.status(400).json({ errors: formattedErrors });
      } else {
        next(err);
      }
    }
  };
