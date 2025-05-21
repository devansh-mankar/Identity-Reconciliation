import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/contact.service";
import { logger } from "../utils/logger";

export const identifyContact = async (
  req: Request,
  res: Response,
  NextFunction: any
) => {
  try {
    const { email, phoneNumber } = req.body;

    logger.info(
      `Identifying contact with email: ${email}, phone: ${phoneNumber}`
    );

    const contactService = new ContactService();
    const result = await contactService.identifyAndConsolidate(
      email,
      phoneNumber
    );

    return res.status(200).json({ contact: result });
  } catch (error: any) {
    logger.error("Error identifying contact:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error identifying contact",
      error: error.message,
    });
  }
};
