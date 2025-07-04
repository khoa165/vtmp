import AOS from 'aos';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { SystemRole } from '@vtmp/common/constants';

import { allBlogsMetadata } from '@/blogs/metadata';
import { Mentorship2025Apply } from '@/components/apply';
import { BlogContainer } from '@/components/blogs';
import { LandingContainer } from '@/components/landing';
import { PageWithNavigation } from '@/components/layout/page-with-navigation';
import { PageWithPermission } from '@/components/layout/page-with-permission';
import { PageWithSidebar } from '@/components/layout/page-with-sidebar';
import { PageWithToast } from '@/components/layout/page-with-toast';
import { VTMPWrapper } from '@/components/layout/vtmp-wrapper';
import { InvitationsPage } from '@/components/pages/admins/invitations/invitations-page';
import { AdminLinksPage } from '@/components/pages/admins/links/admin-links-page';
import { ApplicationsPage } from '@/components/pages/application-tracker/applications/applications-page';
import { JobPostingsPage } from '@/components/pages/application-tracker/job-postings/job-postings-page';
import JobtrackrLanding from '@/components/pages/application-tracker/landing/jobtrackr-landing';
import { LinksPage } from '@/components/pages/application-tracker/links/links-page';
import { LoginPage } from '@/components/pages/auth/login';
import { RequireAuth } from '@/components/pages/auth/require-auth';
import { SignUpPage } from '@/components/pages/auth/signup';
import { NotFoundPage } from '@/components/pages/shared/not-found-page';
import { PeopleContainer } from '@/components/people';
import { ProjectsContainer } from '@/components/projects';
import { Mentorship2025Proposal } from '@/components/proposal';
import { StatsContainer } from '@/components/stats';
import { SummaryContainer } from '@/components/summary';
import { TreeContainer } from '@/components/tree';
import { BlogFileMapping } from '@/types';
import { buildFileMetadata } from '@/utils/file';

export const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const [metadata, setMetadata] = useState<BlogFileMapping | null>(null);

  useEffect(() => {
    setMetadata(buildFileMetadata(allBlogsMetadata));
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<VTMPWrapper />}>
          <Route path="/" element={<LandingContainer />} />
          <Route path="/apply" element={<Mentorship2025Apply />} />
          <Route path="/apply-pd" element={<Mentorship2025Apply />} />
          <Route path="/proposal" element={<Mentorship2025Proposal />} />
          <Route element={<PageWithNavigation />}>
            <Route path="/summary" element={<SummaryContainer />} />
            <Route path="/people/*" element={<PeopleContainer />} />
            <Route
              path="/resources"
              element={<TreeContainer metadata={metadata} />}
            />
            {metadata != null && (
              <Route
                path="resources/:filename"
                element={<BlogContainer metadata={metadata} />}
              />
            )}
            <Route path="/projects" element={<ProjectsContainer />} />
            <Route path="/stats/*" element={<StatsContainer />} />
          </Route>
        </Route>
        <Route path="/jobtrackr" element={<JobtrackrLanding />} />
        <Route element={<PageWithToast />}>
          <Route
            element={
              <RequireAuth>
                <PageWithSidebar />
              </RequireAuth>
            }
          >
            <Route path="/links" element={<LinksPage />} />
            <Route path="/jobs" element={<JobPostingsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />

            <Route
              path="/admin"
              element={<PageWithPermission roles={[SystemRole.ADMIN]} />}
            >
              <Route path="invitations" element={<InvitationsPage />} />
              <Route path="links" element={<AdminLinksPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
