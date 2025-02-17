import mongoose, { Schema } from "mongoose";

const ForeignKeySchema = new Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "refModel" },
    name: { type: String, required: true },
    refModel: { type: String, required: true } // Xác định model cần tham chiếu
  },
  { _id: false }
);

export default ForeignKeySchema;
