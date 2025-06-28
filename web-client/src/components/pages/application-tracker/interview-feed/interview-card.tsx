import { format } from 'date-fns';
import { Circle, CircleUserRound, MapPin } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { Textarea } from '@/components/base/textarea';
import { SharedInterviewData } from '@/components/pages/application-tracker/interview-feed/validation';
import { formatRelativeDate, MONTH_DATE_YEAR } from '@/utils/date';

export const InterviewCard = ({
  interview,
}: {
  interview: SharedInterviewData;
}) => {
  return (
    <Card className="rounded-xl bg-background border border-background p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3">
      <CardHeader className="mb-0">
        <CardTitle className="mt-1 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CircleUserRound />
            <span className="text-sm font-medium">
              {interview.user.firstName} {interview.user.lastName}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatRelativeDate(interview.sharedAt)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-4xl font-bold">{interview.jobTitle}</h3>
          <div className="mt-4 flex items-center gap-3">
            <p className="text-xl font-bold text-foreground">
              {interview.companyName}
            </p>
            <span className="mt-1 flex items-center text-foreground rounded-full border border-foreground/50 px-3 py-1 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {interview.location}
            </span>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Interview Types
          </div>
          <div className="h-16">
            <div className="flex flex-wrap gap-x-2">
              {interview.types.map((type) => (
                <span className="mt-1 flex items-center rounded-full border border-foreground/50 text-foreground px-3 py-1 text-sm font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-row gap-6">
          <div className="flex-1 space-y-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Interview Status
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Circle className="w-2 h-2 fill-green-500" />
              {interview.status}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Interview Date
            </div>
            <p className="font-medium text-white">
              {format(new Date(interview.interviewOnDate), MONTH_DATE_YEAR)}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Note
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <Textarea value={interview.note} placeholder="Add interview note" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
