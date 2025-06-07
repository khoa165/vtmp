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
import { Clock, ExternalLink, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DrawerStatusDropDown } from '@/components/pages/application-tracker/applications/drawer-status-dropdown';
import { InterviewList } from '@/components/pages/application-tracker/applications/interview-list';

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
  const {
    isLoading: isLoadingApplication,
    error: applicationError,
    data: applicationData,
  } = useGetApplicationById(applicationId);

  const { mutate: updateApplicationMetadata } = useUpdateApplicationMetadata();
  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();
  const { mutate: deleteApplicationFn } = useDeleteApplication();

  if (isLoadingApplication) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent side="bottom">
          <div className="p-6 text-destructive">
            <p>Loading data...</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (applicationError) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent side="bottom">
          <div className="p-6 text-destructive">
            <p>Error loading data. Please try again later.</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="right"
        className="min-w-xl shadow-xl shadow-emerald-950/50"
      >
        <ScrollArea className="h-full w-full">
          <div className="mx-auto p-9 text-foreground">
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
              <div className="flex flex-col space-x-2">
                <DrawerDescription className="mb-5 text-xl font-bold text-foreground">
                  {applicationData?.companyName}
                </DrawerDescription>

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
                    <span className="flex items-center rounded-full border border-foreground text-foreground px-3 py-1 text-sm font-medium">
                      <MapPin className="h-4 w-4 mr-1" />
                      {applicationData?.location}
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
                </div>
              </div>
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

            <InterviewList applicationId={applicationId} />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
