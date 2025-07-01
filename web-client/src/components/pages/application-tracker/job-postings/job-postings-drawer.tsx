import { useEffect, useState } from 'react';
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
import { DatePicker } from '@/components/base/DatePicker';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '@/utils/constants';

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
  const [filters, setFilters] = useState<FilterState>({});

  useEffect(() => {
    setFilters(value);
  }, [value]);

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

  const queryClient = useQueryClient();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="min-w-[35vw] shadow-xl shadow-emerald-950/50"
      >
        <ScrollArea className="h-full w-full">
          <div className="mx-auto p-9 text-foreground space-y-6">
            <h2 className="text-2xl font-semibold mb-2">Select Filters</h2>

            {/* ✅ Job Title */}
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

            {/* ✅ Location */}
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

            {/* ✅ Job Function */}
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

            {/* ✅ Job Type */}
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

            {/* ✅ Posting Date Range */}
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
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Posted After
                </label>
                <DatePicker
                  value={filters.postingDateRangeStart}
                  onChange={(date) =>
                    setFilters({ ...filters, postingDateRangeStart: date })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Posted Before
                </label>
                <DatePicker
                  value={filters.postingDateRangeEnd}
                  onChange={(date) =>
                    setFilters({ ...filters, postingDateRangeEnd: date })
                  }
                />
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setFilters({})}>
                Clear All
              </Button>
              <Button
                variant="default"
                onClick={() => {
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
