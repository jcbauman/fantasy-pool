import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
} from "@mui/material";
import { FC } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DiscardDialog: FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this pool game?</DialogTitle>
      <DialogContent>
        The stats you tracked will be permanently deleted.
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<DeleteOutlinedIcon />}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Drawer>
  );
};
