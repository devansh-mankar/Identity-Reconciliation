import mongoose from "mongoose";
import { Contact, IContact } from "../models/contact.model";
import { logger } from "../utils/logger";

export class ContactRepository {
  async findContactByEmailOrPhone(
    email?: string,
    phoneNumber?: string
  ): Promise<IContact | null> {
    try {
      const query: any = {};

      if (email) query.email = email;
      if (phoneNumber) query.phoneNumber = phoneNumber;

      return await Contact.findOne(query);
    } catch (error) {
      logger.error("Error finding contact:", error);
      throw error;
    }
  }

  async findPrimaryContactById(
    id: mongoose.Types.ObjectId
  ): Promise<IContact | null> {
    try {
      return await Contact.findOne({
        _id: id,
        linkPrecedence: "primary",
      });
    } catch (error) {
      logger.error("Error finding primary contact:", error);
      throw error;
    }
  }

  async findLinkedContacts(
    primaryId: mongoose.Types.ObjectId
  ): Promise<IContact[]> {
    try {
      return await Contact.find({
        linkedId: primaryId,
        linkPrecedence: "secondary",
      });
    } catch (error) {
      logger.error("Error finding linked contacts:", error);
      throw error;
    }
  }

  async findPrimaryContactsByEmailOrPhone(
    email?: string,
    phoneNumber?: string
  ): Promise<IContact[]> {
    try {
      const query: any = { linkPrecedence: "primary" };
      const conditions = [];

      if (email) conditions.push({ email });
      if (phoneNumber) conditions.push({ phoneNumber });

      if (conditions.length > 0) {
        query.$or = conditions;
      }

      return await Contact.find(query);
    } catch (error) {
      logger.error("Error finding primary contacts:", error);
      throw error;
    }
  }

  async createContact(contactData: Partial<IContact>): Promise<IContact> {
    try {
      const contact = new Contact(contactData);
      return await contact.save();
    } catch (error) {
      logger.error("Error creating contact:", error);
      throw error;
    }
  }

  async updateToSecondary(
    contactId: mongoose.Types.ObjectId,
    primaryId: mongoose.Types.ObjectId
  ): Promise<IContact | null> {
    try {
      return await Contact.findByIdAndUpdate(
        contactId,
        {
          linkPrecedence: "secondary",
          linkedId: primaryId,
        },
        { new: true }
      );
    } catch (error) {
      logger.error("Error updating contact to secondary:", error);
      throw error;
    }
  }

  async findAllContactsByEmailOrPhone(
    email?: string,
    phoneNumber?: string
  ): Promise<IContact[]> {
    try {
      const query: any = {};
      const conditions = [];

      if (email) conditions.push({ email });
      if (phoneNumber) conditions.push({ phoneNumber });

      if (conditions.length > 0) {
        query.$or = conditions;
      }

      return await Contact.find(query).sort({ createdAt: 1 });
    } catch (error) {
      logger.error("Error finding contacts by email or phone:", error);
      throw error;
    }
  }
}
