import mongoose, { Document } from 'mongoose';

export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  role: Role;
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
      enum: Object.values(Role),
      default: Role.USER,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
