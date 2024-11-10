import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {  GameStatKeys } from "../../../types";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: (numBalls: number) => void;
  selectedPlayerName: string;
  selectedPlayerId: string;
}

export const MultiBallDeleteDialog: FC<MultiBallDialogProps> = ({
  open,
  onClose,
  onConfirmDelete,
  selectedPlayerName,
  selectedPlayerId,
}) => {
  const currentGame = useSelector((state: RootState) => state.game.currentGame);
  const thisPlayerStats = currentGame?.statsByPlayer.find(
    (stat) => stat.playerId === selectedPlayerId
  );

  const [numBalls, setNumBalls] = useState(0);
  const buttons = [
    { num: 3, key: GameStatKeys.threeBallsPocketedInRow },
    { num: 4, key: GameStatKeys.fourBallsPocketedInRow },
    { num: 5, key: GameStatKeys.fiveBallsPocketedInRow },
    { num: 6, key: GameStatKeys.sixBallsPocketedInRow },
    { num: 7, key: GameStatKeys.sevenBallsPocketedInRow },
    { num: 8, key: GameStatKeys.runTheTable },
  ];
  return (
    <Dialog open={open} onClose={onClose}>
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
          <ButtonGroup
            variant="outlined"
            aria-label="# ball selection group"
            sx={{ width: "100%" }}
          >
            {buttons.map((value) => [
              <Button
                fullWidth
                key={value.num}
                variant={numBalls === value.num ? "contained" : "outlined"}
                onClick={() => setNumBalls(value.num)}
                disabled={!thisPlayerStats?.[value.key]}
              >
                {value.num}
              </Button>,
            ])}
          </ButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={numBalls === 0}
          color="error"
          variant="contained"
          onClick={() => {
            onConfirmDelete(numBalls);
            onClose();
          }}
        >
          Delete this stat for {getPlayerNameAbbreviation(selectedPlayerName)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
