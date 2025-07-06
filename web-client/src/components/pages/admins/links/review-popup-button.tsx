import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

import { JobFunction, JobType, LinkRegion } from '@vtmp/common/constants';

import { Button } from '@/components/base/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/dialog';
import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { Textarea } from '@/components/base/textarea';
import { ReviewPopupInput } from '@/components/pages/admins/links/review-popup-input';
import { JobPostingData } from '@/components/pages/admins/links/validation';

import { ReviewPopupSelect } from './review-popup-select';

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
    jobFunction,
    jobType,
    datePosted,
    jobDescription,
  } = currentLink;

  const [reviewForm, setReviewForm] = useState<JobPostingData>({
    companyName: companyName ?? '',
    jobTitle: jobTitle ?? '',
    location: location ?? LinkRegion.UNKNOWN,
    jobFunction: jobFunction ?? JobFunction.UNKNOWN,
    jobType: jobType ?? JobType.UNKNOWN,
    datePosted: format(
      new Date(datePosted ? datePosted : new Date()),
      'MM/dd/yyyy'
    ),
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
    if (reviewForm.adminNote?.trim() === '') {
      toast.error('Please give the reason for rejection.');
      return;
    }
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

        <div className="flex flex-col items-start gap-2 w-full">
          <Label htmlFor="link" className="sr-only">
            Url
          </Label>
          <Input id="link" defaultValue={url} readOnly />
        </div>
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
          <ReviewPopupSelect
            label="Location"
            fieldInForm="location"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="location"
            fieldEnum={LinkRegion}
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

        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupSelect
            label="Job Function"
            fieldInForm="jobFunction"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="job-function"
            fieldEnum={JobFunction}
          />
          <ReviewPopupSelect
            label="Job Type"
            fieldInForm="jobType"
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            id="job-type"
            fieldEnum={JobType}
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

        <DialogFooter className="flex justify-center gap-4 w-full">
          <Button
            variant="outline"
            onClick={handleApprove}
            className="cursor-pointer text-vtmp-mint"
          >
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            className="cursor-pointer text-vtmp-orange"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
