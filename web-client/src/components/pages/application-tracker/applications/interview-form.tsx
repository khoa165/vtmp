import type { InterviewData } from '@/components/pages/application-tracker/applications/validation';
import { useState } from 'react';
import { Label } from '@/components/base/label';
import { MultiSelect } from '@/components/base/multi-select';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { format } from 'date-fns';
import { formatInterviewStatus } from '@/utils/helpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/base/select';
import { Input } from '@/components/base/input';
import { Textarea } from '@/components/base/textarea';
import { Button } from '@/components/base/button';

const interviewTypeOptions = Object.values(InterviewType).map((type) => ({
  label: type,
  value: type,
}));

export const InterviewUpdateForm = ({
  interviewId,
  currentInterview,
  updateInterviewFn,
}: {
  interviewId: string;
  currentInterview: InterviewData;
  updateInterviewFn: ({
    interviewId,
    body,
  }: {
    interviewId: string;
    body: InterviewData;
  }) => void;
}) => {
  const { types, status, interviewOnDate, note } = currentInterview;

  const [interviewForm, setInterviewForm] = useState<InterviewData>({
    types: types ?? [],
    status: status ?? '',
    interviewOnDate:
      interviewOnDate ?? format(new Date(interviewOnDate), 'MM/dd/yyyy'),
    note: note ?? '',
  });

  return (
    <div className="rounded-2xl border p-4 shadow-sm space-y-3 bg-white dark:bg-muted">
      <div>
        <Label>Interview Types</Label>
        <MultiSelect
          options={interviewTypeOptions}
          onValueChange={(value: string[]) =>
            setInterviewForm({
              ...interviewForm,
              types: value as InterviewType[],
            })
          }
          defaultValue={types}
          placeholder="Select Interview Types"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
      </div>

      <div>
        <Label>Status</Label>
        <div className="w-full p-2 border rounded-md">
          <Select
            value={status}
            onValueChange={(value: string) =>
              setInterviewForm({
                ...interviewForm,
                status: value as InterviewStatus,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(InterviewStatus)
                .filter((value) => value !== currentInterview.status)
                .map((dropdownStatus, index) => (
                  <SelectItem key={index} value={dropdownStatus}>
                    {formatInterviewStatus(dropdownStatus)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Interview Date</Label>
        <Input
          type="date"
          defaultValue={(new Date(), 'yyyy-MM-dd')}
          value={format(new Date(interviewOnDate), 'yyyy-MM-dd')}
          onChange={(e) =>
            setInterviewForm({
              ...interviewForm,
              interviewOnDate: new Date(e.target.value),
            })
          }
        />
      </div>

      <div>
        <Label>Note</Label>
        <Textarea
          rows={4}
          value={note}
          onChange={(e) =>
            setInterviewForm({
              ...interviewForm,
              note: e.target.value,
            })
          }
          placeholder="Add notes about the interview..."
        />
      </div>

      <div className="pt-2">
        <Button
          variant="default"
          onClick={() =>
            updateInterviewFn({ interviewId, body: interviewForm })
          }
        >
          Save Interview
        </Button>
      </div>
    </div>
  );
};

export const InterviewCreateForm = ({
  applicationId,
  createInterviewFn,
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
}) => {
  const [interviewForm, setInterviewForm] = useState<InterviewData>({
    types: [],
    status: InterviewStatus.PENDING,
    interviewOnDate: new Date(),
    note: '',
  });

  const handleSelectStatus = (status: InterviewStatus) => {
    setInterviewForm({
      ...interviewForm,
      status: status as InterviewStatus,
    });
    console.log('Status CHanged to', status);
  };

  return (
    <div className="rounded-2xl border p-4 shadow-sm space-y-3">
      <div>
        <Label>Interview Types</Label>
        <MultiSelect
          options={interviewTypeOptions}
          onValueChange={(value: string[]) =>
            setInterviewForm({
              ...interviewForm,
              types: value as InterviewType[],
            })
          }
          placeholder="Select Interview Types"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
      </div>

      <div className="flex flex-row gap-6">
        <div className="flex-1">
          <Label className="mb-2">Status</Label>
          <Select
            value={formatInterviewStatus(interviewForm?.status)}
            onValueChange={(value: InterviewStatus) =>
              handleSelectStatus(value)
            }
            defaultValue="Interview"
          >
            <SelectTrigger className="w-full p-2 border rounded-md">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="z-50">
              {Object.values(InterviewStatus)
                .filter((value) => value !== interviewForm?.status)
                .map((dropdownStatus, index) => (
                  <SelectItem
                    key={index}
                    value={formatInterviewStatus(dropdownStatus).toString()}
                  >
                    {formatInterviewStatus(dropdownStatus)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label className="mb-2">Interview Date</Label>
          <Input
            type="date"
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            value={format(interviewForm.interviewOnDate, 'yyyy-MM-dd')}
            onChange={(e) =>
              setInterviewForm({
                ...interviewForm,
                interviewOnDate: new Date(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>Note</Label>
        <Textarea
          rows={4}
          value={interviewForm.note}
          onChange={(e) =>
            setInterviewForm({
              ...interviewForm,
              note: e.target.value,
            })
          }
        />
      </div>
      <div className="pt-2">
        <Button
          variant="default"
          onClick={() =>
            createInterviewFn({
              body: {
                ...interviewForm,
                applicationId,
              },
            })
          }
        >
          Save Interview
        </Button>
      </div>
    </div>
  );
};
