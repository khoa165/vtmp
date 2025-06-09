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
import { Skeleton } from '@/components/base/skeleton';

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
        <DrawerContent
          side="right"
          className="min-w-xl shadow-xl shadow-emerald-950/50"
        >
          <ScrollArea className="h-full w-full">
            <div className="mx-auto p-9 text-foreground">
              <DrawerHeader>
                <div className="space-y-2">
                  <DrawerTitle className="mb-3">
                    <Skeleton className="h-10 w-3/4 rounded-md" />
                  </DrawerTitle>
                  <DrawerDescription>
                    <Skeleton className="h-6 w-1/3 rounded-md" />
                  </DrawerDescription>

                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    <Skeleton className="h-8 w-36 rounded-full" />
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-48 rounded-full" />
                  </div>
                </div>
              </DrawerHeader>

              <div className="space-y-6">
                <Skeleton className="h-5 w-1/2 rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-5 w-1/3 rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>

              <div className="space-y-4 pt-6">
                <Skeleton className="h-5 w-1/4 rounded-md" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  if (applicationError) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          side="right"
          className="min-w-xl shadow-xl shadow-red-900/50 bg-background"
        >
          <div className="p-9 text-foreground space-y-4">
            <DrawerHeader>
              <DrawerTitle className="text-3xl font-bold text-destructive">
                Failed to Load Application
              </DrawerTitle>
              <DrawerDescription className="text-base text-muted-foreground">
                We couldn't retrieve the application details due to a network or
                server error.
              </DrawerDescription>
            </DrawerHeader>

            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive shadow-inner shadow-red-900/20">
              <div className="font-medium">
                Please check your connection and try again later.
              </div>
            </div>
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

                <div className="flex items-center justify-between space-x-4 space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1">
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
