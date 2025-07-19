import { Game, GameStatKeys, Player } from "../../../types";
import { getFantasyScoreForPlayerSeason } from "../../../utils/statsUtils";
import { SeasonRecords } from "../../playersList/utils/playerUtils";

export const getBestAndWorstLocation = (
  games: Game[],
  playerId: string | undefined,
  scoringMatrix: Record<string, number>
): {
  best: { totalPoints: number; name: string };
  worst: { totalPoints: number; name: string };
  locationsCount: number;
} => {
  const locationScores: Record<string, number> = {};

  games.forEach((game) => {
    const score = getFantasyScoreForPlayerSeason(
      [game],
      playerId,
      scoringMatrix
    );
    if (game.location)
      locationScores[game.location] =
        (locationScores[game.location] || 0) + score;
  });

  const locations = Object.entries(locationScores);
  if (locations.length === 0 || !playerId) {
    return {
      best: { totalPoints: 0, name: "N/A" },
      worst: { totalPoints: 0, name: "N/A" },
      locationsCount: 0,
    };
  }

  locations.sort((a, b) => b[1] - a[1]);

  return {
    best: { totalPoints: locations[0][1], name: locations[0][0] },
    worst: {
      totalPoints: locations[locations.length - 1][1],
      name: locations[locations.length - 1][0],
    },
    locationsCount: locations.length,
  };
};

export const getPlayerWithMostScratches = (
  records: SeasonRecords | undefined,
  players: Player[]
): { scratcher: Player | undefined; count: number } => {
  if (!records) return { scratcher: undefined, count: 0 };
  let maxScratches = 0;
  let playerId: string | undefined = undefined;

  Object.keys(records).forEach((pId) => {
    if ((records[pId][GameStatKeys.scratches] ?? 0) > maxScratches) {
      maxScratches = records[pId][GameStatKeys.scratches] ?? 0;
      playerId = pId;
    }
  });
  return {
    scratcher: playerId ? players.find((p) => p.id === playerId) : undefined,
    count: maxScratches,
  };
};
