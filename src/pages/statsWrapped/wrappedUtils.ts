import { AggregateStats, Game, GameStatKeys } from "../../types";
import {
  formatDateToMMDD,
  getFantasyScoreForPlayerSeason,
  getStringFromStatKey,
  normalizePercentage,
} from "../../utils/statsUtils";

const MAIN_AFFIRMATIONS = [
  [
    "your precision and strategy on the table make you a true master of the game.",
    "You're a pool legend through and through!",
  ],
  [
    "with your sharp eye and consistent aim,",
    "you’ve shown everyone what it means to dominate the game with class.",
  ],
  [
    "your steady hand and clever plays have proven",
    " you’re a force to be reckoned with at the table.",
  ],
  [
    "you have the kind of pool finesse that makes every game a joy to watch.",
    "Keep up the great work!",
  ],
  [
    "your ability to line up shots and sink them with style",
    "shows your growing expertise in the game.",
  ],
  [
    "your determination and focus on the table are inspiring",
    "keep hustling and those wins will keep coming!",
  ],
  [
    "every game you play shows your passion for pool,",
    "and it’s clear you’re just getting started on your rise.",
  ],
  [
    "your creativity on the table shows you’re not just playing the game",
    "you’re crafting your own unique style.",
  ],
  [
    "your sportsmanship and love for the game make you a player everyone respects",
    "victories will follow!",
  ],
  [
    "you’re the heart of the league with your enthusiasm and energy",
    "every great story has a scrappy underdog!",
  ],
];

export const getMainAffirmation = (index: number) => {
  if (index > MAIN_AFFIRMATIONS.length - 1) {
    return MAIN_AFFIRMATIONS[MAIN_AFFIRMATIONS.length - 1];
  }
  return MAIN_AFFIRMATIONS[index];
};

export const countLocations = (
  games: Game[],
  playerId: string,
  scoringMatrix: Record<string, number>
): {
  rankedLocations: [string, { games: number; totalScore: number }][];
  rankedPointsLocations: [string, { games: number; totalScore: number }][];
} => {
  const locations = games.reduce((acc, game) => {
    if (game.location) {
      if (!acc[game.location]) {
        acc[game.location] = {
          games: 1,
          totalScore: getFantasyScoreForPlayerSeason(
            [game],
            playerId,
            scoringMatrix
          ),
        };
      } else {
        acc[game.location] = {
          games: acc[game.location].games + 1,
          totalScore:
            acc[game.location].totalScore +
            getFantasyScoreForPlayerSeason([game], playerId, scoringMatrix),
        };
      }
    }
    return acc;
  }, {} as Record<string, { games: number; totalScore: number }>);

  //order locations by most games played
  const rankedLocations = Object.entries(locations).sort(
    (a, b) => b[1].games - a[1].games
  );

  //order locations by most points scored
  const rankedPointsLocations = Object.entries(locations).sort(
    (a, b) => b[1].totalScore - a[1].totalScore
  );
  return { rankedLocations, rankedPointsLocations };
};

export const getLocationLeader = (
  games: Game[],
  playerId: string,
  scoringMatrix: Record<string, number>
): { name: string; score: number } => {
  const locationsInfo = countLocations(games, playerId, scoringMatrix);
  const specialHardcodedLocations: Record<string, string> = {
    Z8V1bf9Xcze6qnIgcrbU: "Abe's Pagoda Bar",
    Fwonnaprz0okB0HIYUje: "Bushwick Ice House",
    x5QiXK4bh88GTIoflUoZ: "The Levee",
    sgBzBphKFqF3zA0c1rJl: "The Johnson's",
  };
  const score = specialHardcodedLocations[playerId]
    ? locationsInfo.rankedPointsLocations.find(
        (item) => item[0] === specialHardcodedLocations[playerId]
      )?.[1].totalScore
    : locationsInfo.rankedPointsLocations[0][1].totalScore;
  return {
    name:
      specialHardcodedLocations[playerId] ??
      locationsInfo.rankedPointsLocations[0][0],
    score: score ?? 0,
  };
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
  // list which keys that playerId ranks first in in rankings
  const firstsInCount = Object.keys(rankings).filter(
    (key) => rankings[key][0] === forPlayerId && !excludedKeys.includes(key)
  );

  if (firstsInCount.length === 0) {
    return "";
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

export const getGoodAndBadDays = (
  games: Game[],
  playerId: string,
  scoringMatrix: Record<string, number>
): {
  worstDay: string | undefined;
  worstDayPoints: number;
  bestDay: string | undefined;
  bestDayPoints: number;
  badDayCount: number;
  goodDayCount: number;
} => {
  // bucket games by date (timestamp)
  const gamesByDate = games.reduce((acc, game) => {
    const date = formatDateToMMDD(new Date(game.timestamp));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  let worstDay: string | undefined = undefined;
  let worstDayPoints = 1000000;
  let bestDay: string | undefined = undefined;
  let bestDayPoints = -1000000;
  let badDayCount = 0;
  let goodDayCount = 0;

  Object.keys(gamesByDate).forEach((date) => {
    let fantasyScore = getFantasyScoreForPlayerSeason(
      gamesByDate[date],
      playerId,
      scoringMatrix
    );
    if (fantasyScore < worstDayPoints) {
      worstDay = date;
      worstDayPoints = fantasyScore;
    }
    if (fantasyScore > bestDayPoints) {
      bestDay = date;
      bestDayPoints = fantasyScore;
    }
    if (fantasyScore < 0) {
      badDayCount++;
    } else {
      goodDayCount++;
    }
  });

  return {
    worstDay,
    worstDayPoints,
    bestDay,
    bestDayPoints,
    badDayCount,
    goodDayCount,
  };
};

export const getPercentageBanter = (
  rankings: Record<string, string[]>,
  allStatsByPlayers: AggregateStats,
  playerId: string
): string[] => {
  const percentage =
    allStatsByPlayers[playerId]["totalWins"] /
    allStatsByPlayers[playerId]["totalGames"];
  const stringPercent = normalizePercentage(percentage);
  const rank = rankings["winPercentage"].indexOf(playerId);
  const banter =
    rank < 3 ? "Love to see it 😤" : "You know you can do better than that 😤";
  return [
    stringPercent,
    "This isn't just any number. It's your win percentage.",
    "Not too shabby.",
    `That puts you ${toOrdinal(rank)} in the league.`,
    banter,
  ];
};

export const getMedal = (index: number, include4th?: boolean): string => {
  switch (index) {
    case 0:
      return "🏆";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    case 3:
      return include4th ? "🏅" : "";
    default:
      return "";
  }
};

export const handleShare = async (title: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url: window.location.href,
      });
      console.log("Content shared successfully!");
    } catch (error) {
      copyToClipboard(window.location.href);
    }
  } else {
    alert("Sharing is not supported on this device.");
  }
};

export const copyToClipboard = (text: string, onSuccess?: () => void): void => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      onSuccess?.();
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

export const generateBgColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const BG_COLORS = ["#ebb604", "#cc1301", "#0c1a7d", "#02694b", "#770504"];
  const color = BG_COLORS[Math.abs(Math.round(hash)) % BG_COLORS.length];
  return color;
};
