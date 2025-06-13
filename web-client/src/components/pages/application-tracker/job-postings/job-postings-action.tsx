import { Button } from '@/components/base/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { IJobPosting } from '@/components/pages/application-tracker/job-postings/validations';

export const JobPostingsAction = ({
  jobPosting,
  createApplicationFn,
}: {
  jobPosting: IJobPosting;
  createApplicationFn: (body: { jobPostingId: string }) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => createApplicationFn({ jobPostingId: jobPosting._id })}
        >
          Create Application
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
