import mongoose from 'mongoose';

export const getNewMongoId = () => new mongoose.Types.ObjectId().toHexString();
export const getNewObjectId = () => new mongoose.Types.ObjectId();
