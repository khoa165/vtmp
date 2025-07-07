import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Drawer, DrawerContent } from '@/components/base/drawer';
import { ScrollArea } from '@/components/base/scroll-area';
import { Input } from '@/components/base/input';
import { Button } from '@/components/base/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/base/select';
import { JobFunction, JobType } from '@vtmp/common/constants';

import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '@/utils/constants';
import { Calendar } from 'lucide-react';

export interface FilterState {
  jobTitle?: string;
  location?: string;
  jobFunction?: JobFunction;
  jobType?: JobType;
  postingDateRangeStart?: Date;
  postingDateRangeEnd?: Date;
}

interface FilterDrawerProps {
  open: boolean;
  value: FilterState;
  onOpenChange: (open: boolean) => void;
  onApply?: (filters: FilterState) => void;
  onChange: (filters: FilterState) => void;
}

export function FilterDrawer({
  open,
  value,
  onOpenChange,
  onApply,
  onChange,
}: FilterDrawerProps) {
  const [filterParams, setFilterParams] = useSearchParams();
  const queryClient = useQueryClient();

  const initialFilters: FilterState = {
    jobTitle: filterParams.get('jobTitle') ?? undefined,
    location: filterParams.get('location') ?? undefined,
    jobFunction: filterParams.get('jobFunction') as JobFunction | undefined,
    jobType: filterParams.get('jobType') as JobType | undefined,
    postingDateRangeStart: filterParams.get('startDate')
      ? new Date(filterParams.get('startDate')!)
      : undefined,
    postingDateRangeEnd: filterParams.get('endDate')
      ? new Date(filterParams.get('endDate')!)
      : undefined,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    setFilters(value);
  }, [value]);

  useEffect(() => {
    const updatedFilters: FilterState = {
      jobTitle: filterParams.get('jobTitle') ?? undefined,
      location: filterParams.get('location') ?? undefined,
      jobFunction: filterParams.get('jobFunction') as JobFunction | undefined,
      jobType: filterParams.get('jobType') as JobType | undefined,
      postingDateRangeStart: filterParams.get('startDate')
        ? new Date(filterParams.get('startDate')!)
        : undefined,
      postingDateRangeEnd: filterParams.get('endDate')
        ? new Date(filterParams.get('endDate')!)
        : undefined,
    };
    setFilters(updatedFilters);
    onChange(updatedFilters);
  }, [filterParams]);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const jobTypeLabels: Record<JobType, string> = {
    [JobType.INTERNSHIP]: 'Internship',
    [JobType.NEW_GRAD]: 'New Grad',
    [JobType.INDUSTRY]: 'Industry',
    [JobType.UNKNOWN]: 'Unknown',
  };

  const jobFunctionLabels: Record<JobFunction, string> = {
    [JobFunction.SOFTWARE_ENGINEER]: 'Software Engineer',
    [JobFunction.DATA_SCIENTIST]: 'Data Science',
    [JobFunction.PRODUCT_DESIGNER]: 'Product Designer',
    [JobFunction.DATA_ENGINEER]: 'Data Engineer',
    [JobFunction.UNKNOWN]: 'Unknown',
  };

  const [postingStartInput, setPostingStartInput] = useState(
    filters.postingDateRangeStart
      ? filters.postingDateRangeStart.toISOString().slice(0, 10)
      : ''
  );

  const [postingEndInput, setPostingEndInput] = useState(
    filters.postingDateRangeEnd
      ? filters.postingDateRangeEnd.toISOString().slice(0, 10)
      : ''
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="min-w-[35vw] shadow-xl shadow-emerald-950/50"
      >
        <ScrollArea className="h-full w-full">
          <div className="mx-auto p-9 text-foreground space-y-6">
            <h2 className="text-2xl font-semibold mb-2">Select Filters</h2>

            {/* Job Title */}
            <div
              onDoubleClick={() =>
                setFilters({ ...filters, jobTitle: undefined })
              }
            >
              <label className="block mb-1 text-sm font-medium">
                Job Title
              </label>
              <Input
                placeholder="e.g. Software Engineer"
                value={filters.jobTitle || ''}
                onChange={(e) =>
                  setFilters({ ...filters, jobTitle: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div
              onDoubleClick={() =>
                setFilters({ ...filters, location: undefined })
              }
            >
              <label className="block mb-1 text-sm font-medium">Location</label>
              <Select
                value={filters.location ?? ''}
                onValueChange={(val) =>
                  setFilters({
                    ...filters,
                    location: filters.location === val ? undefined : val,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  {filters.location ? (
                    <span>{filters.location}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Select location
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CANADA">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Function */}
            <div
              onDoubleClick={() =>
                setFilters({ ...filters, jobFunction: undefined })
              }
            >
              <label className="block mb-1 text-sm font-medium">
                Job Function
              </label>
              <Select
                value={filters.jobFunction ?? ''}
                onValueChange={(val) =>
                  setFilters({
                    ...filters,
                    jobFunction:
                      filters.jobFunction === val
                        ? undefined
                        : (val as JobFunction),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  {filters.jobFunction ? (
                    <span>{jobFunctionLabels[filters.jobFunction]}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Select function
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.values(JobFunction).map((func) => (
                    <SelectItem key={func} value={func}>
                      {jobFunctionLabels[func]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Type */}
            <div
              onDoubleClick={() =>
                setFilters({ ...filters, jobType: undefined })
              }
            >
              <label className="block mb-1 text-sm font-medium">Job Type</label>
              <Select
                value={filters.jobType ?? ''}
                onValueChange={(val) =>
                  setFilters({
                    ...filters,
                    jobType:
                      filters.jobType === val ? undefined : (val as JobType),
                  })
                }
              >
                <SelectTrigger className="w-full">
                  {filters.jobType ? (
                    <span>{jobTypeLabels[filters.jobType]}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Select job type
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.values(JobType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {jobTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Posting Date Range */}
            <div
              className="grid grid-cols-2 gap-4"
              onDoubleClick={() =>
                setFilters({
                  ...filters,
                  postingDateRangeStart: undefined,
                  postingDateRangeEnd: undefined,
                })
              }
            >
              {/* Posted After */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium">
                  Posted After
                </label>
                <Input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  className="pr-10"
                  value={postingStartInput}
                  onChange={(e) => {
                    const input = e.target.value;
                    setPostingStartInput(input); // ✅ allow user to type freely

                    const parsed = new Date(input);
                    if (!isNaN(parsed.getTime())) {
                      setFilters({ ...filters, postingDateRangeStart: parsed });
                    } else {
                      setFilters({
                        ...filters,
                        postingDateRangeStart: undefined,
                      });
                    }
                  }}
                />
                <Calendar className="absolute right-3 top-9 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Posted Before */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium">
                  Posted Before
                </label>
                <Input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  className="pr-10"
                  value={postingEndInput}
                  onChange={(e) => {
                    const input = e.target.value;
                    setPostingEndInput(input); // ✅ allow user to type freely

                    const parsed = new Date(input);
                    if (!isNaN(parsed.getTime())) {
                      setFilters({ ...filters, postingDateRangeStart: parsed });
                    } else {
                      setFilters({
                        ...filters,
                        postingDateRangeStart: undefined,
                      });
                    }
                  }}
                />
                <Calendar className="absolute right-3 top-9 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setFilters({})}>
                Clear All
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const newParams = new URLSearchParams();

                  if (filters.jobTitle)
                    newParams.set('jobTitle', filters.jobTitle);
                  if (filters.location)
                    newParams.set('location', filters.location);
                  if (filters.jobFunction)
                    newParams.set('jobFunction', filters.jobFunction);
                  if (filters.jobType)
                    newParams.set('jobType', filters.jobType);
                  if (filters.postingDateRangeStart)
                    newParams.set(
                      'startDate',
                      filters.postingDateRangeStart.toISOString().split('T')[0]
                    );
                  if (filters.postingDateRangeEnd)
                    newParams.set(
                      'endDate',
                      filters.postingDateRangeEnd.toISOString().split('T')[0]
                    );

                  setFilterParams(newParams);

                  onApply?.(filters);
                  onOpenChange(false);
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.GET_JOB_POSTINGS, filters],
                  });
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
