import mongoose, { Schema } from "mongoose";

const ForeignKeySchema = new Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, refPath: "refModel" },
    name: { type: String },
    refModel: { type: String } // Xác định model cần tham chiếu
  },
  { _id: false }
);

export default ForeignKeySchema;
