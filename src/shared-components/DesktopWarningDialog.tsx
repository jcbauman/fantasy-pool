import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { FC, useState } from "react";
import theme from "../theme";

export const DesktopWarningDialog: FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const isNonPhoneWidth = useMediaQuery(theme.breakpoints.up("sm")); // 'sm' is 600px
  return (
    <Dialog
      open={!dismissed && isNonPhoneWidth}
      onClose={() => setDismissed(true)}
    >
      <DialogTitle>
        This is a mobile app, please use it on your phone{" "}
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => setDismissed(true)} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
