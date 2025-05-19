import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';

interface ReviewPopupInputProps {
  label: string;
  placeHolder: string;
  value: string;
  setValue: (value: string) => void;
  id?: string;
}

const ReviewPopupInput = ({
  label,
  placeHolder,
  value,
  setValue,
  id = 'review-input',
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
        value={value}
        onChange={({ target }) => setValue(target.value)}
        required
      />
    </div>
  );
};

export default ReviewPopupInput;
