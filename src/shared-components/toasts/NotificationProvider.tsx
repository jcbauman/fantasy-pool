import React, { createContext, useState, ReactNode } from "react";
import { Snackbar, AlertColor, Slide } from "@mui/material";

interface Notification {
  message: string;
  severity: AlertColor;
}

type NotificationContextType = {
  sendNotification: (message: string, severity: AlertColor) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

let sendNotificationGlobal: (message: string, severity: AlertColor) => void;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  const sendNotification = (message: string, severity: AlertColor) => {
    setNotification({ message, severity });
    setOpen(true);
  };

  sendNotificationGlobal = sendNotification; // Set the global reference

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
      {notification && (
        // <Snackbar
        //   open={open}
        //   autoHideDuration={3000}
        //   onClose={handleClose}
        //   anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        // >
        //   <Alert
        //     onClose={handleClose}
        //     severity={notification.severity}
        //     sx={{ width: "100%" }}
        //   >
        //     {notification.message}
        //   </Alert>
        // </Snackbar>
        <Snackbar
          open={open}
          sx={{
            ".MuiSnackbarContent-root": {
              backgroundColor:
                notification.severity === "error" ? "darkred" : "black",
              color: "white",
            },
          }}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Slide}
          autoHideDuration={3000}
          message={notification.message}
        />
      )}
    </NotificationContext.Provider>
  );
};

// Export the global notification function
export const sendNotification = (message: string, severity: AlertColor) => {
  if (sendNotificationGlobal) {
    sendNotificationGlobal(message, severity);
  }
};
