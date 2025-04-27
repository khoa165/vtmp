import { useEffect, useState } from 'react';
import AOS from 'aos';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PeopleContainer } from 'src/components/people';
import { StatsContainer } from 'src/components/stats';
import { ProjectsContainer } from 'src/components/projects';
import { SummaryContainer } from 'src/components/summary';
import 'src/styles/scss/app.scss';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
import { Toaster } from '@/components/base/sonner';
import { LinksPage } from '@/components/pages/application-tracker/links/links-page';
import ApplicationPage from '@/components/pages/application-tracker/applications/application-page';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div id="mentorship-website">
        <Toaster richColors />
        <Router>
          <Routes>
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
              <Route path="/link-sharing" element={<LinksPage />} />
            </Route>
            <Route path="/application-tracker" element={<ApplicationPage />} />
            <Route path="/*" element={<LandingContainer />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};
