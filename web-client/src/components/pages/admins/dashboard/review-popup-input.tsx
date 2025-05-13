import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
const ReviewPopupInput = ({ label, placeHolder, setValue, value }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor="username" className="text-right">
        {label}
      </Label>
      <Input
        id="username"
        className="col-span-3"
        placeholder={placeHolder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        required
      />
    </div>
  );
};

export default ReviewPopupInput;
