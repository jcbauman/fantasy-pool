import { Game } from "../../../types";

export const normalizeLocationName = (location?: string): string => {
  if (!location) return "";
  return location.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
};

export const bucketGamesByLocation = (games: Game[]) => {
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

  Object.keys(buckets).forEach((location) => {
    bucketCounts[location] = buckets[location].length;
  });

  return bucketCounts;
};
