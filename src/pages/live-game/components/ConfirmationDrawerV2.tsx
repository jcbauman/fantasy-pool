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
import { FC } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface ConfirmationDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
  loading: boolean;
}

export const ConfirmationDrawerV2: FC<ConfirmationDrawerProps> = ({
  open,
  onClose,
  onConfirm,
  onDiscard,
  loading,
}) => {
  return (
    <Drawer open={open} anchor="bottom" onClose={loading ? undefined : onClose}>
      <DialogTitle>Are you sure you want to end this game?</DialogTitle>
      <DialogContent>
        Your game will be saved and will affect the league's stats.
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "space-between", width: "100%" }}
        >
          <IconButton size="large" onClick={onDiscard} disabled={loading}>
            <DeleteOutlinedIcon color="error" />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              variant="contained"
              onClick={() => {
                onConfirm();
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
