import { Game, GameStat, GameStatKeys } from "../../../types";
import { defaultGameStat } from "../../../utils/constants";

export const getPlayerNameAbbreviation = (name: string): string => {
  const returnName = name.trim().split(" ");
  if (returnName.length === 1) return name;
  return returnName[0].slice(0, 1) + ". " + returnName[returnName.length - 1];
};

export const getStatsForGame = (
  playerId: string,
  game: Game | null
): GameStat => {
  if (!game) return { ...defaultGameStat, playerId };
  const playerIndex = game.playerIds.findIndex((id) => id === playerId);
  const playerStats = game.statsByPlayer[playerIndex];
  return playerStats;
};

export const filterPlayedGamesForPlayer = (
  playerId: string,
  games: Game[]
): Game[] => {
  return games.filter((game) => game.playerIds.includes(playerId));
};

export const getStatsForPlayerGames = (
  playerId: string,
  games: Game[]
): GameStat & {
  totalGames: number;
  totalWins: number;
  totalSessions: number;
} => {
  const stats: GameStat & {
    totalGames: number;
    totalWins: number;
    totalSessions: number;
  } = games.reduce(
    (acc, game) => {
      const playerStats: GameStat | undefined = game.statsByPlayer.find(
        (s) => s.playerId === playerId
      );

      if (!playerStats) return acc;
      return {
        [GameStatKeys.winsBy8BallSink]:
          acc[GameStatKeys.winsBy8BallSink] +
          playerStats[GameStatKeys.winsBy8BallSink],
        [GameStatKeys.winsByOpponentScratch]:
          acc[GameStatKeys.winsByOpponentScratch] +
          playerStats[GameStatKeys.winsByOpponentScratch],
        [GameStatKeys.lossesBy8BallSink]:
          acc[GameStatKeys.lossesBy8BallSink] +
          playerStats[GameStatKeys.lossesBy8BallSink],
        [GameStatKeys.lossesByScratch]:
          acc[GameStatKeys.lossesByScratch] +
          playerStats[GameStatKeys.lossesByScratch],
        [GameStatKeys.threeBallsPocketedInRow]:
          acc[GameStatKeys.threeBallsPocketedInRow] +
          playerStats[GameStatKeys.threeBallsPocketedInRow],
        [GameStatKeys.fourBallsPocketedInRow]:
          acc[GameStatKeys.fourBallsPocketedInRow] +
          playerStats[GameStatKeys.fourBallsPocketedInRow],
        [GameStatKeys.fiveBallsPocketedInRow]:
          acc[GameStatKeys.fiveBallsPocketedInRow] +
          playerStats[GameStatKeys.fiveBallsPocketedInRow],
        [GameStatKeys.sixBallsPocketedInRow]:
          acc[GameStatKeys.sixBallsPocketedInRow] +
          playerStats[GameStatKeys.sixBallsPocketedInRow],
        [GameStatKeys.sevenBallsPocketedInRow]:
          acc[GameStatKeys.sevenBallsPocketedInRow] +
          playerStats[GameStatKeys.sevenBallsPocketedInRow],
        [GameStatKeys.runTheTable]:
          acc[GameStatKeys.runTheTable] + playerStats[GameStatKeys.runTheTable],
        [GameStatKeys.georgeWashingtons]:
          acc[GameStatKeys.georgeWashingtons] +
          playerStats[GameStatKeys.georgeWashingtons],
        [GameStatKeys.incredibleShots]:
          acc[GameStatKeys.incredibleShots] +
          playerStats[GameStatKeys.incredibleShots],
        totalSessions: acc.totalSessions + 1,
        totalGames:
          acc.totalGames +
          playerStats[GameStatKeys.winsBy8BallSink] +
          playerStats[GameStatKeys.winsByOpponentScratch] +
          playerStats[GameStatKeys.lossesBy8BallSink] +
          playerStats[GameStatKeys.lossesByScratch],
        totalWins:
          acc.totalWins +
          (playerStats[GameStatKeys.winsBy8BallSink] +
            playerStats[GameStatKeys.winsByOpponentScratch]),
        playerId,
      };
    },
    {
      ...defaultGameStat,
      totalGames: 0,
      totalWins: 0,
      totalSessions: 0,
      playerId,
    }
  );
  return stats;
};

export const generateColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
};
