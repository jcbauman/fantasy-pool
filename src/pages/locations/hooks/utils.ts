import { Game } from "../../../types";
import { getLocationLeader } from "../../location-detail/hooks/utils";

export const normalizeLocationName = (location?: string): string => {
  if (!location) return "";
  return location.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
};

export const bucketGamesByLocation = (
  games: Game[],
  scoringMatrix: Record<string, number>,
) => {
  const buckets: { [key: string]: Game[] } = {};

  games.forEach((game) => {
    const normalizedLocationName = normalizeLocationName(game?.location);
    if (normalizedLocationName)
      if (!buckets[normalizedLocationName]) {
        buckets[normalizedLocationName] = [];
      }
    buckets[normalizedLocationName].push(game);
  });

  const bucketCounts: { [key: string]: number } = {};
  const leaders: { [key: string]: string | undefined } = {};

  Object.keys(buckets).forEach((location) => {
    bucketCounts[location] = buckets[location].length;
    leaders[location] = getLocationLeader(buckets[location], scoringMatrix);
  });

  return { counts: bucketCounts, leaders };
};
