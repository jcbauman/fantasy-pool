import { Game, Player } from "../../../types";
import { formatDateToMMDD } from "../../../utils/dateUtils";
import { getFantasyScoreForPlayerSeason } from "../../../utils/statsUtils";

export const getWinningAndLosingPlayersForGame = (
  players: Player[],
  game: Game
) => {
  const winners = game.statsByPlayer
    .filter((s) => {
      return (
        (s?.winsBy8BallSink ?? 0) > 0 || (s?.winsByOpponentScratch ?? 0) > 0
      );
    })
    .map((s) => s.playerId);
  const losers = game.statsByPlayer
    .filter((s) => {
      return (s?.lossesBy8BallSink ?? 0) > 0 || (s?.lossesByScratch ?? 0) > 0;
    })
    .map((s) => s.playerId);

  const winningPlayers = players.filter((p) => winners.includes(p.id));
  const losingPlayers = players.filter((p) => losers.includes(p.id));
  return { winningPlayers, losingPlayers };
};

export const getLocationLeader = (
  games: Game[],
  scoringMatrix: Record<string, number>
): string | undefined => {
  if (!games.length) return undefined;
  const playerIds = new Set<string>();
  games.forEach((game) =>
    game.statsByPlayer.forEach((s) => s.playerId && playerIds.add(s.playerId))
  );
  let leaderId: string | undefined;
  let maxScore = -Infinity;
  playerIds.forEach((playerId) => {
    const score = getFantasyScoreForPlayerSeason(
      games,
      playerId,
      scoringMatrix
    );
    if (score > maxScore) {
      maxScore = score;
      leaderId = playerId;
    }
  });
  return leaderId;
};

export const getNumberOfDates = (games: Game[]) => {
  const dates = new Set<string>();
  games.forEach((game) => {
    dates.add(formatDateToMMDD(new Date(game.timestamp)));
  });
  return dates.size;
};
