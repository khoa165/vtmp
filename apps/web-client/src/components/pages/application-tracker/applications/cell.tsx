import confetti from 'canvas-confetti';
import { ChevronDown, Expand, Trash } from 'lucide-react';
import { useState } from 'react';

import { ApplicationStatus } from '@vtmp/common/constants';

import { StatusDot } from '#vtmp/web-client/components/base/status-dot';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/base/alert-dialog';
import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { StatusToColorMapping } from '@/utils/constants';
import { formatStatus } from '@/utils/helpers';

export const celebrateOffered = (): void => {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

export const CellActions = ({
  application,
  deleteApplicationFn,
  handleOpenDrawer,
}: {
  application: IApplication;
  deleteApplicationFn: (id: string) => void;
  handleOpenDrawer: (id: string) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="flex gap-4">
      <Expand
        size="1.5em"
        className="cursor-pointer"
        onClick={() => handleOpenDrawer(application._id)}
      />
      <Trash
        size="1.5em"
        className="cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="text-vtmp-light-grey"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteApplicationFn(application._id);
                setIsDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const CellApplicationStatus = ({
  application,
  updateApplicationStatusFn,
}: {
  application: IApplication;
  updateApplicationStatusFn: ({
    applicationId,
    body,
  }: {
    applicationId: string;
    body: { updatedStatus: ApplicationStatus };
  }) => void;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            justify="between"
            size="sm"
            className="w-[170px] text-left"
          >
            <div className="flex items-center gap-2">
              <StatusDot
                status={application.status}
                colorMapping={StatusToColorMapping}
              />
              {formatStatus(application.status)}
            </div>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.values(ApplicationStatus)
            .filter((value) => value !== application.status)
            .map((dropdownStatus, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  if (dropdownStatus === ApplicationStatus.OFFERED) {
                    celebrateOffered();
                  }
                  updateApplicationStatusFn({
                    applicationId: application._id,
                    body: { updatedStatus: dropdownStatus },
                  });
                }}
              >
                {formatStatus(dropdownStatus)}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
