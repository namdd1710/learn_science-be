import { Schema } from "mongoose";

const RecordInfoSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: ForeignKeySchema, required: true },
  updatedBy: { type: ForeignKeySchema, required: true },
});

export default RecordInfoSchema;