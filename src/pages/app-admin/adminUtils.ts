import { createNewSessionFromGames } from "../../backend/sessions";
import { Game, GameStat, GameStatKeys } from "../../types";
import { formatDateToMMDD } from "../../utils/statsUtils";

export const collapseRepeatGames = async (
  games: Game[],
  onSuccess: (message: string) => void,
  onFailure: (message: string) => void,
  forTimeStampOnly?: string
): Promise<void> => {
  let resolvedBucketedGames: { [bone: string]: Game[] } = {};
  for (let i = 1; i < games.length; i++) {
    if (gamesHaveSameBones(games[i], games[i - 1], forTimeStampOnly)) {
      const gameBone = getGameBone(games[i]);
      if (
        !(resolvedBucketedGames[gameBone] ?? []).some(
          (g) => g.id === games[i].id
        )
      ) {
        resolvedBucketedGames[gameBone] = [
          ...(resolvedBucketedGames[gameBone] ?? []),
          games[i],
        ];
      }
      if (
        !(resolvedBucketedGames[gameBone] ?? []).some(
          (g) => g.id === games[i - 1].id
        )
      ) {
        resolvedBucketedGames[gameBone] = [
          ...(resolvedBucketedGames[gameBone] ?? []),
          games[i - 1],
        ];
      }
    }
  }
  console.log("resolved bruh", resolvedBucketedGames);
  const firstkey = Object.keys(resolvedBucketedGames)[0];
  const targetGames = resolvedBucketedGames[firstkey];
  console.log("targetGames bruh", targetGames);
  try {
    const sesh = await createNewSessionFromGames(targetGames);
    onSuccess(`Successfully collapsed games into session ${sesh}`);
  } catch (e) {
    onFailure(`Failed to collapse, ${e}`);
  }
};

const getGameBone = (game: Game): string => {
  return `${formatDateToMMDD(new Date(game.timestamp))}-${game.location}`;
};

const gamesHaveSameBones = (
  game1: Game,
  game2: Game,
  omitExceptForTimeStamp?: string
): boolean => {
  const game1TS = formatDateToMMDD(new Date(game1.timestamp));
  const game2TS = formatDateToMMDD(new Date(game2.timestamp));
  if (
    !omitExceptForTimeStamp ||
    (omitExceptForTimeStamp &&
      game1TS === omitExceptForTimeStamp &&
      game2TS === omitExceptForTimeStamp)
  ) {
    if (
      game1TS === game2TS &&
      game1.location?.toLowerCase() === game2.location?.toLowerCase()
    ) {
      return true;
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

// export const getGameCollapsedGame2IntoGame1 = (
//   game1: Game,
//   game2: Game
// ): Game => {
//   const baseArray: GameStat[] = [];
//   const newGame = { ...game1, statsByPlayer: baseArray };
//   game2.statsByPlayer.forEach((game2Stat) => {
//     const game1Stat = game1.statsByPlayer.find(
//       (stat) => stat.playerId === game2Stat.playerId
//     );
//     if (game1Stat) {
//       const newStat = { ...game1Stat };
//       Object.keys(game2Stat).forEach((key) => {
//         if (typeof game2Stat[key as keyof typeof GameStatKeys] === "number") {
//           newStat[key as keyof typeof GameStatKeys] =
//             (game1Stat[key as keyof typeof GameStatKeys] ?? 0) +
//             (game2Stat[key as keyof typeof GameStatKeys] ?? 0);
//         }
//       });
//       newGame.statsByPlayer.push(newStat);
//     } else {
//       newGame.statsByPlayer.push(game2Stat);
//     }
//   });
//   return newGame;
// };
