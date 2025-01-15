import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Stack,
} from "@mui/material";
import { FC, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
  gameIsIncomplete?: boolean;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onDiscard,
  gameIsIncomplete,
}) => {
  const [loading, setLoading] = useState(false);
  const title = gameIsIncomplete
    ? "Game is incomplete"
    : "Are you sure you want to end this pool session?";
  const body = gameIsIncomplete
    ? "Please ensure all players have a win/loss recorded before submitting."
    : `Your games will be saved and will affect the league's stats.`;
  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between", width: "100%" }}
        >
          <IconButton size="large" onClick={onDiscard}>
            <DeleteOutlinedIcon color="error" />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={loading || gameIsIncomplete}
              variant="contained"
              onClick={() => {
                setLoading(true);
                onConfirm();
                onClose();
              }}
            >
              {loading ? <CircularProgress size="1.5rem" /> : "Save & End"}
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Drawer>
  );
};
