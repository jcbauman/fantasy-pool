import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getSeasonEmoji, getSeasonString } from "../../../utils/dateUtils";

export const NewSeasonDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {getSeasonEmoji()} A new Fantasy Pool season has begun
      </DialogTitle>
      <DialogContent>
        Let's get it on. Best of luck in {getSeasonString()}!
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} fullWidth variant="contained" size="large">
          Start Balling
        </Button>
      </DialogActions>
    </Dialog>
  );
};
