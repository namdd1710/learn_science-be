import { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";

const RecordInfoSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: ForeignKeySchema,  },
  updatedBy: { type: ForeignKeySchema, },
},{ _id: false });

export default RecordInfoSchema;