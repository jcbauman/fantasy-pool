import { Game, GameStat, GameStatKeys } from "../../../types";
import { defaultGameStat } from "../../../utils/constants";
import { getFantasyScoreForPlayerSeason } from "../../../utils/statsUtils";

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

export type StatsForPlayerGames = GameStat & {
  totalGames: number;
  totalWins: number;
  totalSessions: number;
  winPercentage: number;
  fantasyScore: number;
  fantasyGameAvg: number;
};

export const getStatsForPlayerGames = (
  playerId: string,
  games: Game[],
  scoringMatrix: Record<string, number>
): StatsForPlayerGames => {
  const stats: StatsForPlayerGames = games.reduce(
    (acc, game) => {
      const playerStats: GameStat | undefined = game.statsByPlayer.find(
        (s) => s.playerId === playerId
      );

      if (!playerStats) return acc;
      return {
        [GameStatKeys.winsBy8BallSink]:
          (acc[GameStatKeys.winsBy8BallSink] ?? 0) +
          (playerStats[GameStatKeys.winsBy8BallSink] ?? 0),
        [GameStatKeys.winsByOpponentScratch]:
          (acc[GameStatKeys.winsByOpponentScratch] ?? 0) +
          (playerStats[GameStatKeys.winsByOpponentScratch] ?? 0),
        [GameStatKeys.lossesBy8BallSink]:
          (acc[GameStatKeys.lossesBy8BallSink] ?? 0) +
          (playerStats[GameStatKeys.lossesBy8BallSink] ?? 0),
        [GameStatKeys.lossesByScratch]:
          (acc[GameStatKeys.lossesByScratch] ?? 0) +
          (playerStats[GameStatKeys.lossesByScratch] ?? 0),
        [GameStatKeys.threeBallsPocketedInRow]:
          (acc[GameStatKeys.threeBallsPocketedInRow] ?? 0) +
          (playerStats[GameStatKeys.threeBallsPocketedInRow] ?? 0),
        [GameStatKeys.fourBallsPocketedInRow]:
          (acc[GameStatKeys.fourBallsPocketedInRow] ?? 0) +
          (playerStats[GameStatKeys.fourBallsPocketedInRow] ?? 0),
        [GameStatKeys.fiveBallsPocketedInRow]:
          (acc[GameStatKeys.fiveBallsPocketedInRow] ?? 0) +
          (playerStats[GameStatKeys.fiveBallsPocketedInRow] ?? 0),
        [GameStatKeys.sixBallsPocketedInRow]:
          (acc[GameStatKeys.sixBallsPocketedInRow] ?? 0) +
          (playerStats[GameStatKeys.sixBallsPocketedInRow] ?? 0),
        [GameStatKeys.sevenBallsPocketedInRow]:
          (acc[GameStatKeys.sevenBallsPocketedInRow] ?? 0) +
          (playerStats[GameStatKeys.sevenBallsPocketedInRow] ?? 0),
        [GameStatKeys.runTheTable]:
          (acc[GameStatKeys.runTheTable] ?? 0) +
          (playerStats[GameStatKeys.runTheTable] ?? 0),
        [GameStatKeys.scratches]:
          (acc[GameStatKeys.scratches] ?? 0) +
          (playerStats[GameStatKeys.scratches] ?? 0),
        [GameStatKeys.skillShots]:
          (acc[GameStatKeys.skillShots] ?? 0) +
          (playerStats[GameStatKeys.skillShots] ?? 0),
        totalSessions: acc.totalSessions + 1,
        totalGames:
          acc.totalGames +
          (playerStats[GameStatKeys.winsBy8BallSink] ?? 0) +
          (playerStats[GameStatKeys.winsByOpponentScratch] ?? 0) +
          (playerStats[GameStatKeys.lossesBy8BallSink] ?? 0) +
          (playerStats[GameStatKeys.lossesByScratch] ?? 0),
        totalWins:
          acc.totalWins +
          ((playerStats[GameStatKeys.winsBy8BallSink] ?? 0) +
            (playerStats[GameStatKeys.winsByOpponentScratch] ?? 0)),
        playerId,
        winPercentage: 0,
        fantasyGameAvg: 0,
        fantasyScore:
          acc.fantasyScore +
          getFantasyScoreForPlayerSeason([game], playerId, scoringMatrix),
      };
    },
    {
      ...defaultGameStat,
      totalGames: 0,
      totalWins: 0,
      totalSessions: 0,
      winPercentage: 0,
      fantasyScore: 0,
      fantasyGameAvg: 0,
      playerId,
    }
  );
  const winPercentage = stats.totalWins / (stats.totalGames || 1);
  const fantasyGameAvg = stats.fantasyScore / (stats.totalGames || 1);
  return { ...stats, winPercentage, fantasyGameAvg };
};

