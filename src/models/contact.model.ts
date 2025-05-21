import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  phoneNumber?: string;
  email?: string;
  linkedId?: mongoose.Types.ObjectId;
  linkPrecedence: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ContactSchema: Schema = new Schema(
  {
    phoneNumber: {
      type: String,
      index: true,
      sparse: true,
    },
    email: {
      type: String,
      index: true,
      sparse: true,
    },
    linkedId: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      index: true,
      sparse: true,
    },
    linkPrecedence: {
      type: String,
      enum: ["primary", "secondary"],
      required: true,
      default: "primary",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index(
  { email: 1, phoneNumber: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      deletedAt: null,
    },
  }
);

export const Contact = mongoose.model<IContact>("Contact", ContactSchema);
