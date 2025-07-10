import { Filter } from 'lucide-react';
import { useState } from 'react';

import { JobPostingFilters } from '#vtmp/web-client/components/pages/application-tracker/job-postings/validations';
import { Button } from '@/components/base/button';
import { FilterDrawer } from '@/components/pages/application-tracker/job-postings/job-postings-drawer';

export function FilterSelectionButton({
  filters,
  setFilters,
}: {
  filters: JobPostingFilters;
  setFilters: (filters: JobPostingFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        className="text-foreground"
        onClick={() => setOpen(true)}
      >
        Select Filters <Filter fill="#66ffcc" className="ml-2 w-4 h-4" />
      </Button>
      <FilterDrawer
        open={open}
        onOpenChange={setOpen}
        value={filters}
        // onChange={setFilters}
        onApply={setFilters}
      />
    </>
  );
}
