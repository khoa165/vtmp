import mongoose, { Document, Types, Schema } from 'mongoose';

export interface IFavorite extends Document {
  _id: Types.ObjectId;
  jobPostingId: Types.ObjectId;
  companyName?: string;
  userId: Types.ObjectId;
  deletedAt?: Date;
}

const FavoriteSchema = new mongoose.Schema<IFavorite>({
  jobPostingId: {
    type: Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  companyName: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

export const FavoriteModel = mongoose.model<IFavorite>(
  'Favorite',
  FavoriteSchema
);
