import { useState } from 'react';
import { Button } from '@/components/base/button';
import {
  FilterDrawer,
  FilterState,
} from '@/components/pages/application-tracker/job-postings/job-postings-drawer';
import { Filter } from 'lucide-react';

export function FilterSelectionButton({
  onApply,
}: {
  onApply: (filters: FilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({})

  return (
    <>
      <Button
        variant="outline"
        className="text-foreground"
        onClick={() => setOpen(true)}
      >
        Select Filters <Filter className="ml-2 w-4 h-4" />
      </Button>
      <FilterDrawer
        open={open}
        onOpenChange={setOpen}
        value={filters}
        onChange={setFilters}
        onApply={onApply}
      />
    </>
  );
}
