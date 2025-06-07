import { useEffect, useState } from 'react';
import AOS from 'aos';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PeopleContainer } from '@/components/people';
import { StatsContainer } from '@/components/stats';
import { ProjectsContainer } from '@/components/projects';
import { SummaryContainer } from '@/components/summary';
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
import { UserInvitationPage } from '@/components/pages/admins/users/user-invitation';
import { JobPostingsPage } from '@/components/pages/application-tracker/job-postings/job-postings-page';
import { PageWithToast } from '@/components/layout/page-with-toast';
import { LinksPage } from '@/components/pages/application-tracker/links/links-page';
import { ApplicationsPage } from '@/components/pages/application-tracker/applications/applications-page';
import { SendInvitationPage } from '@/components/pages/admins/invitations/send-invitation';
import { AdminLinksPage } from '@/components/pages/admins/links/admin-links-page';
import { NotFoundPage } from './pages/shared/not-found-page';
import { ProtectedRoute } from '@/utils/protect-route';
import { UserRole } from '@vtmp/common/constants';
import { buildFileMetadata } from '@/utils/file';
import { allBlogsMetadata } from '@/blogs/metadata';

export const App = () => {
  useEffect(() => {
    // import('@/blogs/content/vtmp-2023/2023-04-30-using-git.md').then((res) => {
    //   fetch(res.default)
    //     .then((response) => response.text())
    //     .then((text) => console.log(text));
    // });
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
        <Route element={<PageWithToast />}>
          <Route element={<PageWithSidebar />}>
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
            <Route
              path="/admin/send-invitation"
              element={<SendInvitationPage />}
            />
            <Route path="/admin/links" element={<AdminLinksPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
