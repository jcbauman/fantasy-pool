import { Game, GameStat, GameStatKeys, Session } from "../../../types";
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

export const getStatsForPlayerGames = (
  playerId: string,
  games: Game[],
  scoringMatrix: Record<string, number>
): GameStat & {
  totalGames: number;
  totalWins: number;
  totalSessions: number;
  winPercentage: number;
  fantasyScore: number;
  fantasyGameAvg: number;
} => {
  const stats: GameStat & {
    totalGames: number;
    totalWins: number;
    totalSessions: number;
    winPercentage: number;
    fantasyScore: number;
    fantasyGameAvg: number;
  } = games.reduce(
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

export const getStatsForSession = (
  playerId: string,
  session: Session | null
): GameStat => {
  if (!session) return { ...defaultGameStat, playerId };
  const playerIndex = session.playerIds.findIndex((id) => id === playerId);
  const playerStats = session.statsByPlayer[playerIndex];
  return playerStats;
};
