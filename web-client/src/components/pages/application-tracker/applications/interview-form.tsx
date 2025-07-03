import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Save, Share2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/base/form';
import { Input } from '@/components/base/input';
import { MultiSelect } from '@/components/base/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/base/select';
import { Textarea } from '@/components/base/textarea';
import {
  InterviewData,
  InterviewFormSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { interviewTypeOptions } from '@/utils/helpers';

export const InterviewForm = ({
  currentInterview,
  createInterviewFn,
  updateInterviewFn,
  shareInterviewFn,
  unshareInterviewFn,
  deleteInterviewFn,
  applicationId,
}: {
  currentInterview?: {
    _id: string;
  } & InterviewData;
  createInterviewFn: ({
    body,
  }: {
    body: {
      applicationId: string;
      interviewOnDate: Date;
      types: InterviewType[];
      status: InterviewStatus;
      note?: string;
    };
  }) => void;
  updateInterviewFn: ({
    interviewId,
    body,
  }: {
    interviewId: string;
    body: InterviewData;
  }) => void;
  shareInterviewFn: ({
    interviewId,
    body,
  }: {
    interviewId: string;
    body: {
      isDisclosed: boolean;
    };
  }) => void;
  applicationId: string;
  unshareInterviewFn: ({ interviewId }: { interviewId: string }) => void;
  deleteInterviewFn: (interviewId: string) => void;
}) => {
  const interviewForm = useForm<z.infer<typeof InterviewFormSchema>>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      types: currentInterview?.types ?? [],
      status: currentInterview?.status ?? InterviewStatus.PENDING,
      interviewOnDate: currentInterview?.interviewOnDate ?? new Date(),
      note: currentInterview?.note ?? '',
    },
  });

  return (
    <div className="rounded-xl bg-background border border-background p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3">
      <Form {...interviewForm}>
        <div>
          <FormField
            control={interviewForm.control}
            name="types"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interview Types
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    {...field}
                    selected={field.value.map((type: InterviewType) => ({
                      label: type.toString(),
                      value: type,
                    }))}
                    placeholder="Types"
                    options={interviewTypeOptions}
                    onChange={(options) =>
                      field.onChange(options.map((opt) => opt.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <FormField
              control={interviewForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Interview Status
                  </FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full rounded-lg border border-input text-sm shadow-sm">
                        <span>{field.value}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(InterviewStatus)
                          .filter(
                            (value) => value !== interviewForm.watch('status')
                          )
                          .map((dropdownStatus, index) => (
                            <SelectItem key={index} value={dropdownStatus}>
                              {dropdownStatus}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1">
            <FormField
              control={interviewForm.control}
              name="interviewOnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Interview Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={new Date(field.value).toISOString().split('T')[0]}
                      placeholder="Date of interview"
                      type="date"
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      className="w-full rounded-lg border border-input text-sm shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <FormField
            control={interviewForm.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Note
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Add interview note" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {currentInterview ? (
          <div className="flex justify-between pt-2 px-1">
            <Button
              type="button"
              className="flex items-center h-7.5 gap-1.5 rounded-sm border border-orange-300 px-4 text-xs text-orange-300 bg-background hover:bg-background hover:text-orange-400 hover:border-orange-400 transition"
              variant="secondary"
              onClick={() => deleteInterviewFn(currentInterview?._id)}
            >
              <Trash2 className="scale-85" />
              Delete
            </Button>
            <div className="flex items-center gap-2">
              <InterviewSharingButton
                interviewId={currentInterview?._id}
                shareInterviewFn={shareInterviewFn}
                unshareInterviewFn={unshareInterviewFn}
                sharedAt={currentInterview?.sharedAt}
                isDisclosed={currentInterview?.isDisclosed}
              />
              <Button
                type="submit"
                onClick={() =>
                  updateInterviewFn({
                    interviewId: currentInterview?._id,
                    body: {
                      ...interviewForm.getValues(),
                    },
                  })
                }
                className="flex items-center h-7.5 gap-1.5 rounded-sm border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition"
              >
                <Save className="scale-85" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end pt-2 pr-1">
            <Button
              type="submit"
              onClick={() => {
                createInterviewFn({
                  body: {
                    ...interviewForm.getValues(),
                    applicationId,
                  },
                });
              }}
              className="h-7.5 gap-1.5 rounded-sm border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition"
            >
              <Save className="scale-85" />
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

const InterviewSharingButton = ({
  interviewId,
  shareInterviewFn,
  unshareInterviewFn,
  sharedAt,
  isDisclosed,
}: {
  interviewId: string;
  shareInterviewFn: (params: {
    interviewId: string;
    body: { isDisclosed: boolean };
  }) => void;
  unshareInterviewFn: ({ interviewId }: { interviewId: string }) => void;
  sharedAt?: Date;
  isDisclosed?: boolean;
}) => {
  const getShareLabel = (sharedAt?: Date, isDisclosed?: boolean) => {
    if (!sharedAt) return 'Share Interview';
    if (isDisclosed === false) return 'Shared Publicly';
    if (isDisclosed === true) return 'Shared Anonymously';
    return 'Share Interview';
  };

  const shareOptions = [
    {
      label: 'Publish publicly',
      shouldShow: !sharedAt || isDisclosed === true,
      onClick: () =>
        shareInterviewFn({ interviewId, body: { isDisclosed: false } }),
    },
    {
      label: 'Publish anonymously',
      shouldShow: !sharedAt || isDisclosed === false,
      onClick: () =>
        shareInterviewFn({ interviewId, body: { isDisclosed: true } }),
    },
    {
      label: 'Unshare',
      shouldShow: !!sharedAt,
      onClick: () => {
        unshareInterviewFn({ interviewId });
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-7.5 gap-1.5 rounded-sm border border-green-400 px-4 text-xs text-green-400 bg-background hover:bg-background hover:border-green-600 hover:text-green-600 transition">
          {sharedAt ? (
            <Check className="scale-90" />
          ) : (
            <Share2 className="scale-90" />
          )}
          {getShareLabel(sharedAt, isDisclosed)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {shareOptions
          .filter((opt) => opt.shouldShow)
          .map((opt, i) => (
            <DropdownMenuItem key={i} className="text-xs" onClick={opt.onClick}>
              {opt.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
