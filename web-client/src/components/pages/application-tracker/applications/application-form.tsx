import { ApplicationData } from '@/components/pages/application-tracker/applications/validation';
import { useEffect, useState } from 'react';
import {
  ApplicationFormInput,
  ApplicationTextAreaInput,
} from '@/components/pages/application-tracker/applications/application-form-input';
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
  AlertDialogTrigger,
} from '@/components/base/alert-dialog';

interface ApplicationFormProps {
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
}

export const ApplicationForm = ({
  currentApplication,
  updateApplicationMetadataFn,
  deleteApplicationFn,
  onOpenChange,
}: ApplicationFormProps) => {
  const {
    _id: applicationId,
    note,
    referrer,
    portalLink,
    interest,
  } = currentApplication;
  const [applicationForm, setApplicationForm] = useState<ApplicationData>({
    note: note || '',
    referrer: referrer || '',
    portalLink: portalLink || '',
    interest: interest,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setApplicationForm({
      note: note || '',
      referrer: referrer || '',
      portalLink: portalLink || '',
      interest: interest,
    });
  }, [note, referrer, portalLink, interest]);

  return (
    <div className="mt-8 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-4">
        <div>
          <ApplicationFormInput
            label="Interest Level"
            placeHolder="Change your interest level"
            fieldInForm="interest"
            applicationForm={applicationForm}
            setApplicationForm={setApplicationForm}
            id="interest"
          />
        </div>
        <div>
          <ApplicationFormInput
            label="Portal Link"
            placeHolder="Add a portal link"
            fieldInForm="portalLink"
            applicationForm={applicationForm}
            setApplicationForm={setApplicationForm}
            id="portalLink"
            readonly={true}
          />
        </div>

        <div>
          <ApplicationFormInput
            label="Referer"
            placeHolder="Add a referer"
            fieldInForm="referrer"
            applicationForm={applicationForm}
            setApplicationForm={setApplicationForm}
            id="referrer"
          />
        </div>
      </div>
      <div>
        <ApplicationTextAreaInput
          label="Note"
          placeHolder="Add a note about this application"
          fieldInForm="note"
          applicationForm={applicationForm}
          setApplicationForm={setApplicationForm}
          id="note"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          className="bg-gray-100 border border-red-500 text-red-500 hover:bg-gray-200 font-bold py-2 px-6 rounded shadow-sm"
          onClick={() => setIsDialogOpen(true)}
        >
          Delete
        </Button>
        <Button
          className="bg-gray-700 hover:bg-gray-600 text-foreground font-bold py-2 px-6 rounded"
          variant="secondary"
          onClick={() => {
            setApplicationForm({
              note: note || '',
              referrer: referrer || '',
              portalLink: portalLink || '',
              interest: interest,
            });
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-emerald-400 hover:bg-emerald-500 inset-shadow-sm inset-shadow-emerald-400/50 text-foreground font-bold py-2 px-6 rounded"
          onClick={() => {
            updateApplicationMetadataFn({
              applicationId: applicationId,
              body: applicationForm,
            });
          }}
        >
          Save
        </Button>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
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
