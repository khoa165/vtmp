import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Clock,
  ExternalLink,
  MapPin,
  RotateCw,
  Save,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { capitalize } from 'remeda';
import { z } from 'zod';

import { InterestLevel } from '@vtmp/common/constants';

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
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/base/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/base/form';
import { Input } from '@/components/base/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/base/select';
import { Skeleton } from '@/components/base/skeleton';
import { Textarea } from '@/components/base/textarea';
import { ApplicationInterestDropDown } from '@/components/pages/application-tracker/applications/application-interest-column';
import { DrawerStatusDropDown } from '@/components/pages/application-tracker/applications/drawer-status-dropdown';
import {
  useDeleteApplication,
  useGetApplicationById,
  useUpdateApplicationMetadata,
  useUpdateApplicationStatus,
} from '@/components/pages/application-tracker/applications/hooks/applications';
import { ApplicationFormSchema } from '@/components/pages/application-tracker/applications/validation';
import { MONTH_DATE_YEAR } from '@/utils/date';

export const ApplicationForm = ({
  applicationId,
  onOpenChange,
}: {
  applicationId: string;
  onOpenChange?: (open: boolean) => void;
}) => {
  const {
    isLoading: isLoadingApplication,
    error: applicationError,
    data: applicationData,
  } = useGetApplicationById(applicationId);

  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();
  const { mutate: deleteApplicationFn } = useDeleteApplication();
  const { mutate: updateApplicationMetadataFn } =
    useUpdateApplicationMetadata();

  const [isEditingApplication, setIsEditingApplication] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const applicationForm = useForm<z.infer<typeof ApplicationFormSchema>>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      note: '',
      referrer: '',
      portalLink: '',
      interest: InterestLevel.MEDIUM,
    },
  });

  useEffect(() => {
    if (applicationData) {
      applicationForm.reset({
        note: applicationData.note,
        referrer: applicationData.referrer,
        portalLink: applicationData.portalLink,
        interest: applicationData.interest,
      });
    }
  }, [applicationData]);

  if (isLoadingApplication) {
    return (
      <DrawerHeader>
        <div className="space-y-2">
          <DrawerTitle className="mb-3">
            <Skeleton className="h-10 w-3/4 rounded-sm" />
          </DrawerTitle>
          <DrawerDescription>
            <Skeleton className="h-6 w-1/3 rounded-sm" />
          </DrawerDescription>

          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-full" />
          </div>
        </div>
      </DrawerHeader>
    );
  }

  if (applicationError) {
    throw new Error('Error loading application form');
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="mb-3 text-4xl font-bold">
          <Link to={applicationData?.url || '#'} className="flex items-center">
            {applicationData?.jobTitle}
            <ExternalLink className="ml-1 mt-1 h-8 w-8" />
          </Link>
        </DrawerTitle>
        <div className="flex flex-col space-x-2">
          <DrawerDescription className="mb-5 text-xl font-bold text-foreground">
            {applicationData?.companyName}
          </DrawerDescription>

          <div className="flex items-center justify-between space-x-4 space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center rounded-full border border-foreground text-foreground px-3 py-1 text-sm font-medium">
                <Clock className="h-4 w-4 mr-1" />
                {applicationData?.appliedOnDate
                  ? format(
                      new Date(applicationData.appliedOnDate),
                      MONTH_DATE_YEAR
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
      <div className="my-8 rounded-xl">
        <div className="flex justify-between gap-2 my-7">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Application Detail</h2>
          </div>

          {isEditingApplication ? (
            <div className="flex gap-2">
              <Button
                type="button"
                className="flex items-center h-7.5 gap-1.5 rounded-sm border border-orange-300 px-4 text-xs text-orange-300 bg-background hover:bg-background hover:text-orange-400 hover:border-orange-400 transition"
                variant="secondary"
                onClick={() => {
                  setIsEditingApplication(false);
                  applicationForm.reset();
                }}
              >
                <RotateCw className="scale-85" />
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={applicationForm.handleSubmit(
                  (body: z.infer<typeof ApplicationFormSchema>) => {
                    updateApplicationMetadataFn({
                      applicationId: applicationId,
                      body: body,
                    });
                    setIsEditingApplication(false);
                  }
                )}
                className="h-7.5 gap-1.5 rounded-sm border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition"
              >
                <Save className="scale-85" />
                Save
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                className="flex items-center h-7.5 gap-1.5 rounded-sm border border-orange-300 px-4 text-xs text-orange-300 bg-background hover:bg-background hover:text-orange-400 hover:border-orange-400 transition"
                onClick={() => setIsDialogOpen(true)}
              >
                <Trash2 className="scale-85" />
                Delete
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditingApplication(true)}
                className="h-7.5 gap-1.5 rounded-sm border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition"
              >
                <Save className="scale-85" />
                Edit
              </Button>
            </div>
          )}
        </div>
        <Form {...applicationForm}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-4">
            <FormField
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Level</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={!isEditingApplication}
                    >
                      <SelectTrigger className="w-full h-10 rounded-lg p-2 border border-input px-3 py-2 text-sm shadow-sm">
                        <ApplicationInterestDropDown
                          interest={field.value ?? InterestLevel.MEDIUM}
                        />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {Object.values(InterestLevel)
                          .filter(
                            (value) =>
                              value !== applicationForm.watch('interest')
                          )
                          .map((dropdownStatus, index) => (
                            <SelectItem
                              key={index}
                              value={capitalize(dropdownStatus)}
                            >
                              <ApplicationInterestDropDown
                                interest={dropdownStatus}
                              />
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="referrer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referer</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add a referer"
                      disabled={!isEditingApplication}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="portalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portal Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add a portal link"
                      {...field}
                      disabled={!isEditingApplication}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a note about this application"
                    disabled={!isEditingApplication}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
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
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteApplicationFn(applicationId);
                  setIsDialogOpen(false);
                  if (onOpenChange) {
                    onOpenChange(false);
                  }
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};
