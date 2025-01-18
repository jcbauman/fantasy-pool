import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { GameStatKeys } from "../../../types";
import { SimpleStatAbbreviations } from "../../../utils/constants";
import { RemoveCircle } from "@mui/icons-material";

interface MultiBallDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: (numBalls: GameStatKeys) => void;
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

  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const deletableOptions = useMemo(() => {
    let deletionOptions: GameStatKeys[] = [];
    const deletableKeys = [
      GameStatKeys.threeBallsPocketedInRow,
      GameStatKeys.fourBallsPocketedInRow,
      GameStatKeys.fiveBallsPocketedInRow,
      GameStatKeys.sixBallsPocketedInRow,
      GameStatKeys.sevenBallsPocketedInRow,
      GameStatKeys.eightBallsPocketedInRow,
      GameStatKeys.runTheTable,
    ];
    Object.keys(thisPlayerStats as unknown as GameStatKeys).forEach((k) => {
      const key = k as GameStatKeys;
      if (deletableKeys.includes(key) && (thisPlayerStats?.[key] ?? 0) > 0) {
        deletionOptions.push(key);
      }
    });
    return deletionOptions;
  }, [thisPlayerStats]);

  const thisStat =
    selectedIndex !== null && deletableOptions[selectedIndex]
      ? SimpleStatAbbreviations[
          deletableOptions[selectedIndex] ?? "this stat"
        ]?.split(" ")[0]
      : "this stat";
  return (
    <Drawer open={open} onClose={onClose} anchor="bottom">
      <DialogTitle>
        <Stack
          direction="row"
          sx={{ alignItems: "center", lineHeight: 1 }}
          spacing={2}
        >
          Delete a run from {selectedPlayerName}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={1}>
          <Typography>
            Select the run to delete from {selectedPlayerName}.
          </Typography>
          {deletableOptions.map((key, idx) => {
            const checked = selectedIndex === idx;
            return (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    sx={{ pl: 0 }}
                    checkedIcon={<RemoveCircle />}
                    color={checked ? "error" : "primary"}
                    checked={checked}
                    onChange={(_e) => setSelectedIndex(idx)}
                  />
                }
                label={SimpleStatAbbreviations[key]}
              />
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={selectedIndex === null || deletableOptions.length === 0}
          color="error"
          variant="contained"
          onClick={() => {
            if (selectedIndex !== null) {
              onConfirmDelete(deletableOptions[selectedIndex]);
              setSelectedIndex(0);
              onClose();
            }
          }}
        >
          Delete {thisStat} from {getPlayerNameAbbreviation(selectedPlayerName)}
        </Button>
      </DialogActions>
    </Drawer>
  );
};
