import { Game } from "../../../types";
import { getFantasyScoreForPlayerSeason } from "../../../utils/statsUtils";

export const getBestAndWorstLocation = (
  games: Game[],
  playerId: string | undefined,
  scoringMatrix: Record<string, number>
): {
  best: { totalPoints: number; name: string };
  worst: { totalPoints: number; name: string };
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
    };
  }

  locations.sort((a, b) => b[1] - a[1]);

  return {
    best: { totalPoints: locations[0][1], name: locations[0][0] },
    worst: {
      totalPoints: locations[locations.length - 1][1],
      name: locations[locations.length - 1][0],
    },
  };
};
