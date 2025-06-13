import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/base/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/dialog';
import { Label } from '@/components/base/label';
import { Textarea } from '@/components/base/textarea';
import { ReviewPopupInput } from '@/components/pages/admins/links/review-popup-input';
import { JobPostingRegion } from '@vtmp/common/constants';
import { JobPostingData } from '@/components/pages/admins/links/validation';

interface ReviewPopupButtonProps {
  currentLink: {
    _id: string;
  } & JobPostingData;
  approveLinkFn: ({
    linkId,
    newUpdate,
  }: {
    linkId: string;
    newUpdate: JobPostingData;
  }) => void;
  rejectLinkFn: ({ linkId }: { linkId: string }) => void;
}

export const ReviewPopupButton = ({
  currentLink,
  approveLinkFn,
  rejectLinkFn,
}: ReviewPopupButtonProps) => {
  const {
    _id: linkId,
    url,
    companyName,
    jobTitle,
    location,
    datePosted,
    jobDescription,
  } = currentLink;
  const [reviewForm, setReviewForm] = useState<JobPostingData>({
    url: url ?? '',
    companyName: companyName ?? '',
    jobTitle: jobTitle ?? '',
    location: location ?? JobPostingRegion.US,
    datePosted: datePosted ? format(new Date(datePosted), 'MM/dd/yyyy') : '',
    jobDescription: jobDescription ?? '',
    adminNote: '',
  });
  const handleApprove = () => {
    approveLinkFn({
      linkId,
      newUpdate: reviewForm,
    });
  };

  const handleReject = () => {
    rejectLinkFn({ linkId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-white cursor-pointer">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Review Link Submission
          </DialogTitle>
        </DialogHeader>

        <ReviewPopupInput
          label="URL"
          placeHolder="URL"
          fieldInForm="url"
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          id="url"
        />

        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput
            label="Job Title"
            placeHolder="Job Title"
            fieldInForm="jobTitle"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="job-title"
          />
          <ReviewPopupInput
            label="Company Name"
            placeHolder="Company Name"
            fieldInForm="companyName"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="company-name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput
            label="Country"
            placeHolder="US/CANADA"
            fieldInForm="location"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="country"
          />
          <ReviewPopupInput
            label="Date Posted"
            placeHolder="MM/dd/yyyy"
            fieldInForm="datePosted"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="date-posted"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Type job description here."
            value={reviewForm.jobDescription}
            onChange={(e) =>
              setReviewForm(() => ({
                ...reviewForm,
                jobDescription: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="admin-note">Admin Note</Label>
          <Textarea
            id="admin-note"
            placeholder="Type your message here."
            value={reviewForm.adminNote}
            onChange={(e) =>
              setReviewForm(() => ({
                ...reviewForm,
                adminNote: e.target.value,
              }))
            }
          />
        </div>

        <DialogFooter className="flex-row justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            onClick={handleApprove}
            className="cursor-pointer"
          >
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            className="cursor-pointer"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
