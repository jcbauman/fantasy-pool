import { updateCurrentPlayer } from "../../../backend/endpoints/players";
import { Game, Player } from "../../../types";
import { getSeasonStart } from "../../../utils/dateUtils";
import { filterPlayedGamesForPlayer } from "./playerUtils";

export const DAYS_TIL_INACTIVE = 10;

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
  if (!player.out) {
    const resolvedPlayer: Omit<Player, "id"> = {
      ...player,
      out: true,
    };
    await updateCurrentPlayer(resolvedPlayer, player?.id ?? "");
  }
};

export const checkPlayerInactivity = (
  player: Player,
  games: Game[]
): boolean => {
  const currentDate = new Date();
  const cutoffDate = new Date(getSeasonStart());
  const isMoreThanNDaysAfterCutoff =
    currentDate.getTime() - cutoffDate.getTime() >
    DAYS_TIL_INACTIVE * 24 * 60 * 60 * 1000;
  if (isMoreThanNDaysAfterCutoff && (!games.length || !player)) return false;
  const playersGames = filterPlayedGamesForPlayer(player.id, games);
  if (playersGames.length === 0) {
    if (player.joinDate) {
      const joinDate = new Date(player.joinDate);
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays > DAYS_TIL_INACTIVE) {
        makePlayerOut(player);
        return true;
      }
    }
    return false;
  } else {
    const lastGame = playersGames[0];
    const lastGameDate = new Date(lastGame.timestamp);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - lastGameDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > DAYS_TIL_INACTIVE) {
      makePlayerOut(player);
      return true;
    }
    return false;
  }
};
