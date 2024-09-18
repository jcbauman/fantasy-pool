import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Game } from "../../../types";
import { MultiPlayerGameLog } from "../../games/components.tsx/MultiPlayerGameLog";
import { getStartOfMonth } from "../adminUtils";

interface HistoricalRecordDialogProps {
  open: boolean;
  onClose: () => void;
  historicalGame: Game | undefined;
  onSave: () => Promise<void>;
}
export const HistoricalRecordDialog: FC<HistoricalRecordDialogProps> = ({
  open,
  onClose,
  historicalGame,
  onSave,
}) => {
  const startOfMonth = getStartOfMonth(new Date());
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Review historical game stats</DialogTitle>
      <DialogContent>
        <Typography>Until {startOfMonth.toString()}</Typography>
        {historicalGame ? (
          <MultiPlayerGameLog game={historicalGame} />
        ) : (
          "Nothing to show"
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose} fullWidth>
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            onSave();
            onClose();
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
