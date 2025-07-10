import { useState } from 'react';

import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

import { StatusDot } from '#vtmp/web-client/components/base/status-dot';
import { SharedInterviewFilter } from '#vtmp/web-client/components/pages/application-tracker/applications/validation';
import { InterviewStatusToColorMapping } from '#vtmp/web-client/utils/constants';
import { Input } from '@/components/base/input';
import { MultiSelect } from '@/components/base/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/base/select';
import {
  convertToInterviewStatusEnum,
  convertToInterviewType,
  interviewTypeOptions,
} from '@/utils/helpers';

export const InterviewFilterContainer = ({
  interviewFilter,
  setInterviewFilter,
}: {
  interviewFilter: SharedInterviewFilter;
  setInterviewFilter: (filters: SharedInterviewFilter) => void;
}) => {
  const [companyInput, setCompanyInput] = useState(
    interviewFilter?.companyName || ''
  );

  return (
    <div className="flex items-center gap-2 my-3">
      <div className="w-60">
        <Input
          placeholder="Filter companies..."
          value={companyInput}
          onChange={(event) => {
            setCompanyInput(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              setInterviewFilter({
                ...interviewFilter,
                companyName: companyInput || undefined,
              });
            }
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
            {interviewFilter.status && (
              <StatusDot
                status={interviewFilter.status}
                colorMapping={InterviewStatusToColorMapping}
              />
            )}
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
                  <StatusDot
                    status={dropdownStatus}
                    colorMapping={InterviewStatusToColorMapping}
                  />
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
