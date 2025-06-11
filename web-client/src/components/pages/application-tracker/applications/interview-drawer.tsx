import { Drawer, DrawerContent } from '@/components/base/drawer';
import { ScrollArea } from '@/components/base/scroll-area';
import { ApplicationForm } from '@/components/pages/application-tracker/applications/application-form';
import { InterviewList } from '@/components/pages/application-tracker/applications/interview-list';
import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';

interface InterviewDrawer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}

export function InterviewDrawer({
  open,
  onOpenChange,
  applicationId,
}: InterviewDrawer) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="min-w-[35vw] shadow-xl shadow-emerald-950/50"
      >
        <ScrollArea className="h-full w-full">
          <div className="mx-auto p-9 text-foreground">
            <ErrorBoundaryWrapper customText="Application Form">
              <ApplicationForm
                applicationId={applicationId}
                onOpenChange={onOpenChange}
              />
            </ErrorBoundaryWrapper>
            <ErrorBoundaryWrapper customText="Interview List">
              <InterviewList applicationId={applicationId} />
            </ErrorBoundaryWrapper>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
