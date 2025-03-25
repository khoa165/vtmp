import mongoose from 'mongoose';

enum LinkStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

interface ILink extends Document {
  url: String;
  status: LinkStatus;
  submittedBy: Date;
  companyName?: String;
  userNote? : string;
}

const LinkSchema = new mongoose.Schema<ILink>(
  {
    url: { 
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: Object.values(LinkStatus),
        default: LinkStatus.PENDING
    },
    submittedBy: { 
        type: Date,
        required: true
    },
    companyName: {
        type: String,
        default: null
    },
    userNote: {
      type: String,
      default : null
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILink>('Link', LinkSchema);


