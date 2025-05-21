import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateIdentifyRequest = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Must provide a valid email address"),

  body("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Must provide a valid phone number"),

  body().custom((body) => {
    if (!body.email && !body.phoneNumber) {
      throw new Error("Either email or phoneNumber must be provided");
    }
    return true;
  }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: errors.array(),
      });
    }

    next();
  },
];
