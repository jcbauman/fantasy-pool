import { Game, GameStat, GameStatKeys, Session } from "../types";
import { defaultGameStat } from "./constants";

export const combineGameStats = (
  playerId: string,
  gameStats: GameStat[]
): GameStat => {
  const stats: GameStat = gameStats.reduce(
    (acc, gameStat) => {
      if (gameStat.playerId !== playerId) return acc;
      return {
        [GameStatKeys.winsBy8BallSink]:
          (acc[GameStatKeys.winsBy8BallSink] ?? 0) +
          (gameStat[GameStatKeys.winsBy8BallSink] ?? 0),
        [GameStatKeys.winsByOpponentScratch]:
          (acc[GameStatKeys.winsByOpponentScratch] ?? 0) +
          (gameStat[GameStatKeys.winsByOpponentScratch] ?? 0),
        [GameStatKeys.lossesBy8BallSink]:
          (acc[GameStatKeys.lossesBy8BallSink] ?? 0) +
          (gameStat[GameStatKeys.lossesBy8BallSink] ?? 0),
        [GameStatKeys.lossesByScratch]:
          (acc[GameStatKeys.lossesByScratch] ?? 0) +
          (gameStat[GameStatKeys.lossesByScratch] ?? 0),
        [GameStatKeys.threeBallsPocketedInRow]:
          (acc[GameStatKeys.threeBallsPocketedInRow] ?? 0) +
          (gameStat[GameStatKeys.threeBallsPocketedInRow] ?? 0),
        [GameStatKeys.fourBallsPocketedInRow]:
          (acc[GameStatKeys.fourBallsPocketedInRow] ?? 0) +
          (gameStat[GameStatKeys.fourBallsPocketedInRow] ?? 0),
        [GameStatKeys.fiveBallsPocketedInRow]:
          (acc[GameStatKeys.fiveBallsPocketedInRow] ?? 0) +
          (gameStat[GameStatKeys.fiveBallsPocketedInRow] ?? 0),
        [GameStatKeys.sixBallsPocketedInRow]:
          (acc[GameStatKeys.sixBallsPocketedInRow] ?? 0) +
          (gameStat[GameStatKeys.sixBallsPocketedInRow] ?? 0),
        [GameStatKeys.sevenBallsPocketedInRow]:
          (acc[GameStatKeys.sevenBallsPocketedInRow] ?? 0) +
          (gameStat[GameStatKeys.sevenBallsPocketedInRow] ?? 0),
        [GameStatKeys.runTheTable]:
          (acc[GameStatKeys.runTheTable] ?? 0) +
          (gameStat[GameStatKeys.runTheTable] ?? 0),
        [GameStatKeys.scratches]:
          (acc[GameStatKeys.scratches] ?? 0) +
          (gameStat[GameStatKeys.scratches] ?? 0),
        [GameStatKeys.skillShots]:
          (acc[GameStatKeys.skillShots] ?? 0) +
          (gameStat[GameStatKeys.skillShots] ?? 0),
        playerId,
      };
    },
    {
      ...defaultGameStat,
      playerId,
    }
  );
  return stats;
};

export const combineGameToExistingSession = (
  session: Session,
  newGame: Game
): Session | undefined => {
  try {
    let resolvedSession = { ...session };
    resolvedSession.games = [...resolvedSession.games, newGame];
    newGame.playerIds.forEach((piD) => {
      if (!resolvedSession.playerIds.includes(piD)) {
        resolvedSession.playerIds = [...resolvedSession.playerIds, piD];
      }
    });
    newGame.statsByPlayer.forEach((newGameStat) => {
      const newGamePlayerId = newGameStat.playerId;
      const existingGameStatIndex = session.statsByPlayer.findIndex(
        (s) => s.playerId === newGamePlayerId
      );
      if (existingGameStatIndex === -1) {
        //player not currently in session
        resolvedSession.statsByPlayer = [
          ...resolvedSession.statsByPlayer,
          newGameStat,
        ];
      } else {
        //reduce new game stats into previous session stats for player
        const existingGameStat =
          resolvedSession.statsByPlayer[existingGameStatIndex];
        const resolvedPlayerStats = combineGameStats(newGameStat.playerId, [
          existingGameStat,
          newGameStat,
        ]);
        resolvedSession.statsByPlayer[existingGameStatIndex] =
          resolvedPlayerStats;
      }
    });
    return resolvedSession;
  } catch (e) {
    console.error("Unable to update session, missing permissions");
  }
};
