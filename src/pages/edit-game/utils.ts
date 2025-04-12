import { Game } from "../../types";

export const canEditGame = (
  game: Game,
  playerId: string,
  isLeagueAdmin?: boolean
): boolean => {
  if (isLeagueAdmin) return true;
  if (game.authorPlayerId !== playerId) return false;
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const gameDate = new Date(game.timestamp);
  if (gameDate < twoDaysAgo) return false;
  return true;
};
