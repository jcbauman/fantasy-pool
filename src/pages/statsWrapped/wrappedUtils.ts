import { AggregateStats, Game, GameStatKeys } from "../../types";
import { getStringFromStatKey } from "../../utils/statsUtils";

const MAIN_AFFIRMATIONS = [
  "your precision and strategy on the table make you a true master of the game — you're a pool legend through and through!",
  "with your sharp eye and consistent aim, you’ve shown everyone what it means to dominate the game with class.",
  "your steady hand and clever plays have proven you’re a force to be reckoned with at the table.",
  "you have the kind of pool finesse that makes every game a joy to watch—keep up the great work!",
  "your ability to line up shots and sink them with style shows your growing expertise in the game.",
  "your determination and focus on the table are inspiring—keep hustling and those wins will keep coming!",
  "every game you play shows your passion for pool, and it’s clear you’re just getting started on your rise.",
  "your creativity on the table shows you’re not just playing the game—you’re crafting your own unique style.",
  "your sportsmanship and love for the game make you a player everyone respects—victories will follow!",
  "you’re the heart of the league with your enthusiasm and energy—every great story has a scrappy underdog!",
];

export const getMainAffirmation = (index: 0) => {
  if (index > MAIN_AFFIRMATIONS.length - 1) {
    return MAIN_AFFIRMATIONS[MAIN_AFFIRMATIONS.length - 1];
  }
  return MAIN_AFFIRMATIONS[index];
};

export const countLocations = (games: Game[]): [string, number][] => {
  const locations = games.reduce((acc, game) => {
    if (game.location) {
      if (!acc[game.location]) {
        acc[game.location] = 1;
      } else {
        acc[game.location]++;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  //order locations by most games played
  const rankedLocations = Object.entries(locations).sort((a, b) => b[1] - a[1]);
  return rankedLocations;
};

export function toOrdinal(rank: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = rank + 1;

  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;

  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? suffixes[0]
      : suffixes[lastDigit] || suffixes[0];

  return `${value}${suffix}`;
}

export const determineLeadersOfWeirdStats = (
  rankings: Record<string, string[]>,
  stats: AggregateStats,
  forPlayerId: string
): string => {
  const excludedKeys = [
    GameStatKeys.winsBy8BallSink,
    GameStatKeys.lossesBy8BallSink,
    "totalWins",
    "totalGames",
    "fantasyScore",
    "totalSessions",
  ];
  const { rankingsByGame } = getPerGameRankings(stats);
  // list which keys that playerId ranks first in in rankings
  const firstsInCount = Object.keys(rankings).filter(
    (key) => rankings[key][0] === forPlayerId && !excludedKeys.includes(key)
  );
  const firstsInGame = Object.keys(rankingsByGame).filter(
    (key) => rankings[key][0] === forPlayerId && !excludedKeys.includes(key)
  );

  console.log("bruh", firstsInGame);
  if (firstsInCount.length === 0) {
    if (firstsInGame.length === 0) return "";
    return `You are ${firstsInCount
      .map((key) => {
        return `first in ${getStringFromStatKey(key).toLowerCase()} per game`;
      })
      .join(", ")}.`;
  }
  return `You are ${firstsInCount
    .map((key) => {
      return `first in ${getStringFromStatKey(key).toLowerCase()}`;
    })
    .join(", ")}.`;
};

export const getPerGameRankings = (allStatsByPlayers: AggregateStats) => {
  const rankingsByGame: Record<string, string[]> = {};

  //allstatsbyplayers but each player's stat is divided by their totalGames
  const allStatsByPlayersByGame = Object.keys(allStatsByPlayers).forEach(
    (playerId) => {
      const playerStats = allStatsByPlayers[playerId];
      const totalGames = playerStats.totalGames;
      Object.keys(playerStats).forEach((statName) => {
        playerStats[statName] = playerStats[statName] / totalGames;
      });
      return playerStats;
    }
  );
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
    rankingsByGame[statName] = sortedPlayerStatEntries.map(
      ([playerId]) => playerId
    );
  });
  return { rankingsByGame, allStatsByPlayersByGame };
};
