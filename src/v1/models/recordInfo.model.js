import { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";

const RecordInfoSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: ForeignKeySchema, required: true },
  updatedBy: { type: ForeignKeySchema, required: true },
});

export default RecordInfoSchema;