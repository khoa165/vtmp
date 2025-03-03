import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PeopleContainer } from 'components/people';
import { StatsContainer } from 'components/stats';
import { ProjectsContainer } from 'components/projects';
import { SummaryContainer } from 'components/summary';
import 'styles/scss/app.scss';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { allBlogsFilepaths, allBlogsMetadata } from 'blogs/metadata';
import { buildFileMetadata } from 'utils/file';
import { BlogFileMapping } from 'types';
import { LandingContainer } from 'components/landing';
import { BlogContainer } from 'components/blogs';
import { PageWithNavigation } from 'components/layout/page-with-navigation';
import { TreeContainer } from 'components/tree';
import { Mentorship2025Apply } from 'components/apply';
import { Mentorship2025Proposal } from './proposal';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const [metadata, setMetadata] = useState<BlogFileMapping | null>(null);

  useEffect(() => {
    setMetadata(buildFileMetadata(allBlogsFilepaths, allBlogsMetadata));
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div id="mentorship-website">
        <Router>
          <Routes>
            {metadata != null && (
              <Route
                path="blogs/:filename"
                element={<BlogContainer metadata={metadata} />}
              />
            )}
            <Route path="apply" element={<Mentorship2025Apply />} />
            <Route path="apply-pd" element={<Mentorship2025Apply />} />
            <Route path="proposal" element={<Mentorship2025Proposal />} />
            <Route element={<PageWithNavigation />}>
              <Route path="/summary" element={<SummaryContainer />} />
              <Route path="/people/*" element={<PeopleContainer />} />
              <Route
                path="/resources"
                element={<TreeContainer metadata={metadata} />}
              />
              <Route path="/projects" element={<ProjectsContainer />} />
              <Route path="/stats/*" element={<StatsContainer />} />
            </Route>
            <Route path="/*" element={<LandingContainer />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};
