import mongoose, { Document, Types } from 'mongoose';
import { UserRole } from '@vtmp/common/constants';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  role: UserRole;
  deletedAt?: Date;
  passwordChangedAt?: Date;
  
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    deletedAt: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
