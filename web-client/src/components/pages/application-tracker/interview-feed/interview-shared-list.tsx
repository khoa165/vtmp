import { Card } from '#vtmp/web-client/components/base/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/base/accordion';
import { Skeleton } from '@/components/base/skeleton';
import { SharedInterviewFilter } from '@/components/pages/application-tracker/applications/validation';
import {
  useGetInterviewInsights,
  useGetSharedInterviews,
} from '@/components/pages/application-tracker/interview-feed/hooks/interviews';
import { InterviewCard } from '@/components/pages/application-tracker/interview-feed/interview-card';

export const InterviewSharedList = ({
  interviewFilter,
}: {
  interviewFilter: SharedInterviewFilter;
}) => {
  const {
    isLoading: isInterviewsLoading,
    isError: isInterviewsError,
    data: sharedInterviewData,
  } = useGetSharedInterviews(interviewFilter);

  const {
    // isLoading: isInsightsLoading,
    // isError: isInsightsError,
    data: interviewInsights,
  } = useGetInterviewInsights(interviewFilter);

  console.log('Interview Insights:', interviewInsights);

  if (isInterviewsError) {
    throw new Error('Error loading interviews.');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-10">
      <div className="col-span-1 md:col-span-2">
        {isInterviewsLoading ? (
          <InterviewSharedListSkeleton />
        ) : Array.isArray(sharedInterviewData) &&
          sharedInterviewData.length > 0 ? (
          sharedInterviewData
            .sort(
              (a, b) =>
                new Date(b.interviewOnDate).getTime() -
                new Date(a.interviewOnDate).getTime()
            )
            .map((interview) => <InterviewCard interview={interview} />)
        ) : (
          <Card className="rounded-xl bg-background border border-background py-6 mb-10 h-100 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col items-center justify-center my-auto text-center">
              <h3 className="text-2xl font-semibold mb-4">
                No Shared Interviews Found
              </h3>
              <p className="text-gray-500">No one shared any interviews yet.</p>
            </div>
          </Card>
        )}
      </div>
      <InterviewAccordion />
    </div>
  );
};

const InterviewAccordion = () => {
  return (
    <div className="col-span-1 md:col-span-1 bg-emerald-300 p-4 rounded-xl text-background h-fit sticky top-20">
      <h3 className="text-background font-semibold text-sm mb-3">
        Interview Tips
      </h3>
      <Accordion type="single" collapsible className="w-full text-background">
        <AccordionItem value="tip1">
          <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
            <div className="flex items-center gap-3 w-full text-start">
              <div className="text-2xl font-bold text-background opacity-70">
                1
              </div>
              <span>How should I prepare for interviews?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-medium font-semibold">
            Research the company, practice common questions, and do mock
            interviews.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tip2">
          <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
            <div className="flex items-center gap-3 w-full text-start">
              <div className="text-2xl font-bold text-background opacity-70">
                2
              </div>
              <span>What should I say if I do not know the answer?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-medium font-semibold">
            Be honest. Show your thought process, and ask for clarifications if
            needed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tip3">
          <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
            <div className="flex items-center gap-3 w-full text-start">
              <div className="text-2xl font-bold text-background opacity-70">
                3
              </div>
              <span>How do I stand out in behavioral interviews?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-medium font-semibold">
            Use the STAR method. Be concise but specific with examples and
            results.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const InterviewSharedListSkeleton = () => {
  return (
    <div className=" rounded-xl bg-background border border-background p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-5">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <div>
        <Skeleton className="h-8 w-3/5 rounded" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
};
