import { Game, GameStat, GameStatKeys } from "../../types";
import { formatDateToMMDD } from "../../utils/statsUtils";

export const collapsRepeatGames = (
  games: Game[],
  onSuccess: (message: string) => void
) => {
  let gamesCollapseCount = 0;
  for (let i = 1; i < games.length; i++) {
    if (gamesHaveSameBones(games[i], games[i - 1])) {
      gamesCollapseCount = gamesCollapseCount + 1;
    }
  }
  onSuccess(`Collapsed ${gamesCollapseCount} games`);
};

const gamesHaveSameBones = (game1: Game, game2: Game): boolean => {
  if (
    formatDateToMMDD(new Date(game1.timestamp)) ===
    formatDateToMMDD(new Date(game2.timestamp))
  ) {
    if (game1.location === game2.location) {
      if (arraysEqual(game1.playerIds, game2.playerIds)) {
        if (game1.authorPlayerId === game2.authorPlayerId) {
          return true;
        }
      }
    }
  }
  return false;
};

export const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
};

export const getGameCollapsedGame2IntoGame1 = (
  game1: Game,
  game2: Game
): Game => {
  const baseArray: GameStat[] = [];
  const newGame = { ...game1, statsByPlayer: baseArray };
  game2.statsByPlayer.forEach((game2Stat) => {
    const game1Stat = game1.statsByPlayer.find(
      (stat) => stat.playerId === game2Stat.playerId
    );
    if (game1Stat) {
      const newStat = { ...game1Stat };
      Object.keys(game2Stat).forEach((key) => {
        if (typeof game2Stat[key as keyof typeof GameStatKeys] === "number") {
          newStat[key as keyof typeof GameStatKeys] =
            (game1Stat[key as keyof typeof GameStatKeys] ?? 0) +
            (game2Stat[key as keyof typeof GameStatKeys] ?? 0);
        }
      });
      newGame.statsByPlayer.push(newStat);
    } else {
      newGame.statsByPlayer.push(game2Stat);
    }
  });
  return newGame;
};
