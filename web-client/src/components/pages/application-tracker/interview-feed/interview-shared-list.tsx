import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/base/accordion';
import { Skeleton } from '@/components/base/skeleton';
import { useGetSharedInterviews } from '@/components/pages/application-tracker/interview-feed/hooks/interviews';
import { InterviewCard } from '@/components/pages/application-tracker/interview-feed/interview-card';
import { InterviewFilter } from '@/components/pages/application-tracker/interview-feed/interview-feed-container';

export const InterviewSharedList = ({
  interviewFilter,
}: {
  interviewFilter: InterviewFilter;
}) => {
  const {
    isLoading,
    isError,
    data: sharedInterviewData,
  } = useGetSharedInterviews(interviewFilter);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-background border border-background p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3">
        <div className="flex items-center gap-4">
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
  }

  if (isError) {
    throw new Error('Error loading interviews');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
      <div className="col-span-1 md:col-span-2">
        {(Array.isArray(sharedInterviewData) ? sharedInterviewData : [])
          .sort(
            (a, b) =>
              new Date(b.interviewOnDate).getTime() -
              new Date(a.interviewOnDate).getTime()
          )
          .map((interview) => (
            <InterviewCard interview={interview} />
          ))}
      </div>

      <div className="bg-emerald-300 p-4 rounded-xl text-background h-fit sticky top-20">
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
              Be honest. Show your thought process, and ask for clarifications
              if needed.
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

          <AccordionItem value="tip4">
            <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
              <div className="flex items-start gap-3 w-full text-start">
                <div className="text-2xl font-bold text-background opacity-70">
                  4
                </div>
                <span>Should I ask questions at the end of the interview?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-medium font-semibold">
              Yes! Prepare thoughtful questions that show interest in the team
              or role. It demonstrates engagement.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tip5">
            <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
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
              Practice helps. Take deep breaths, stay positive, and focus on the
              conversation instead of perfection.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tip6">
            <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
              <div className="flex items-start gap-3 w-full text-start">
                <div className="text-2xl font-bold text-background opacity-70">
                  6
                </div>
                <span>How important is body language during interviews?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-medium font-semibold">
              Very important. Sit upright, make eye contact, smile when
              appropriate, and avoid fidgeting.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tip7">
            <AccordionTrigger className="text-left text-lg font-semibold px-0 hover:no-underline">
              <div className="flex items gap-3 w-full text-start">
                <div className="text-2xl font-bold text-background opacity-70">
                  7
                </div>
                <span>Should I follow up after the interview?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-medium font-semibold">
              Yes. Send a brief thank-you email within 24 hours to express
              appreciation and reiterate interest.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
