export interface IdentifyRequestBody {
  email?: string;
  phoneNumber?: string;
}

export interface IdentifyResponseBody {
  contact: {
    primaryContactId: string;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: string[];
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
  error?: string | string[];
}
