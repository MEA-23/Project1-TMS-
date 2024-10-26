import { Document, Schema, model } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  userId: string;
  location: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
}

const sessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  location: { type: String },
  ipAddress: { type: String },
  browser: { type: String },
  os: { type: String },
  device: { type: String },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    expires: "7d",
  },
});

export default model<ISession>("Session", sessionSchema);
