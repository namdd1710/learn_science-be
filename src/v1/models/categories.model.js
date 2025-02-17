import mongoose, { Schema } from "mongoose";



const CategoriesModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      
    },
    status: { 
      type: Number, 
      default: 0,
      
    },
    createdAt: { 
      type: Date, 
      default: Date.now(),
      
    },
  },
  { timestamps: true }
);
export default mongoose.model("categories", CategoriesModel);