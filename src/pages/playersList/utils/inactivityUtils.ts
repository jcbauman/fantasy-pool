import { updateCurrentPlayer } from "../../../backend/setters";
import { Player } from "../../../types";

export const makePlayerActive = async (
  player: Player,
  callback: () => void
): Promise<void> => {
  if (player.out) {
    const resolvedPlayer: Omit<Player, "id"> = {
      ...player,
      out: false,
    };
    await updateCurrentPlayer(resolvedPlayer, player?.id ?? "");
    callback();
  }
};

const makePlayerOut = async (player: Player): Promise<void> => {
  if (player.out) {
    const resolvedPlayer: Omit<Player, "id"> = {
      ...player,
      out: true,
    };
    await updateCurrentPlayer(resolvedPlayer, player?.id ?? "");
  }
};
