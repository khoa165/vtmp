import { Card } from '#vtmp/web-client/components/base/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/base/accordion';
import { Skeleton } from '@/components/base/skeleton';
import {
  InterviewInsights,
  SharedInterviewFilter,
} from '@/components/pages/application-tracker/applications/validation';
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
    isLoading: isInsightsLoading,
    // isError: isInsightsError,
    data: interviewInsights,
  } = useGetInterviewInsights({ companyName: interviewFilter.companyName });

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
      {isInsightsLoading ? (
        <InterviewAccordionSkeleton />
      ) : (
        interviewInsights && (
          <InterviewAccordion interviewInsights={interviewInsights} />
        )
      )}
    </div>
  );
};

const InterviewAccordion = ({
  interviewInsights,
}: {
  interviewInsights: InterviewInsights;
}) => {
  return (
    <div className="col-span-1 md:col-span-1 bg-emerald-300 p-4 rounded-xl text-background h-fit sticky top-20 space-y-6">
      <div className="px-5">
        <h3 className="pt-2 text-background font-semibold text-lg">
          Interview Insights
        </h3>

        <div className="py-4 rounded-lg">
          <h4 className="text-md font-bold mb-2">Company Details</h4>
          <p className="text-sm font-medium">
            {interviewInsights?.companyDetails ||
              'No company details available.'}
          </p>
        </div>

        <div className="py-4 rounded-lg">
          <h4 className="text-md font-bold mb-2">Company Products</h4>
          <p className="text-sm font-medium">
            {interviewInsights?.companyProducts ||
              'No product details available.'}
          </p>
        </div>

        <div className="py-4 rounded-lg">
          <h4 className="text-lg font-bold">Interview Insights</h4>

          <Accordion type="multiple" className="w-full text-background">
            <AccordionItem value="commonQuestions">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                Common Questions
              </AccordionTrigger>
              <AccordionContent className="text-sm font-medium">
                {interviewInsights?.interviewInsights?.commonQuestions &&
                  (Array.isArray(
                    interviewInsights.interviewInsights.commonQuestions
                  ) &&
                  interviewInsights.interviewInsights.commonQuestions.length >
                    0 ? (
                    <ul className="list-disc pl-5">
                      {interviewInsights.interviewInsights.commonQuestions.map(
                        (question, index) => (
                          <li key={index}>{question}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    'No common questions available.'
                  ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="interviewProcess">
              <AccordionTrigger className="text-left text-base font-semibold px-0 hover:no-underline">
                Interview Process
              </AccordionTrigger>
              <AccordionContent className="text-sm font-medium">
                {interviewInsights?.interviewInsights?.interviewProcess ||
                  'No interview process details available.'}
              </AccordionContent>
            </AccordionItem>

            {/* Tips */}
            <AccordionItem value="tips">
              <AccordionTrigger className="text-left text-base font-semibold px-0 hover:no-underline">
                Tips
              </AccordionTrigger>
              <AccordionContent className="text-sm font-medium">
                {interviewInsights?.interviewInsights?.tips ||
                  'No tips available.'}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
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

const InterviewAccordionSkeleton = () => {
  return (
    <div className="col-span-1 md:col-span-1 bg-emerald-300 p-4 rounded-xl text-background h-fit sticky top-20">
      <h3 className="text-background font-semibold text-sm mb-3">
        Interview Insights
      </h3>
      <Accordion type="single" collapsible className="w-full text-background">
        <AccordionItem value="tip1">
          <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
            <div className="flex items-center gap-3 w-full text-start">
              <Skeleton className="h-6 w-6 rounded-full" />
              <span>
                <Skeleton className="h-4 w-24" />
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-medium font-semibold">
            <Skeleton className="h-4 w-full" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
