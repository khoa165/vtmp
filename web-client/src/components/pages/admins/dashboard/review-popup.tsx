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

export const ReviewPopupButton = () => {
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
        <ReviewPopupInput label={'URL'} placeHolder={'URL'} />
        <ReviewPopupInput label={'Submitted By'} placeHolder={'Username'} />
        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput label={'Job Title'} placeHolder={'Job Title'} />
          <ReviewPopupInput
            label={'Company Name'}
            placeHolder={'Company Name'}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ReviewPopupInput label={'Location'} placeHolder={'Location'} />
          <ReviewPopupInput label={'Date Posted'} placeHolder={'Date'} />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="username" className="text-right">
            Job Description
          </Label>
          <Textarea placeholder="Type job description here." />
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="username" className="text-right">
            Admin Note
          </Label>
          <Textarea placeholder="Type your message here." />
        </div>

        <DialogFooter className="flex-row justify-center items-center gap-4">
          <Button type="submit" variant="outline" className="cursor-pointer">
            Approve
          </Button>
          <Button type="submit" variant="outline" className="cursor-pointer">
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
