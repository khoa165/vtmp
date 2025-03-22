import mongoose from 'mongoose';

const appRecordSchema = new mongoose.Schema({
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['submitted', 'not submitted', 'interview', 'offer received'],
    required: true,
  },
  note: {
    type: String,
  },
  appliedDate: {
    type: Date,
  },
});

export default mongoose.model('AppRecord', appRecordSchema);
