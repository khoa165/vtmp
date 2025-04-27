import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';

export const VTMPWrapper = () => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div id="mentorship-website">
        <Outlet />
      </div>
    </ThemeProvider>
  );
};
