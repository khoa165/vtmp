import { useEffect, useState } from 'react';
import AOS from 'aos';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PeopleContainer } from 'src/components/people';
import { StatsContainer } from 'src/components/stats';
import { ProjectsContainer } from 'src/components/projects';
import { SummaryContainer } from 'src/components/summary';
// import { allBlogsFilepaths, allBlogsMetadata } from 'src/blogs/metadata';
// import { buildFileMetadata } from 'src/utils/file';
import { BlogFileMapping } from 'src/types';
import { LandingContainer } from 'src/components/landing';
import { BlogContainer } from 'src/components/blogs';
import { PageWithNavigation } from 'src/components/layout/page-with-navigation';
import { TreeContainer } from 'src/components/tree';
import { Mentorship2025Apply } from 'src/components/apply';
import { Mentorship2025Proposal } from './proposal';
import { Playground } from '@/components/playground';
import LoginPage from '@/components/pages/auth/login';
import { PageWithSidebar } from '@/components/layout/page-with-sidebar';
import { VTMPWrapper } from '@/components/layout/vtmp-wrapper';
import { UserInvitationPage } from '@/components/pages/admins/users/user-invitation';
import { JobPostingPage } from '@/components/pages/application-tracker/job-postings/job-postings';
import { ApplicationPage } from '@/components/pages/application-tracker/applications/applications';
import { PageWithToast } from '@/components/layout/page-with-toast';
import { LinksPage } from '@/components/pages/application-tracker/links/links-page';

export const App = () => {
  useEffect(() => {
    // import('@/blogs/content/vtmp-2023/2023-04-30-using-git.md').then((res) => {
    //   fetch(res.default)
    //     .then((response) => response.text())
    //     .then((text) => console.log(text));
    // });
    AOS.init();
  }, []);

  const [metadata] = useState<BlogFileMapping | null>(null);

  useEffect(() => {
    // setMetadata(buildFileMetadata(allBlogsFilepaths, allBlogsMetadata));
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
            <Route path="/playground" element={<Playground />} />
          </Route>
        </Route>
        <Route element={<PageWithToast />}>
          <Route path="/playground" element={<Playground />} />
          <Route element={<PageWithSidebar />}>
            <Route path="/link-sharing" element={<LinksPage />} />
            <Route path="/job-postings" element={<JobPostingPage />} />
            <Route path="/user-invitation" element={<UserInvitationPage />} />
            <Route path="/application-tracker" element={<ApplicationPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<>404</>} />
      </Routes>
    </Router>
  );
};
