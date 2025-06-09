import {
  InterviewData,
  interviewFormSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { MultiSelect } from '@/components/base/multi-select';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { format } from 'date-fns';
import { formatInterviewStatus } from '@/utils/helpers';
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

  const interviewForm = useForm<z.infer<typeof interviewFormSchema>>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      types: types,
      status: status,
      interviewOnDate: interviewOnDate,
      note: note,
    },
  });

  return (
    <div className="rounded-xl bg-background border border-background p-4 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3 ">
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
                    Referer
                  </FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-10 rounded-lg p-2 border border-input px-3 py-2 text-sm shadow-sm">
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
                              value={formatInterviewStatus(
                                dropdownStatus
                              ).toString()}
                            >
                              {formatInterviewStatus(dropdownStatus)}
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
                          ? format(new Date(field.value), 'yyyy-MM-dd')
                          : ''
                      }
                      placeholder="Date of interview"
                      type="date"
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input px-3 py-2 text-sm shadow-sm focus:outline-none"
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
          <Button
            variant="default"
            onClick={() =>
              updateInterviewFn({
                interviewId: interviewId,
                body: {
                  ...interviewForm.getValues(),
                },
              })
            }
          >
            Save Interview
          </Button>
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
      types: string[];
      status: string;
      note?: string;
    };
  }) => void;
  setShowCreateForm;
}) => {
  const interviewForm = useForm<z.infer<typeof interviewFormSchema>>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      status: InterviewStatus.PENDING,
      interviewOnDate: new Date(),
      note: '',
    },
  });

  return (
    <div className="rounded-xl bg-background border border-background p-4 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3 ">
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
                        <SelectTrigger className="w-full h-10 rounded-lg p-2 border border-input px-3 py-2 text-sm shadow-sm">
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
                                value={formatInterviewStatus(
                                  dropdownStatus
                                ).toString()}
                              >
                                {formatInterviewStatus(dropdownStatus)}
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
                      className="w-full h-10 rounded-lg border border-input px-3 py-2 text-sm shadow-sm focus:outline-none"
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
          <Button
            variant="default"
            onClick={() => {
              createInterviewFn({
                body: {
                  ...interviewForm.getValues(),
                  applicationId,
                },
              });
              setShowCreateForm(false);
            }}
          >
            Save Interview
          </Button>
        </div>
      </Form>
    </div>
  );
};
