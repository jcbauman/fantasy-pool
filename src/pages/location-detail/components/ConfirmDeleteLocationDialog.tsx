import { Button, DialogActions, DialogTitle, Drawer } from "@mui/material";
import { FC } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteLocationDialog: FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this pool hall?</DialogTitle>
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
