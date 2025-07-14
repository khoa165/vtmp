import { LinkRegion } from '@vtmp/common/constants';

import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { Label } from '@/components/base/label';
import { JobPostingData } from '@/components/pages/admins/links/validation';

type FieldInForms = 'jobFunction' | 'jobType' | 'location';
const UNKNOWN = LinkRegion.UNKNOWN;

interface ReviewPopupInputProps<T extends object> {
  label: string;
  fieldInForm: FieldInForms;
  reviewForm: JobPostingData;
  setReviewForm: React.Dispatch<React.SetStateAction<JobPostingData>>;
  id: string;
  fieldEnum: T;
}

export const ReviewPopupSelect = <T extends object>({
  label,
  reviewForm,
  fieldInForm,
  setReviewForm,
  id,
  fieldEnum,
}: ReviewPopupInputProps<T>) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id} className="w-fit">
        {label}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {reviewForm[fieldInForm]?.replace(/_/g, ' ').trim()}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-[#333333]">
          <DropdownMenuRadioGroup
            value={reviewForm[fieldInForm]}
            onValueChange={(value) => {
              setReviewForm(() => ({
                ...reviewForm,
                [fieldInForm]: value,
              }));
            }}
          >
            {Object.entries(fieldEnum).map(([key, val]) =>
              val !== UNKNOWN ? (
                <DropdownMenuRadioItem key={key} value={val}>
                  {key.replace(/_/g, ' ').trim()}
                </DropdownMenuRadioItem>
              ) : null
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
