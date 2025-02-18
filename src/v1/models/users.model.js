import { createHmac } from 'crypto';
import mongoose, { Schema } from "mongoose";

const secretKey = process.env.SECRETKEY

const UsersModel = new Schema(
  {
    fullName: {
      type: String,
      // required: true
    },
    userName: {
      type: String,
      // required: true
    },
    email: {
      type: String,
      // required: true
    },
    phone: {
      type: String,
      // required: true
    },
    image: {
      type: String,
      // required: true
    },
    address: {
      type: String,
      // required: true
    },
    password: {
      type: String,
      // required: true
    },
    status: { 
      type: Number, 
      default: 0
    },
    roles: { 
      type: [String],
      // required: true
    },
    gradeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'grades',
    },
    createdAt: { 
      type: Date, 
      default: Date.now()
    }
  },
  { timestamps: true }
);

UsersModel.pre('save', function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hmac = createHmac('sha256', secretKey);
    
    this.password = hmac.update(this.password).digest('hex');
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("users", UsersModel);
