import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
const ReviewPopupInput = ({ label, placeHolder }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor="username" className="text-right">
        {label}
      </Label>
      <Input id="username" className="col-span-3" placeholder={placeHolder} />
    </div>
  );
};

export default ReviewPopupInput;
