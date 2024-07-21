import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (numBalls: number) => void;
}

export const MultiBallDialog: FC<MultiBallDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [numBalls, setNumBalls] = useState(3);
  const buttons = [3, 4, 5, 6, 7, 8];
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={2}>
          <DirectionsRunIcon />
          How many balls did you get?
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Typography>
            Select the number of balls you pocketed in a row before missing or
            ending the game.
          </Typography>
          <ButtonGroup
            variant="outlined"
            aria-label="# ball selection group"
            sx={{ width: "100%" }}
          >
            {buttons.map((value) => [
              <Button
                fullWidth
                key={value}
                variant={numBalls === value ? "contained" : "outlined"}
                onClick={() => setNumBalls(value)}
              >
                {value}
              </Button>,
            ])}
          </ButtonGroup>
          {numBalls > 6 && (
            <Stack
              direction="row"
              sx={{ justifyContent: "center", width: "100%" }}
            >
              <Typography variant="h4">BRUH</Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm(numBalls);
            onClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
