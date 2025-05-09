import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { useState } from 'react';
const ReviewPopupInput = ({ label, placeHolder, value }) => {
  const [textValue, settextValue] = useState(value);

  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor="username" className="text-right">
        {label}
      </Label>
      <Input
        id="username"
        className="col-span-3"
        placeholder={placeHolder}
        value={textValue}
        onChange={(e) => {
          settextValue(e.target.value);
        }}
      />
    </div>
  );
};

export default ReviewPopupInput;
