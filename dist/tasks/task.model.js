import mongoose, { Schema } from "mongoose";
const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("Task", taskSchema);
