import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { closeNotifications } from "../redux/notificationSlice";
import { Alert, Slide } from "@mui/material";

export default function NotificationLayer() {
  const dispatch = useDispatch();
  const onClose = (): void => {
    dispatch(closeNotifications());
  };
  const notificationsState = useSelector(
    (state: RootState) => state.notifications
  );

  return (
    <Snackbar
      sx={{
        ".MuiSnackbarContent-root": {
          backgroundColor: notificationsState.error ? "darkred" : "black",
          color: "white",
        },
      }}
      onClick={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={Slide}
      open={notificationsState.open}
      autoHideDuration={3000}
      onClose={onClose}
      message={notificationsState.message}
    />
  );
}
