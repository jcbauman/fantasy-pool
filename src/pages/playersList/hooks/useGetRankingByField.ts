import { useMemo } from "react";
import { getStatsForPlayerGames } from "../utils/playerUtils";
import { AggregateStats, Game, Player } from "../../../types";

export const useGetRankingByField = (
  players: Player[],
  games: Game[],
  scoringMatrix: Record<string, number>
): {
  rankings: Record<string, string[]>;
  allStatsByPlayers: AggregateStats;
} => {
  const allStatsByPlayers: AggregateStats = useMemo(
    () =>
      players.reduce((acc, { id }) => {
        acc[id] = getStatsForPlayerGames(
          id,
          games,
          scoringMatrix
        ) as unknown as {
          [statName: string]: number;
        };
        return acc;
      }, {} as AggregateStats),
    [games, players, scoringMatrix]
  );
  const rankings: Record<string, string[]> = {};

  // Get all unique stat names
  const statNames = new Set<string>();
  Object.values(allStatsByPlayers).forEach((stats) => {
    Object.keys(stats).forEach((statName) => statNames.add(statName));
  });

  // Sort player IDs by each stat
  statNames.forEach((statName) => {
    // Create an array of [playerId, statValue]
    const playerStatEntries = Object.entries(allStatsByPlayers).map(
      ([playerId, stats]) => [playerId, stats[statName]] as [string, number]
    );

    // Sort by stat value in descending order
    const sortedPlayerStatEntries = playerStatEntries.sort(
      (a, b) => b[1] - a[1]
    );

    // Extract sorted player IDs
    rankings[statName] = sortedPlayerStatEntries.map(([playerId]) => playerId);
  });
  return { rankings, allStatsByPlayers };
};

export const getRankingByField = (
  players: Player[],
  games: Game[],
  scoringMatrix: Record<string, number>
): {
  rankings: Record<string, string[]>;
  allStatsByPlayers: AggregateStats;
} => {
  const allStatsByPlayers: AggregateStats = players.reduce((acc, { id }) => {
    acc[id] = getStatsForPlayerGames(id, games, scoringMatrix) as unknown as {
      [statName: string]: number;
    };
    return acc;
  }, {} as AggregateStats);

  const rankings: Record<string, string[]> = {};

  // Get all unique stat names
  const statNames = new Set<string>();
  Object.values(allStatsByPlayers).forEach((stats) => {
    Object.keys(stats).forEach((statName) => statNames.add(statName));
  });

  // Sort player IDs by each stat
  statNames.forEach((statName) => {
    // Create an array of [playerId, statValue]
    const playerStatEntries = Object.entries(allStatsByPlayers).map(
      ([playerId, stats]) => [playerId, stats[statName]] as [string, number]
    );

    // Sort by stat value in descending order
    const sortedPlayerStatEntries = playerStatEntries.sort(
      (a, b) => b[1] - a[1]
    );

    // Extract sorted player IDs
    rankings[statName] = sortedPlayerStatEntries.map(([playerId]) => playerId);
  });
  return { rankings, allStatsByPlayers };
};
