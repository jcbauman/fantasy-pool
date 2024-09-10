import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FC } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
}

export const InfoDialog: FC<ConfirmationDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Welcome to live game mode!</DialogTitle>
      <DialogContent>
        <List>
          <ListItem disablePadding>
            <ListItemText
              primary="Enter stats live"
              secondary="Iterate stats while you play or immediately after you finish for most accurate results."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Track multiple players at once"
              secondary="Just use the tabs to switch between which player you're tracking."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Playing doubles?"
              secondary="Wins and losses can be attributed to all players on a team, while indivual stats like runs and skill shots are per player."
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary="Honor code is key"
              secondary="This league runs entirely on honesty, so if you do it on the table, log it in the app."
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
