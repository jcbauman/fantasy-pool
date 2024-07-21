import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { FC } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Are you sure you want to end this pool session?</DialogTitle>
      <DialogContent>
        Your games will be saved and will affect the league's stats.
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between", width: "100%" }}
        >
          <IconButton size="large">
            <DeleteOutlinedIcon color="error" />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <Button variant="text" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Save & End
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
