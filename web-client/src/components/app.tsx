import { useEffect, useState } from 'react';
import AOS from 'aos';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PeopleContainer } from '@/components/people';
import { StatsContainer } from '@/components/stats';
import { ProjectsContainer } from '@/components/projects';
import { SummaryContainer } from '@/components/summary';
// import { allBlogsFilepaths, allBlogsMetadata } from '@/blogs/metadata';
// import { buildFileMetadata } from '@/utils/file';
import { BlogFileMapping } from '@/types';
import { LandingContainer } from '@/components/landing';
import { BlogContainer } from '@/components/blogs';
import { PageWithNavigation } from '@/components/layout/page-with-navigation';
import { TreeContainer } from '@/components/tree';
import { Mentorship2025Apply } from '@/components/apply';
import { Mentorship2025Proposal } from './proposal';
import LoginPage from '@/components/pages/auth/login';
import { PageWithSidebar } from '@/components/layout/page-with-sidebar';
import { VTMPWrapper } from '@/components/layout/vtmp-wrapper';
import { UserInvitationPage } from './pages/admins/users/invitation-dashboard/invitation-page';
import { JobPostingsPage } from '@/components/pages/application-tracker/job-postings/job-postings-page';
import { PageWithToast } from '@/components/layout/page-with-toast';
import { LinksPage } from '@/components/pages/application-tracker/links/links-page';
import { ApplicationsPage } from '@/components/pages/application-tracker/applications/applications-page';
import { SignUpPage } from '@/components/pages/auth/signup';
import { AdminLinksPage } from '@/components/pages/admins/links/admin-links-page';
import { NotFoundPage } from '@/components/pages/shared/not-found-page';
import { ProtectedRoute } from '@/utils/protect-route';
import { UserRole } from '@vtmp/common/constants';
import { buildFileMetadata } from '@/utils/file';
import { allBlogsMetadata } from '@/blogs/metadata';
import { RequireAuth } from '@/components/pages/auth/require-auth';
import JobtrackrLanding from '@/components/pages/application-tracker/landing/jobtrackr-landing';

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
            <Route path="/link-sharing" element={<LinksPage />} />
            <Route path="/job-postings" element={<JobPostingsPage />} />
            <Route
              path="/user-invitation"
              element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <UserInvitationPage />
                </ProtectedRoute>
              }
            />
            <Route path="/application-tracker" element={<ApplicationsPage />} />
            <Route path="/admin/links" element={<AdminLinksPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
