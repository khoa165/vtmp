import {
  InterviewData,
  InterviewFormSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { MultiSelect } from '@/components/base/multi-select';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/base/select';
import { Input } from '@/components/base/input';
import { Textarea } from '@/components/base/textarea';
import { Button } from '@/components/base/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/base/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DATE_MONTH_YEAR } from '@/utils/date';
import { capitalize } from 'remeda';
import { Save, Trash2 } from 'lucide-react';

const interviewTypeOptions = Object.values(InterviewType).map((type) => ({
  label: type.toString(),
  value: type,
}));

export const InterviewUpdateForm = ({
  currentInterview,
  updateInterviewFn,
}: {
  currentInterview: {
    _id: string;
  } & InterviewData;
  updateInterviewFn: ({
    interviewId,
    body,
  }: {
    interviewId: string;
    body: InterviewData;
  }) => void;
}) => {
  const {
    _id: interviewId,
    types,
    status,
    interviewOnDate,
    note,
  } = currentInterview;

  const interviewForm = useForm<z.infer<typeof InterviewFormSchema>>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      types: types,
      status: status,
      interviewOnDate: interviewOnDate,
      note: note,
    },
  });

  return (
    <div className="rounded-xl bg-background border border-background p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3 ">
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
                            <SelectItem
                              key={index}
                              value={capitalize(dropdownStatus)}
                            >
                              {capitalize(dropdownStatus)}
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
                      value={
                        field.value
                          ? format(new Date(field.value), DATE_MONTH_YEAR)
                          : ''
                      }
                      placeholder="Date of interview"
                      type="date"
                      onChange={(e) => field.onChange(e.target.value)}
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

        <div className="flex justify-end pt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              className="flex items-center h-7.5 gap-1.5 rounded-md border border-orange-300 px-4 text-xs text-orange-300 bg-background hover:bg-background hover:text-orange-400 hover:border-orange-400 transition"
              variant="secondary"
              onClick={() => interviewForm.reset()}
            >
              <Trash2 className="scale-85" />
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() =>
                updateInterviewFn({
                  interviewId: interviewId,
                  body: {
                    ...interviewForm.getValues(),
                  },
                })
              }
              className="h-7.5 gap-1.5 rounded-md border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition"
            >
              <Save className="scale-85" />
              Save
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export const InterviewCreateForm = ({
  applicationId,
  createInterviewFn,
  setShowCreateForm,
}: {
  applicationId: string;
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
  setShowCreateForm: (value: boolean) => void;
}) => {
  const interviewForm = useForm<z.infer<typeof InterviewFormSchema>>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      types: [],
      status: InterviewStatus.PENDING,
      interviewOnDate: new Date(),
      note: '',
    },
  });

  return (
    <div className="rounded-xl bg-neutral-700 border border-background p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3">
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
                    selected={(field.value ?? []).map(
                      (type: InterviewType) => ({
                        label: type.toString(),
                        value: type,
                      })
                    )}
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
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full rounded-lg p-2 border border-input px-3 py-2 text-sm shadow-sm">
                          <span>{field.value}</span>
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          {Object.values(InterviewStatus)
                            .filter(
                              (value) => value !== interviewForm.watch('status')
                            )
                            .map((dropdownStatus, index) => (
                              <SelectItem
                                key={index}
                                value={capitalize(dropdownStatus)}
                              >
                                {capitalize(dropdownStatus)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                      value={
                        field.value
                          ? format(new Date(field.value), 'yyyy-MM-dd')
                          : ''
                      }
                      placeholder="Date of interview"
                      type="date"
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm shadow-sm focus:outline-none"
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

        <div className="flex justify-end pt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              className="flex items-center h-7.5 gap-1.5 rounded-md border border-orange-300 px-4 text-xs text-orange-300 bg-background hover:bg-background hover:text-orange-400 hover:border-orange-400 transition"
              variant="secondary"
              onClick={() => setShowCreateForm(false)}
            >
              <Trash2 className="scale-85" />
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                createInterviewFn({
                  body: {
                    ...interviewForm.getValues(),
                    applicationId,
                  },
                });
                setShowCreateForm(false);
              }}
              className="h-7.5 gap-1.5 rounded-md border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition"
            >
              <Save className="scale-85" />
              Save
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};
