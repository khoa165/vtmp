import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#vtmp/web-client/components/base/accordion';
import { Skeleton } from '#vtmp/web-client/components/base/skeleton';
import {
  InterviewInsights,
  SharedInterviewFilter,
} from '#vtmp/web-client/components/pages/application-tracker/applications/validation';
import { useGetInterviewInsights } from '#vtmp/web-client/components/pages/application-tracker/interview-feed/hooks/interviews';
import { CustomError } from '#vtmp/web-client/utils/errors';

export const InterviewAccordion = ({
  interviewFilter,
}: {
  interviewFilter: Pick<SharedInterviewFilter, 'companyName'>;
}) => {
  const {
    isLoading: isInsightsLoading,
    error: insightError,
    data: interviewInsights,
  } = useGetInterviewInsights({
    companyName: interviewFilter.companyName,
  });

  if (insightError) {
    console.error('Error fetching interview insights data', insightError);
    throw new CustomError('Error fetching interview insights data');
  }

  if (isInsightsLoading) {
    return <InterviewAccordionSkeleton />;
  }

  return (
    <>
      <InterviewAccordionContent
        companyName={interviewFilter.companyName}
        interviewInsights={interviewInsights}
      />
    </>
  );
};

const InterviewAccordionContent = ({
  companyName,
  interviewInsights,
}: {
  companyName?: string;
  interviewInsights?: InterviewInsights;
}) => {
  return (
    <div className="col-span-1 md:col-span-1 bg-emerald-300 p-4 rounded-xl text-background h-fit space-y-6">
      <div className="px-5">
        <h3 className="pt-2 text-background font-semibold text-lg">Insights</h3>

        {interviewInsights ? (
          <>
            <div className="py-4 rounded-lg">
              <h4 className="text-lg font-bold mb-2">About {companyName}</h4>
              <p className="text-sm font-medium">
                {interviewInsights?.companyDetails ||
                  'No company details available.'}
              </p>
            </div>

            <Accordion type="multiple" className="w-full text-background">
              <AccordionItem value="products">
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
                  <div className="flex items-center gap-3 w-full text-start text-lg font-bold">
                    <span>Products</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm font-medium">
                  {interviewInsights?.companyProducts ||
                    'No product details available.'}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="interviewInsights">
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
                  <div className="flex items-center gap-3 w-full text-start text-lg font-bold">
                    <span>Interview Insights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm font-medium">
                  <Accordion type="multiple" className="w-full text-background">
                    <AccordionItem value="commonQuestions">
                      <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                        Common Questions
                      </AccordionTrigger>
                      <AccordionContent className="text-sm font-medium">
                        {interviewInsights?.interviewInsights
                          ?.commonQuestions &&
                          (Array.isArray(
                            interviewInsights.interviewInsights.commonQuestions
                          ) &&
                          interviewInsights.interviewInsights.commonQuestions
                            .length > 0 ? (
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
                        {interviewInsights?.interviewInsights
                          ?.interviewProcess ||
                          'No interview process details available.'}
                      </AccordionContent>
                    </AccordionItem>

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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <>
            <Accordion
              type="single"
              collapsible
              className="w-full text-background"
            >
              <AccordionItem value="tip1">
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
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
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
                  <div className="flex items-center gap-3 w-full text-start">
                    <div className="text-2xl font-bold text-background opacity-70">
                      2
                    </div>
                    <span>What should I say if I do not know the answer?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-md font-semibold">
                  Be honest. Show your thought process, and ask for
                  clarifications if needed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tip3">
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
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

              <AccordionItem value="tip4">
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
                  <div className="flex items-start gap-3 w-full text-start">
                    <div className="text-2xl font-bold text-background opacity-70">
                      4
                    </div>
                    <span>
                      Should I ask questions at the end of the interview?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-md font-semibold">
                  Yes! Prepare thoughtful questions that show interest in the
                  team or role. It demonstrates engagement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tip5">
                <AccordionTrigger className="text-left text-md font-semibold px-0 hover:no-underline">
                  <div className="flex items-start gap-3 w-full text-start">
                    <div className="text-2xl font-bold text-background opacity-70">
                      5
                    </div>
                    <span>
                      How do I handle nervousness before or during an interview?
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-medium font-semibold">
                  Practice helps. Take deep breaths, stay positive, and focus on
                  the conversation instead of perfection.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </div>
    </div>
  );
};

const InterviewAccordionSkeleton = () => {
  return (
    <div className="col-span-1 md:col-span-1 bg-emerald-300 p-4 rounded-xl text-background h-fit sticky top-20 space-y-6">
      <div className="px-5">
        <h3 className="pt-2 text-background font-semibold text-lg">
          Interview Insights
        </h3>

        <div className="py-4 rounded-lg space-y-3">
          <Skeleton className="h-5 w-48" />

          <Accordion
            type="multiple"
            className="w-full text-background space-y-2"
          >
            <AccordionItem value="commonQuestions">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                <Skeleton className="h-4 w-40" />
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="interviewProcess">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                <Skeleton className="h-4 w-40" />
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tips">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                <Skeleton className="h-4 w-40" />
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-4/5" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
