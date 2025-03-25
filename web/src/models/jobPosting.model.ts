import mongoose, { Document } from "mongoose";


interface JobPosting extends Document {
    linkId: mongoose.Schema.Types.ObjectId;
    url: string;
    jobTitle: string;
    companyName: string;
    location: string;
    datePosted: Date;
    jobDesc: string;
    adminNote?: string;
    submittedBy: mongoose.Schema.Types.ObjectId;
}

const JobPostingSchema = new mongoose.Schema<JobPosting>(
    {
        linkId: {type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true},
        url: {type: String, required: true},
        jobTitle: {type: String, required: true},
        companyName: {type: String, required: true},
        location: {type: String, required: true},
        datePosted: {type: Date, required: true},
        jobDesc: {type: String, required: true},
        adminNote: {type: String},
        submittedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {timestamps : true}
);

export default mongoose.model<JobPosting>('JobPosting', JobPostingSchema);