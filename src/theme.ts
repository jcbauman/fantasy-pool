import { createTheme } from "@mui/material/styles";

export const getTheme = (isStandalone?: boolean) =>
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#000000",
      },
      secondary: {
        main: "#cc1301",
        light: "#000000",
      },
      info: {
        main: "#ebb604",
        light: "#000000",
      },
      background: {
        default: "#303030",
        paper: "#424242",
      },
      text: {
        primary: "#ffffff",
        secondary: "#bdbdbd",
      },
    },
    typography: {
      fontFamily: "Avenir, Arial, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
          outlined: {
            color: "#ffffff",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            marginBottom: isStandalone ? "32px" : "default",
            color: "#ffffff",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: "100%",
            width: "4px",
            left: 0,
            backgroundColor: "black",
            borderBottom: "2px solid darkred",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            position: "relative",
            minWidth: 120,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px 16px",
            zIndex: 1,
            color: "inherit",
            fontWeight: "normal",
            "&.Mui-selected": {
              color: "#ffffff",
              fontWeight: "bold",
            },
          },
        },
      },
      MuiListItemSecondaryAction: {
        styleOverrides: {
          root: {
            right: 0,
          },
        },
      },
    },
  });
