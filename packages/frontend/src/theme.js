import {createTheme} from '@mui/material/styles';
import {red, purple, grey, common} from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: grey[50],
      paper: common.white,
    },
    primary: {
      main: red[500],
    },
    secondary: {
      main: purple.A400,
    },
    error: {
      main: red[500],
    },
  },
});

export default theme;