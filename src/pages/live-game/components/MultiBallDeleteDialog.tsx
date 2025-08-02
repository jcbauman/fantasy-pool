import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Game, GameStatKeys } from "../../../types";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: (numBalls: number) => void;
  selectedPlayerName: string;
  selectedPlayerId: string;
  currentGame: Game | null;
}

export const MultiBallDeleteDialog: FC<MultiBallDialogProps> = ({
  open,
  onClose,
  onConfirmDelete,
  selectedPlayerName,
  selectedPlayerId,
  currentGame,
}) => {
  const thisPlayerStats = currentGame?.statsByPlayer.find(
    (stat) => stat.playerId === selectedPlayerId
  );
  const buttons = [
    { num: 3, key: GameStatKeys.threeBallsPocketedInRow },
    { num: 4, key: GameStatKeys.fourBallsPocketedInRow },
    { num: 5, key: GameStatKeys.fiveBallsPocketedInRow },
    { num: 6, key: GameStatKeys.sixBallsPocketedInRow },
    { num: 7, key: GameStatKeys.sevenBallsPocketedInRow },
    { num: 8, key: GameStatKeys.runTheTable },
  ];

  const initialValue =
    buttons.find((value) => {
      return (thisPlayerStats?.[value.key] ?? 0) > 0;
    })?.num ?? 0;

  const [numBalls, setNumBalls] = useState(initialValue);
  useEffect(() => {
    setNumBalls(initialValue);
  }, [initialValue]);
  return (
    <Drawer open={open} onClose={onClose} anchor="bottom">
      <DialogTitle>
        <Stack
          direction="row"
          sx={{ alignItems: "center", lineHeight: 1 }}
          spacing={2}
        >
          Delete which stat from {selectedPlayerName}?
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Typography>
            Select the number of balls pocketed in a row to delete from{" "}
            {selectedPlayerName}.
          </Typography>
          <Stack
            direction="row"
            sx={{ width: "100%", justifyContent: "space-between" }}
          >
            {buttons.map((value) => [
              <Button
                key={value.num}
                sx={{
                  width: 48,
                  height: 48,
                  minWidth: 0,
                  padding: 0,
                  borderRadius: "50%",
                  fontSize: "1rem",
                  color: "white",
                }}
                variant={numBalls === value.num ? "contained" : "text"}
                onClick={() => setNumBalls(value.num)}
                disabled={!thisPlayerStats?.[value.key]}
              >
                {value.num}
              </Button>,
            ])}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          disabled={numBalls === 0}
          color="error"
          variant="contained"
          size="large"
          onClick={() => {
            onConfirmDelete(numBalls);
            onClose();
          }}
        >
          Delete for {selectedPlayerName}
        </Button>
      </DialogActions>
    </Drawer>
  );
};
