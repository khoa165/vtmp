import { Button } from '@/components/base/button';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/base/alert-dialog';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { ApplicationStatus } from '@vtmp/common/constants';
import { formatStatus } from '@/utils/helpers';
import { StatusDot } from '@/components/base/status-dot';
import { StatusToColorMapping } from '@/utils/constants';

const celebrateOffered = (): void => {
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
}: {
  application: IApplication;
  deleteApplicationFn: (id: string) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* TODO-(QuangMinhNguyen27405/dsmai): Remove this 'Copy Application ID action' */}
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(application._id)}
          >
            Copy application ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            Delete application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
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
    </>
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
