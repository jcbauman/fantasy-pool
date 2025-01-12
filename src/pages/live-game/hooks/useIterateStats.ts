import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Game, GameStat, GameStatKeys } from "../../../types";
import { updateStat } from "../../../redux/gameSlice";

interface UseIterateStats {
  iterateStat: (args: {
    playerId: string;
    statKey: GameStatKeys;
    delta: number;
  }) => void;
  iterateStatNonRedux: (args: {
    playerId: string;
    statKey: GameStatKeys;
    delta: number;
    currGame: Game;
  }) => GameStat[] | undefined;
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
              (currentGame.statsByPlayer[playerStatIndex][statKey] ?? 0) +
              delta,
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

  const iterateStatNonRedux = (args: {
    playerId: string;
    statKey: GameStatKeys;
    delta: number;
    currGame: Game | undefined;
  }): GameStat[] | undefined => {
    const { playerId, statKey, delta, currGame } = args;
    if (currGame) {
      const statsArray: GameStat[] = currGame.statsByPlayer;
      if (statsArray) {
        const playerStatIndex = statsArray.findIndex(
          (stat) => stat.playerId === playerId
        );
        if (playerStatIndex !== undefined) {
          const newStat = {
            ...currGame.statsByPlayer[playerStatIndex],
            [statKey]:
              (currGame.statsByPlayer[playerStatIndex][statKey] ?? 0) + delta,
          };

          const resolvedGameStats: GameStat[] = [
            ...currGame.statsByPlayer.slice(0, playerStatIndex),
            newStat,
            ...currGame.statsByPlayer.slice(playerStatIndex + 1),
          ];

          return resolvedGameStats;
        }
      }
    }
  };

  return {
    iterateStat,
    iterateStatNonRedux,
  };
};
