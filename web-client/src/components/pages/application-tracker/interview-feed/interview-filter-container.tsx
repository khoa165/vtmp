import { Input } from '@/components/base/input';
import { MultiSelect } from '@/components/base/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/base/select';
import { InterviewFilter } from '@/components/pages/application-tracker/interview-feed/interview-feed-container';
import {
  convertToInterviewStatusEnum,
  convertToInterviewType,
  interviewTypeOptions,
} from '@/utils/helpers';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

export const InterviewFilterContainer = ({
  interviewFilter,
  setInterviewFilter,
}: {
  interviewFilter: InterviewFilter;
  setInterviewFilter: (filters: InterviewFilter) => void;
}) => {
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="w-60">
        <Input
          placeholder="Filter companies..."
          value={interviewFilter?.companyName || ''}
          onChange={(event) => {
            if (!event.target.value) {
              setInterviewFilter({
                ...interviewFilter,
                companyName: undefined,
              });
              return;
            }
            setInterviewFilter({
              ...interviewFilter,
              companyName: event.target.value,
            });
          }}
          className="rounded-lg p-2 border border-input px-3 py-2 text-sm text-foreground shadow-sm w-full"
        />
      </div>

      <div className="w-40">
        <Select
          onValueChange={(status) => {
            setInterviewFilter({
              ...interviewFilter,
              status: convertToInterviewStatusEnum(status),
            });
          }}
        >
          <SelectTrigger className="rounded-lg p-2 border border-input px-3 py-2 text-sm text-foreground shadow-sm w-full">
            <span
              className={!interviewFilter.status ? 'text-muted-foreground' : ''}
            >
              {interviewFilter.status || 'Status'}
            </span>
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="STATUS">None</SelectItem>
            {Object.values(InterviewStatus)
              .filter((value) => value !== interviewFilter?.status)
              .map((dropdownStatus, index) => (
                <SelectItem key={index} value={dropdownStatus}>
                  {dropdownStatus}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-40 max-w-200">
        <MultiSelect
          selected={(interviewFilter.types ?? []).map(
            (type: InterviewType) => ({
              label: type.toString(),
              value: type,
            })
          )}
          placeholder="Types"
          options={interviewTypeOptions}
          onChange={(types) => {
            setInterviewFilter({
              ...interviewFilter,
              types: types
                .map((type) => convertToInterviewType(type.value))
                .filter((type) => type !== undefined),
            });
          }}
        />
      </div>
    </div>
  );
};
