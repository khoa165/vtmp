import React from 'react';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const VTMPWrapper = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div id="mentorship-website">
        <Outlet />
      </div>
    </ThemeProvider>
  );
};
