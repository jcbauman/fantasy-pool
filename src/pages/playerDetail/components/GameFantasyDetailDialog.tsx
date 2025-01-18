import { Button, Dialog, DialogActions } from "@mui/material";
import { FC } from "react";
import { Game, Player } from "../../../types";
import { GameFantasyDetail } from "./GameFantasyDetail";

export const GameFantasyDetailDialog: FC<{
  open: boolean;
  onClose: () => void;
  game: Game | undefined;
  player: Player | undefined;
  scoringMatrix: Record<string, number>;
}> = ({ open, onClose, game, player, scoringMatrix }) => {
  return (
    <Dialog open={open} sx={{ width: "100%" }} onClose={onClose}>
      <GameFantasyDetail
        game={game}
        player={player}
        scoringMatrix={scoringMatrix}
      />
      <DialogActions sx={{ mb: 0 }}>
        <Button onClick={onClose} fullWidth variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
