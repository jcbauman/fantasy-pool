import {
  Button,
  Collapse,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";

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
          <Stack
            direction="row"
            sx={{ width: "100%", justifyContent: "space-between" }}
          >
            {buttons.map((value) => [
              <Button
                key={value}
                sx={{
                  width: 48,
                  height: 48,
                  minWidth: 0,
                  padding: 0,
                  borderRadius: "50%",
                  fontSize: "1rem",
                  color: "white",
                }}
                variant={numBalls === value ? "contained" : "text"}
                onClick={() => setNumBalls(value)}
              >
                {value}
              </Button>,
            ])}
          </Stack>
          <Collapse
            collapsedSize={0}
            in={numBalls > 6}
            sx={{ justifyContent: "center", width: "100%" }}
          >
            <Typography variant="h4" align="center">
              BRUH
            </Typography>
          </Collapse>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={() => {
            onConfirm(numBalls);
            onClose();
          }}
        >
          Confirm for {selectedPlayerName}
        </Button>
      </DialogActions>
    </Drawer>
  );
};
