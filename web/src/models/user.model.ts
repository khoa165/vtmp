import mongoose, { Document } from 'mongoose';
import { UserRole } from '@/types/enums';

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  role: UserRole;
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
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
