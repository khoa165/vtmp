import mongoose, { Document } from 'mongoose';

enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  email: string;
  encryptedPassword: string;
  role: Roles;
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
    dateOfBirth: {
      type: Date,
      required: false,
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
      enum: Object.values(Roles),
      default: Roles.USER,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
