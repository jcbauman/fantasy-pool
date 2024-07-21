import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { GameStat, GameStatKeys } from "../../../types";
import { updateStat } from "../../../redux/gameSlice";

interface UseIterateStats {
  iterateStat: (args: {
    playerId: string;
    statKey: GameStatKeys;
    delta: number;
  }) => void;
}

export const useIterateStats = (): UseIterateStats => {
  const currentGame = useSelector((state: RootState) => state.game.currentGame);
  const dispatch = useDispatch();
  const iterateStat = (args: {
    playerId: string;
    statKey: GameStatKeys;
    delta: number;
  }): void => {
    const { playerId, statKey, delta } = args;
    if (currentGame) {
      const statsArray: GameStat[] = currentGame.statsByPlayer;
      if (statsArray) {
        const playerStatIndex = statsArray.findIndex(
          (stat) => stat.playerId === playerId
        );
        if (playerStatIndex !== undefined) {
          const newStat = {
            ...currentGame.statsByPlayer[playerStatIndex],
            [statKey]:
              currentGame.statsByPlayer[playerStatIndex][statKey] + delta,
          };

          const resolvedGameStats: GameStat[] = [
            ...currentGame.statsByPlayer.slice(0, playerStatIndex),
            newStat,
            ...currentGame.statsByPlayer.slice(playerStatIndex + 1),
          ];

          dispatch(updateStat(resolvedGameStats));
        }
      }
    }
  };
  return {
    iterateStat,
  };
};
