import { Game, GameStat, GameStatKeys } from "../../../types";
import { defaultGameStat } from "../../../utils/constants";

export const getPlayerNameAbbreviation = (name: string): string => {
  const returnName = name.trim().split(" ");
  if (returnName.length === 1) return name;
  return returnName[0].slice(0, 1) + ". " + returnName[returnName.length - 1];
};

export const getStatsForGame = (playerId: string, game: Game): GameStat => {
  const playerIndex = game.playerIds.findIndex((id) => id === playerId);
  const playerStats = game.statsByPlayer[playerIndex];
  return playerStats;
};

export const getPlayedGamesForPlayer = (
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
  const relevantGames = games.filter((game) =>
    game.playerIds.includes(playerId)
  );
  const stats: GameStat & {
    totalGames: number;
    totalWins: number;
    totalSessions: number;
  } = relevantGames.reduce(
    (acc, game) => {
      const playerIndex = game.playerIds.findIndex((id) => id === playerId);
      const playerStats = game.statsByPlayer[playerIndex];
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
        [GameStatKeys.ballsPocketedInRow]:
          acc[GameStatKeys.ballsPocketedInRow] +
          playerStats[GameStatKeys.ballsPocketedInRow],
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
