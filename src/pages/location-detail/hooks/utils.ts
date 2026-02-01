import { Game, Player } from "../../../types";

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
