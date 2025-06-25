import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { JobPostingData } from '@/components/pages/admins/links/validation';

type FieldInForms =
  | 'companyName'
  | 'jobTitle'
  | 'location'
  | 'datePosted'
  | 'jobDescription';
interface ReviewPopupInputProps {
  label: string;
  placeHolder: string;
  fieldInForm: FieldInForms;
  reviewForm: JobPostingData;
  setReviewForm: React.Dispatch<React.SetStateAction<JobPostingData>>;
  id: string;
}

export const ReviewPopupInput = ({
  label,
  placeHolder,
  reviewForm,
  fieldInForm,
  setReviewForm,
  id,
}: ReviewPopupInputProps) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        className="col-span-3"
        placeholder={placeHolder}
        value={reviewForm[fieldInForm]}
        onChange={({ target }) =>
          setReviewForm(() => ({ ...reviewForm, [fieldInForm]: target.value }))
        }
        required
      />
    </div>
  );
};
