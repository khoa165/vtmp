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
import ReviewPopupInput from '@/components/pages/admins/dashboard/review-popup-input';
import { JobPostingRegion } from '@vtmp/common/constants';
import { JobPostingData } from '@/components/pages/admins/dashboard/validation';

interface ReviewPopupButtonProps {
  currentLink: {
    _id: string;
  } & JobPostingData;
  approveDashBoardLinkFn: ({
    linkId,
    newUpdate,
  }: {
    linkId: string;
    newUpdate: JobPostingData;
  }) => void;
  rejectDashBoardLinkFn: ({ linkId }: { linkId: string }) => void;
}

export const ReviewPopupButton = ({
  currentLink,
  approveDashBoardLinkFn,
  rejectDashBoardLinkFn,
}: ReviewPopupButtonProps) => {
  const {
    _id: linkId,
    url = '',
    companyName = '',
    jobTitle = '',
    location = JobPostingRegion.US,
    datePosted,
    jobDescription = '',
  } = currentLink;

  const [urlValue, setUrl] = useState<string>(url);
  const [companyNameValue, setCompanyNameValue] = useState<string>(companyName);
  const [jobTitleValue, setJobTitleValue] = useState<string>(jobTitle);
  const [currentCountry, setCurrentCountry] = useState<string>(location);
  const [datePostedValue, setDatePostedValue] = useState<string>(
    datePosted ? format(new Date(datePosted), 'MM/dd/yyyy') : ''
  );
  const [jobDescriptionValue, setJobDescriptionValue] =
    useState<string>(jobDescription);

  const handleApprove = () => {
    approveDashBoardLinkFn({
      linkId,
      newUpdate: {
        url: urlValue,
        companyName: companyNameValue,
        jobTitle: jobTitleValue,
        location: currentCountry,
        datePosted: datePostedValue,
        jobDescription: jobDescriptionValue,
      },
    });
  };

  const handleReject = () => {
    rejectDashBoardLinkFn({ linkId });
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
          value={urlValue}
          setValue={setUrl}
          id="url"
        />

        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput
            label="Job Title"
            placeHolder="Job Title"
            value={jobTitleValue}
            setValue={setJobTitleValue}
            id="job-title"
          />
          <ReviewPopupInput
            label="Company Name"
            placeHolder="Company Name"
            value={companyNameValue}
            setValue={setCompanyNameValue}
            id="company-name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput
            label="Country"
            placeHolder="US/CANADA"
            value={currentCountry}
            setValue={setCurrentCountry}
            id="country"
          />
          <ReviewPopupInput
            label="Date Posted"
            placeHolder="MM/dd/yyyy"
            value={datePostedValue}
            setValue={setDatePostedValue}
            id="date-posted"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Type job description here."
            value={jobDescriptionValue}
            onChange={(e) => setJobDescriptionValue(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="admin-note">Admin Note</Label>
          <Textarea id="admin-note" placeholder="Type your message here." />
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