export const isKeyOfRankings = (
  key: string,
  obj: Record<string, string[]>
): key is keyof Record<string, string[]> => {
  return key in obj;
};

export const joinedInTimeFor2024Wrapped = (
  dateString: string | undefined
): boolean => {
  if (!dateString) return true;
  const inputDate = new Date(dateString);
  const comparisonDate = new Date("2024-12-13"); // December 13, 2024

  // Ensure the date is valid
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date string");
  }

  return inputDate < comparisonDate;
};

export const getPlayerSynergyStats = (
  games: Game[],
  currPlayerId: string | undefined,
  player2Id: string | undefined
): {
  versusGameCount: number;
  partnersGameCount: number;
  versusGameWins: number;
  partnersGameWins: number;
  totalGames: number;
} => {
  let versusGameCount = 0;
  let partnersGameCount = 0;
  let versusGameWins = 0;
  let partnersGameWins = 0;
  if (!currPlayerId || !player2Id)
    return {
      versusGameCount,
      partnersGameCount,
      versusGameWins,
      partnersGameWins,
      totalGames: 0,
    };
  const jointGames = games.filter(
    (game) =>
      game.playerIds.includes(currPlayerId) &&
      game.playerIds.includes(player2Id)
  );

  jointGames.forEach((game) => {
    const currPlayerStats = game.statsByPlayer.find(
      (s) => s.playerId === currPlayerId
    );
    const player2Stats = game.statsByPlayer.find(
      (s) => s.playerId === player2Id
    );

    if (currPlayerStats && player2Stats) {
      const currPlayerWon =
        (currPlayerStats[GameStatKeys.winsBy8BallSink] ?? 0) > 0 ||
        (currPlayerStats[GameStatKeys.winsByOpponentScratch] ?? 0) > 0;
      const player2Won =
        (player2Stats[GameStatKeys.winsBy8BallSink] ?? 0) > 0 ||
        (player2Stats[GameStatKeys.winsByOpponentScratch] ?? 0) > 0;

      if ((currPlayerWon && player2Won) || (!currPlayerWon && !player2Won)) {
        partnersGameCount++;
        partnersGameWins += currPlayerWon ? 1 : 0;
      } else {
        versusGameCount++;
        versusGameWins += currPlayerWon ? 1 : 0;
      }
    }
  });

  return {
    versusGameCount,
    partnersGameCount,
    versusGameWins,
    partnersGameWins,
    totalGames: jointGames.length,
  };
};

export interface PlayerTrends {
  gamesCount: number;
  points: number;
  period: string;
}

export const getPlayerTrends = (
  games: Game[],
  playerId: string,
  scoringMatrix: { [key: string]: number }
): PlayerTrends[] => {
  //last 24 hours
  const twentyFourHoursAgo = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  );
  const lastDayGames = games.filter((game) => {
    const gameDate = new Date(game.timestamp);
    return gameDate > twentyFourHoursAgo;
  });
  const dayPoints = getFantasyScoreForPlayerSeason(
    lastDayGames,
    playerId,
    scoringMatrix
  );

  //last week games
  const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekGames = games.filter((game) => {
    const gameDate = new Date(game.timestamp);
    return gameDate > oneWeekAgo;
  });
  const weekPoints = getFantasyScoreForPlayerSeason(
    thisWeekGames,
    playerId,
    scoringMatrix
  );

  //fortnight games
  const twoWeeksAgo = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
  const fortnightGames = games.filter((game) => {
    const gameDate = new Date(game.timestamp);
    return gameDate > twoWeeksAgo;
  });
  const fortnightPoints = getFantasyScoreForPlayerSeason(
    fortnightGames,
    playerId,
    scoringMatrix
  );

  return [
    { gamesCount: lastDayGames.length, points: dayPoints, period: "Day" },
    {
      gamesCount: thisWeekGames.length,
      points: weekPoints,
      period: "Week",
    },
    {
      gamesCount: fortnightGames.length,
      points: fortnightPoints,
      period: "2 Weeks",
    },
  ];
};
