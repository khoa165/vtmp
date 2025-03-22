import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  appRecord: { ref: 'AppRecord' },
  interviewType: {
    type: String,
    enum: [
      'Online Assessment',
      'Phone Screen',
      'Behavior',
      'Technical',
      'Other',
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ['Incoming', 'Waiting', 'Declined', 'Passed'],
    required: true,
  },
  interviewDate: { type: Date },
  interviewNote: { type: String },
});

export default mongoose.model('Interview', InterviewSchema);
