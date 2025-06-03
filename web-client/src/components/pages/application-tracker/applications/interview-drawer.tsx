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
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="mx-auto w-full max-w-2xl h-[75vh] p-6 text-foreground">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold">
              <Link
                to={applicationData?.portalLink || '#'}
                className="flex items-center"
              >
                {applicationData?.companyName || 'Company Name'}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </DrawerTitle>
            <DrawerDescription className="mt-1 flex items-center space-x-2">
              <div className="font-medium">{applicationData?.companyName}</div>
            </DrawerDescription>
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
