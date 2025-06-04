import { ApplicationData } from '@/components/pages/application-tracker/applications/validation';
import { Label } from '@/components/base/label';
import { Input } from '@/components/base/input';
import { Textarea } from '@/components/base/textarea';

type FieldInForms = 'note' | 'referrer' | 'portalLink' | 'interest';

interface ApplicationFormInputProps {
  label: string;
  placeHolder: string;
  fieldInForm: FieldInForms;
  applicationForm: ApplicationData;
  setApplicationForm: React.Dispatch<React.SetStateAction<ApplicationData>>;
  id: string;
  readonly?: boolean;
  textarea?: boolean;
}

export const ApplicationFormInput = ({
  label,
  placeHolder,
  fieldInForm,
  applicationForm,
  setApplicationForm,
  id,
  readonly = false,
  textarea = false,
}: ApplicationFormInputProps) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id} className="pl-1 text-right">
        {label}
      </Label>
      {textarea ? (
        <Textarea
          id={id}
          name={id}
          value={applicationForm[fieldInForm]}
          onChange={({ target }) =>
            setApplicationForm(() => ({
              ...applicationForm,
              [fieldInForm]: target.value,
            }))
          }
          placeholder={placeHolder}
          rows={4}
          className="rounded-md p-2 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          readOnly={readonly}
        />
      ) : (
        <Input
          id={id}
          name={id}
          className="col-span-3"
          placeholder={placeHolder}
          value={applicationForm[fieldInForm]}
          onChange={({ target }) =>
            setApplicationForm(() => ({
              ...applicationForm,
              [fieldInForm]: target.value,
            }))
          }
          required
          readOnly={readonly}
        />
      )}
    </div>
  );
};
