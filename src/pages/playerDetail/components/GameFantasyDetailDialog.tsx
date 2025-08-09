import { Button, Dialog, DialogActions, Slide } from "@mui/material";
import { FC, forwardRef, ReactElement, Ref } from "react";
import { Game, Player } from "../../../types";
import { GameFantasyDetail } from "./GameFantasyDetail";
import { TransitionProps } from "@mui/material/transitions";

// Slide transition that slides up
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const GameFantasyDetailDialog: FC<{
  open: boolean;
  onClose: () => void;
  game: Game | undefined;
  player: Player | undefined;
  scoringMatrix: Record<string, number>;
}> = ({ open, onClose, game, player, scoringMatrix }) => {
  return (
    <Dialog
      open={open}
      sx={{ width: "100%" }}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
    >
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
