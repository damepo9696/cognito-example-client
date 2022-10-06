import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
        elevation: 0,
        sx: {
          padding: 2,
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
  },
});
