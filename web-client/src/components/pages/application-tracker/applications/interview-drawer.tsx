import { Button } from '@/components/base/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/base/drawer';
import { ScrollArea } from '@/components/base/scroll-area';
import { ApplicationForm } from '@/components/pages/application-tracker/applications/application-form';
import {
  useDeleteApplication,
  useGetApplicationById,
  useUpdateApplicationMetadata,
  useUpdateApplicationStatus,
} from '@/components/pages/application-tracker/applications/hooks/applications';
import { format } from 'date-fns';
import { Clock, ExternalLink, Briefcase, LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DrawerStatusDropDown } from '@/components/pages/application-tracker/applications/drawer-status-dropdown';

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

  const { mutate: updateApplicationMetadata } = useUpdateApplicationMetadata();
  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();
  const { mutate: deleteApplicationFn } = useDeleteApplication();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <ScrollArea>
        <DrawerContent side="bottom">
          <div className="mx-auto w-full max-w-5xl h-[80vh] p-6 text-foreground">
            <DrawerHeader>
              <DrawerTitle className="mb-3 text-4xl font-bold">
                <Link
                  to={applicationData?.portalLink || '#'}
                  className="flex items-center "
                >
                  {applicationData?.jobTitle}
                  <ExternalLink className="ml-1 mt-1 h-8 w-8" />
                </Link>
              </DrawerTitle>
              <DrawerDescription className="flex flex-col space-x-2">
                <div className="mb-5 text-xl font-bold text-foreground">
                  {applicationData?.companyName}
                </div>

                <div className="flex items-center justify-between space-x-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center rounded-full border border-foreground text-foreground px-3 py-1 text-sm font-medium">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {applicationData?.jobTitle}
                    </span>
                    <span className="flex items-center rounded-full border border-foreground text-foreground px-3 py-1 text-sm font-medium">
                      <Clock className="h-4 w-4 mr-1" />
                      {applicationData?.appliedOnDate
                        ? format(
                            new Date(applicationData.appliedOnDate),
                            'MMM d, yyyy'
                          )
                        : ''}
                    </span>
                    <span className="flex items-center rounded-full border border-foreground text-foreground px-3 py-1 text-sm font-medium hover:bg-muted/20 hover:text-primary hover:border-primary transition">
                      {applicationData && (
                        <DrawerStatusDropDown
                          applicationData={applicationData}
                          updateApplicationStatusFn={updateApplicationStatusFn}
                        />
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-foreground text-background">
                      + Share interview note
                    </Button>
                    <Button variant="secondary" className="flex items-center">
                      <LinkIcon className="mr-2 h-4 w-4" /> View community
                      insights
                    </Button>
                  </div>
                </div>
              </DrawerDescription>
            </DrawerHeader>

            <ApplicationForm
              currentApplication={{
                _id: applicationId || '',
                note: applicationData?.note,
                referrer: applicationData?.referrer,
                portalLink: applicationData?.portalLink,
                interest: applicationData?.interest,
              }}
              updateApplicationMetadataFn={updateApplicationMetadata}
              deleteApplicationFn={deleteApplicationFn}
              onOpenChange={onOpenChange}
            />
          </div>
        </DrawerContent>
      </ScrollArea>
    </Drawer>
  );
}
