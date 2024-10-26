import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  sessionId: [{ sessionId: string }];
  tasks: mongoose.Types.ObjectId[];
  role: "admin" | "user";
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionId: [{ type: Schema.Types.ObjectId, ref: "Session" }],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

export default mongoose.model<IUser>("User", userSchema);
