import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#vtmp/web-client/components/base/accordion';
import { ErrorBoundaryWrapper } from '#vtmp/web-client/components/base/error-boundary';
import { SharedInterviewFilter } from '#vtmp/web-client/components/pages/application-tracker/applications/validation';
import { InterviewAccordion } from '#vtmp/web-client/components/pages/application-tracker/interview-feed/interview-accordion';
import { InterviewFilterContainer } from '@/components/pages/application-tracker/interview-feed/interview-filter-container';
import { InterviewSharedList } from '@/components/pages/application-tracker/interview-feed/interview-shared-list';

export const InterviewFeedContainer = () => {
  const [interviewFilter, setInterviewFilter] = useState<SharedInterviewFilter>(
    {}
  );
  return (
    <>
      <InterviewFilterContainer
        interviewFilter={interviewFilter}
        setInterviewFilter={setInterviewFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-10">
        <div className="col-span-1 md:col-span-2">
          <ErrorBoundaryWrapper customText="Interview Feed">
            <InterviewSharedList interviewFilter={interviewFilter} />
          </ErrorBoundaryWrapper>
        </div>
        {interviewFilter.companyName ? (
          <ErrorBoundaryWrapper customText="Interview Insights">
            <InterviewAccordion interviewFilter={interviewFilter} />
          </ErrorBoundaryWrapper>
        ) : (
          <InterviewAccordionContentDefault />
        )}
      </div>
    </>
  );
};

const InterviewAccordionContentDefault = () => {
  return (
    <div className="col-span-1 md:col-span-1 bg-emerald-300 p-4 rounded-xl text-background h-fit space-y-6">
      <div className="px-5">
        <h3 className="pt-2 text-background font-semibold text-lg">Insights</h3>
        <Accordion type="single" collapsible className="w-full text-background">
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
              Be honest. Show your thought process, and ask for clarifications
              if needed.
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
                <span>Should I ask questions at the end of the interview?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-md font-semibold">
              Yes! Prepare thoughtful questions that show interest in the team
              or role. It demonstrates engagement.
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
              Practice helps. Take deep breaths, stay positive, and focus on the
              conversation instead of perfection.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
