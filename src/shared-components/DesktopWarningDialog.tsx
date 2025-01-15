import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { FC, useState } from "react";
import { getTheme } from "../theme";

const DESKTOP_MODAL_INFO_KEY = "desktopInfoModalStoragekey";

export const DesktopWarningDialog: FC = () => {
  const [dismissed, setDismissed] = useState(
    Boolean(localStorage.getItem(DESKTOP_MODAL_INFO_KEY))
  );
  const isNonPhoneWidth = useMediaQuery(getTheme().breakpoints.up("sm")); // 'sm' is 600px
  const onClose = (): void => {
    localStorage.setItem(DESKTOP_MODAL_INFO_KEY, "true");
    setDismissed(true);
  };
  return (
    <Dialog open={!dismissed && isNonPhoneWidth} onClose={onClose}>
      <DialogTitle>
        This is a mobile app, please use it on your phone{" "}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
