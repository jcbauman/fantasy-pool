import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (numBalls: number) => void;
  selectedPlayerName: string;
}

export const MultiBallDialog: FC<MultiBallDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedPlayerName,
}) => {
  const [numBalls, setNumBalls] = useState(3);
  const buttons = [3, 4, 5, 6, 7, 8];
  return (
    <Drawer open={open} onClose={onClose} anchor="bottom">
      <DialogTitle>
        <Stack
          direction="row"
          sx={{ alignItems: "center", lineHeight: 1 }}
          spacing={2}
        >
          How many balls did {selectedPlayerName} get?
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Typography>
            Select the number of balls {selectedPlayerName} pocketed in a row
            before missing or ending the game. (If you made a ball off the break
            count, that counts as 1.)
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
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm(numBalls);
            onClose();
          }}
        >
          Confirm for {getPlayerNameAbbreviation(selectedPlayerName)}
        </Button>
      </DialogActions>
    </Drawer>
  );
};
