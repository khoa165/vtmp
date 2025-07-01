import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/base/button';
import { Calendar } from '@/components/base/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/base/popover';
import { Label } from '@/components/base/label';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  label = 'Select date',
  value,
  onChange,
  placeholder = 'Select date',
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {value ? format(value, 'PPP') : placeholder}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
