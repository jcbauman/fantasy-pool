import { SeasonRecords } from "../pages/playersList/utils/playerUtils";
import { Game, GameStatKeys, Player } from "../types";

export const sortGamesByDate = (games: Game[]): Game[] => {
  return games.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};

export const capitalizeLocation = (str: string | null): string => {
  if (!str || !str.trim().length) return "";
  return str
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const didPlayerWinGame = (
  game: Game,
  playerId: string | undefined
): boolean | undefined => {
  if (!playerId) return undefined;
  const playerStats = game.statsByPlayer.find((s) => s.playerId === playerId);
  if (!playerStats) return undefined;
  const playerWon =
    (playerStats[GameStatKeys.winsBy8BallSink] ?? 0) > 0 ||
    (playerStats[GameStatKeys.winsByOpponentScratch] ?? 0) > 0;
  return playerWon;
};

export const getIsGamePartnership = (game: Game): boolean | undefined => {
  if (game.playerIds.length !== 2) return undefined;
  const p1Won = didPlayerWinGame(game, game.playerIds[0]);
  const p2Won = didPlayerWinGame(game, game.playerIds[1]);

  return (p1Won && p2Won) || (!p1Won && !p2Won);
};

export const getOtherGamePlayer = (
  game: Game,
  currentPlayerId: string | undefined,
  players: Player[]
) => {
  if (!currentPlayerId || game.playerIds.length !== 2) return undefined;
  const otherPlayerId = game.playerIds.find((p) => p !== currentPlayerId);
  if (!otherPlayerId) return undefined;
  return players.find((p) => p.id === otherPlayerId);
};

export const canSeeLastSeason = (
  records: SeasonRecords | undefined,
  playerId: string | undefined
): boolean => {
  if (!records || !playerId || !records[playerId]) return false;
  return true;
};
