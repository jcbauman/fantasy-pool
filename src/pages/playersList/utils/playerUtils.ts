import { Game, GameStat } from "../../../types";

export const getPlayerNameAbbreviation = (name: string): string => {
  const returnName = name.trim().split(" ");
  if (returnName.length === 1) return name;
  return returnName[0].slice(0, 1) + ". " + returnName[returnName.length - 1];
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
  const stats = relevantGames.reduce(
    (acc, game) => {
      const playerIndex = game.playerIds.findIndex((id) => id === playerId);
      const playerStats = game.statsByPlayer[playerIndex];
      if (!playerStats) return acc;
      return {
        winsBy8BallSink: acc.winsBy8BallSink + playerStats.winsBy8BallSink,
        winsByOpponentScratch:
          acc.winsByOpponentScratch + playerStats.winsByOpponentScratch,
        scratches: acc.scratches + playerStats.scratches,
        lossesBy8BallSink:
          acc.lossesBy8BallSink + playerStats.lossesBy8BallSink,
        lossesByScratch: acc.lossesByScratch + playerStats.lossesByScratch,
        ballsPocketedInRow:
          acc.ballsPocketedInRow + playerStats.ballsPocketedInRow,
        georgeWashingtons:
          acc.georgeWashingtons + playerStats.georgeWashingtons,
        incredibleShots: acc.incredibleShots + playerStats.incredibleShots,
        totalSessions: acc.totalSessions + 1,
        totalGames:
          acc.totalGames +
          playerStats.winsBy8BallSink +
          playerStats.winsByOpponentScratch +
          playerStats.lossesBy8BallSink +
          playerStats.lossesByScratch,
        totalWins:
          acc.totalWins +
          (playerStats.winsBy8BallSink + playerStats.winsByOpponentScratch),
      };
    },
    {
      winsBy8BallSink: 0,
      winsByOpponentScratch: 0,
      scratches: 0,
      lossesBy8BallSink: 0,
      lossesByScratch: 0,
      ballsPocketedInRow: 0,
      georgeWashingtons: 0,
      incredibleShots: 0,
      totalGames: 0,
      totalWins: 0,
      totalSessions: 0,
    }
  );
  return stats;
};
