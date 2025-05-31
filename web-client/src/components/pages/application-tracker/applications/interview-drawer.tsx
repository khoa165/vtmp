import { Button } from '@/components/base/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/base/drawer';
import { useGetApplicationById } from '@/components/pages/application-tracker/applications/hooks/applications';

interface InterviewDrawer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string | null;
}

export function InterviewDrawer({
  open,
  onOpenChange,
  applicationId,
}: InterviewDrawer) {
  const {
    isLoading,
    error,
    data: applicationData,
  } = useGetApplicationById(applicationId || '');

  if (isLoading) {
    console.log('Loading application data...');
  }

  if (error) {
    console.error('Error fetching application data:', error);
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="bottom">
        <div className="mx-auto w-full max-w-sm h-[70vh]">
          <DrawerHeader>
            <DrawerTitle>Application Detail</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">{}</div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                  {applicationData ? JSON.stringify(applicationData) : ''}
                </div>
              </div>
            </div>
            <div className="mt-3 h-[120px]"></div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
