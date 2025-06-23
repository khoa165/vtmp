import { CircleUserRound } from 'lucide-react';

import { Button } from '@/components/base/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { SharedInterviewData } from '@/components/pages/application-tracker/interview-feed/validation';
import { formatRelativeDate } from '@/utils/date';

export const InterviewCard = ({
  interview,
}: {
  interview: SharedInterviewData;
}) => {
  return (
    <Card className="rounded-xl bg-background border border-background p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3 ">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
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
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
