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
import ReviewPopupInput from '@/components/pages/admins/dashboard/review-popup-input';
import { Textarea } from '@/components/base/textarea';
import { useState } from 'react';
import { parse } from 'date-fns';

export const ReviewPopupButton = ({
  linkId,
  url,
  companyName,
  jobTitle,
  location,
  datePosted,
  jobDescription,
  approveDashBoardLinkFn,
  rejectDashBoardLinkFn,
}) => {
  const [jobDescriptionValue, setJobDescriptionValue] =
    useState(jobDescription);
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <Button variant="outline" className="cursor-pointer text-white">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit text-white border-none">
        <DialogHeader>
          <DialogTitle>Review Link Submission</DialogTitle>
        </DialogHeader>
        <ReviewPopupInput label={'URL'} placeHolder={'URL'} value={url} />
        <ReviewPopupInput
          label={'Submitted By'}
          placeHolder={'Username'}
          value={'username'}
        />
        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput
            label={'Job Title'}
            placeHolder={'Job Title'}
            value={jobTitle}
          />
          <ReviewPopupInput
            label={'Company Name'}
            placeHolder={'Company Name'}
            value={companyName}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput
            label={'Location'}
            placeHolder={'Location'}
            value={location}
          />
          <ReviewPopupInput
            label={'Date Posted'}
            placeHolder={'MM/dd/yyyy'}
            value={datePosted}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="username" className="text-right">
            Job Description
          </Label>
          <Textarea
            placeholder="Type job description here."
            value={jobDescriptionValue}
            onChange={(e) => {
              setJobDescriptionValue(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="username" className="text-right">
            Admin Note
          </Label>
          <Textarea placeholder="Type your message here." />
        </div>

        <DialogFooter className="flex-row justify-center items-center gap-4">
          <Button
            type="submit"
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              const newUpdate = {
                jobDescription: jobDescriptionValue,
                url: url,
                companyName: companyName,
                jobTitle: jobTitle,
                location: location,
                datePosted: parse(datePosted, 'MM/dd/yyyy', new Date()),
              };
              approveDashBoardLinkFn({ linkId, newUpdate });
            }}
          >
            Approve
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="cursor-pointer"
            onClick={() => rejectDashBoardLinkFn({ linkId })}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
