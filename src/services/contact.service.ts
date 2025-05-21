import mongoose from "mongoose";
import { ContactRepository } from "../repositories/contact.repository";
import { logger } from "../utils/logger";
import { IContact } from "../models/contact.model";

interface IdentifyResponse {
  primaryContactId: string;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: string[];
}

export class ContactService {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async identifyAndConsolidate(
    email?: string,
    phoneNumber?: string
  ): Promise<IdentifyResponse> {
    try {
      const allMatchingContacts =
        await this.contactRepository.findAllContactsByEmailOrPhone(
          email,
          phoneNumber
        );

      if (allMatchingContacts.length === 0) {
        logger.info("No existing contacts found, creating new primary contact");
        const newContact = await this.contactRepository.createContact({
          email,
          phoneNumber,
          linkPrecedence: "primary",
        });

        return this.formatResponse(newContact);
      }

      const sortedContacts = [...allMatchingContacts].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );

      const oldestContact = sortedContacts[0];

      let primaryContact: IContact;
      if (
        oldestContact.linkPrecedence === "secondary" &&
        oldestContact.linkedId
      ) {
        const foundPrimary =
          await this.contactRepository.findPrimaryContactById(
            oldestContact.linkedId
          );
        if (!foundPrimary) {
          throw new Error("Primary contact not found for secondary contact");
        }
        primaryContact = foundPrimary;
      } else {
        primaryContact = oldestContact;
      }

      const existingEmail = sortedContacts.some((c) => c.email === email);
      const existingPhone = sortedContacts.some(
        (c) => c.phoneNumber === phoneNumber
      );

      if ((email && !existingEmail) || (phoneNumber && !existingPhone)) {
        logger.info(
          "New contact information found, creating secondary contact"
        );

        await this.contactRepository.createContact({
          email: !existingEmail ? email : undefined,
          phoneNumber: !existingPhone ? phoneNumber : undefined,
          linkedId: primaryContact._id,
          linkPrecedence: "secondary",
        });
      }

      for (const contact of sortedContacts) {
        if (contact._id.equals(primaryContact._id)) continue;

        if (contact.linkPrecedence === "primary") {
          logger.info(
            `Converting contact ${contact._id} from primary to secondary`
          );
          await this.contactRepository.updateToSecondary(
            contact._id,
            primaryContact._id
          );
        } else if (
          contact.linkedId &&
          !contact.linkedId.equals(primaryContact._id)
        ) {
          logger.info(
            `Updating secondary contact ${contact._id} to link to correct primary`
          );
          await this.contactRepository.updateToSecondary(
            contact._id,
            primaryContact._id
          );
        }
      }

      const allLinkedContacts = await this.contactRepository.findLinkedContacts(
        primaryContact._id
      );

      return this.formatConsolidatedResponse(primaryContact, allLinkedContacts);
    } catch (error) {
      logger.error("Error in identifyAndConsolidate:", error);
      throw error;
    }
  }

  private formatResponse(contact: IContact): IdentifyResponse {
    const emails = contact.email ? [contact.email] : [];
    const phoneNumbers = contact.phoneNumber ? [contact.phoneNumber] : [];

    return {
      primaryContactId: contact._id.toString(),
      emails,
      phoneNumbers,
      secondaryContactIds: [],
    };
  }

  private formatConsolidatedResponse(
    primaryContact: IContact,
    secondaryContacts: IContact[]
  ): IdentifyResponse {
    const emails = primaryContact.email ? [primaryContact.email] : [];
    const phoneNumbers = primaryContact.phoneNumber
      ? [primaryContact.phoneNumber]
      : [];
    const secondaryContactIds: string[] = [];

    for (const contact of secondaryContacts) {
      secondaryContactIds.push(contact._id.toString());

      if (contact.email && !emails.includes(contact.email)) {
        emails.push(contact.email);
      }

      if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) {
        phoneNumbers.push(contact.phoneNumber);
      }
    }

    return {
      primaryContactId: primaryContact._id.toString(),
      emails,
      phoneNumbers,
      secondaryContactIds,
    };
  }
}
