import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/base/dropdown-menu';
import { StatusDot } from '@/components/base/status-dot';
import { celebrateOffered } from '@/components/pages/application-tracker/applications/cell';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { StatusToColorMapping } from '@/utils/constants';
import { formatStatus } from '@/utils/helpers';
import { ApplicationStatus } from '@vtmp/common/constants';
import { ChevronDown } from 'lucide-react';

export const DrawerStatusDropDown = ({
  applicationData,
  updateApplicationStatusFn,
}: {
  applicationData: IApplication;
  updateApplicationStatusFn: (args: {
    applicationId: string;
    body: { updatedStatus: ApplicationStatus };
  }) => void;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {applicationData.status && (
            <div className="flex flex-row items-center gap-2">
              <StatusDot
                status={applicationData.status}
                colorMapping={StatusToColorMapping}
              />
              <span className="max-lg:text-[0.7rem] text-wrap">
                {formatStatus(applicationData.status)}
              </span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className=" mt-1 w-[150px]">
          {Object.values(ApplicationStatus)
            .filter((status) => status !== applicationData.status)
            .map((dropdownStatus) => (
              <DropdownMenuItem
                key={dropdownStatus}
                onClick={() => {
                  if (dropdownStatus === ApplicationStatus.OFFERED) {
                    celebrateOffered();
                  }
                  updateApplicationStatusFn({
                    applicationId: applicationData._id,
                    body: { updatedStatus: dropdownStatus },
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  {formatStatus(dropdownStatus)}
                </div>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
