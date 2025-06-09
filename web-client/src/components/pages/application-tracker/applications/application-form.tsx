import {
  ApplicationData,
  applicationFormSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { useState } from 'react';
import { Button } from '@/components/base/button';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/base/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InterestLevel } from '@vtmp/common/constants';
import { Input } from '@/components/base/input';
import { Textarea } from '@/components/base/textarea';

export const ApplicationForm = ({
  currentApplication,
  updateApplicationMetadataFn,
  deleteApplicationFn,
  onOpenChange,
}: {
  currentApplication: {
    _id: string;
  } & ApplicationData;
  updateApplicationMetadataFn: ({
    applicationId,
    body,
  }: {
    applicationId: string;
    body: ApplicationData;
  }) => void;
  deleteApplicationFn: (applicationId: string) => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const {
    _id: applicationId,
    note,
    referrer,
    portalLink,
    interest,
  } = currentApplication;

  const applicationForm = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      note: note,
      referrer: referrer,
      portalLink: portalLink,
      interest: InterestLevel.MEDIUM,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="mt-8 rounded-xl">
      <Form {...applicationForm}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-4">
          <FormField
            control={applicationForm.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Level</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Change your interest level"
                    readOnly={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={applicationForm.control}
            name="portalLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portal Link</FormLabel>
                <FormControl>
                  <Input placeholder="Add a portal link" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={applicationForm.control}
            name="referrer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Add a referer"
                    readOnly={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={applicationForm.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add a note about this application"
                  readOnly={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            className="bg-gray-100 border border-red-500 text-red-500 hover:bg-gray-200 font-bold py-2 w-20 rounded shadow-sm"
            onClick={() => setIsDialogOpen(true)}
          >
            Delete
          </Button>
          <Button
            type="button"
            className="bg-gray-700 hover:bg-gray-600 text-foreground font-bold py-2 w-20 rounded"
            variant="secondary"
            onClick={() =>
              applicationForm.reset({
                note: note || '',
                referrer: referrer || '',
                portalLink: portalLink || '',
                interest: interest || InterestLevel.MEDIUM,
              })
            }
          >
            Cancel
          </Button>
          {isEditing ? (
            <Button
              type="submit"
              onClick={applicationForm.handleSubmit(
                (body: z.infer<typeof applicationFormSchema>) => {
                  updateApplicationMetadataFn({
                    applicationId: applicationId,
                    body: body,
                  });
                  setIsEditing(false);
                }
              )}
              className="bg-emerald-400 hover:bg-emerald-500 inset-shadow-sm inset-shadow-emerald-400/50 text-foreground font-bold py-2 w-20 rounded"
            >
              Save
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 w-20 rounded"
            >
              Edit
            </Button>
          )}
        </div>
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
  );
};
