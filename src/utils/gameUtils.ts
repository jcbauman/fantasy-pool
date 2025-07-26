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

export const getPlayerGamesFromList = (
  games: Game[],
  playerId: string | null
) => {
  if (!playerId) return [];
  return games.filter((game) => game.playerIds.includes(playerId ?? ""));
};

export const getMostPopularLocation = (
  games: Game[],
  playerId: string | undefined,
  defaultLocation: string | undefined,
  threshold: number
) => {
  if (!playerId || !defaultLocation) return "";
  const playerGames = getPlayerGamesFromList(games, playerId);
  const locationCounts: Record<string, number> = {};
  playerGames.forEach((game) => {
    if (game.location) {
      locationCounts[game.location] = (locationCounts[game.location] || 0) + 1;
    }
  });
  const sortedLocations = Object.entries(locationCounts).sort(
    (a, b) => b[1] - a[1]
  );

  if (sortedLocations.length === 0) {
    return defaultLocation;
  }
  //if difference between default and top location is more than threshold, return top location
  const defaultLocationCount = locationCounts[defaultLocation] ?? 0;
  return sortedLocations[0][1] > defaultLocationCount + threshold
    ? sortedLocations[0][0]
    : defaultLocation;
};
