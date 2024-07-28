import { Game, GameStat, GameStatKeys } from "../types";

export const normalizePercentage = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : (value * 100).toFixed(1);
  return per + "%";
};

export const normalizeStat = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : value.toFixed(1);
  return per.toString();
};

export const getAbbreviation = (input?: string): string => {
  if (!input) return "?";
  if (!input.trim()) return "?";
  const words = input.trim().split(/\s+/);
  const abbreviation = words.map((word) => word[0].toUpperCase()).join("");
  if (abbreviation.length >= 3) {
    return abbreviation.substring(0, 3);
  }
  if (abbreviation.length === 1 && words[0].length > 2) {
    return words[0].substring(0, 3).toUpperCase();
  }
  return abbreviation;
};

export const formatDateToMMDD = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}`;
};

export const getFantasyMultiplierForStat = (
  statKey: string,
  scoringMatrix: Record<string, number>
): number => {
  if (scoringMatrix[statKey]) {
    return scoringMatrix[statKey];
  }
  return 0;
};

export const getFantasyScoreForStat = (
  stat: Omit<GameStat, "playerId">,
  scoringMatrix: Record<string, number>
): number => {
  let total = 0;
  Object.keys(stat as unknown as keyof GameStat).forEach((s) => {
    total +=
      getFantasyMultiplierForStat(s, scoringMatrix) *
      (stat?.[s as unknown as keyof Omit<GameStat, "playerId">] ?? 0);
  });
  return total;
};

export const getFantasyScoreForPlayerSeason = (
  games: Game[],
  playerId: string | undefined,
  scoringMatrix: Record<string, number>
): number => {
  let total = 0;
  if (playerId)
    games.forEach((game) => {
      const playerStats = game.statsByPlayer.find(
        (stat) => stat.playerId === playerId
      );
      if (playerStats) {
        const { playerId, ...rest } = playerStats;
        total += getFantasyScoreForStat(rest, scoringMatrix);
      }
    });
  return total;
};

export const getStatKeyFromNumBalls = (numBalls: number): GameStatKeys => {
  switch (numBalls) {
    case 3:
      return GameStatKeys.threeBallsPocketedInRow;
    case 4:
      return GameStatKeys.fourBallsPocketedInRow;
    case 5:
      return GameStatKeys.fiveBallsPocketedInRow;
    case 6:
      return GameStatKeys.sixBallsPocketedInRow;
    case 7:
      return GameStatKeys.sevenBallsPocketedInRow;
    case 8:
      return GameStatKeys.runTheTable;
    default:
      return GameStatKeys.threeBallsPocketedInRow;
  }
};

export const getStringFromStatKey = (statKey: string): string => {
  switch (statKey) {
    case GameStatKeys.winsBy8BallSink:
      return "Wins by 8 ball sink";
    case GameStatKeys.winsByOpponentScratch:
      return "Wins by opponent scratch";
    case GameStatKeys.lossesBy8BallSink:
      return "Losses by 8 ball sink";
    case GameStatKeys.lossesByScratch:
      return "Losses by scratch";
    case GameStatKeys.threeBallsPocketedInRow:
      return "3 in a row";
    case GameStatKeys.fourBallsPocketedInRow:
      return "4 in a row";
    case GameStatKeys.fiveBallsPocketedInRow:
      return "5 in a row";
    case GameStatKeys.sixBallsPocketedInRow:
      return "6 in a row";
    case GameStatKeys.sevenBallsPocketedInRow:
      return "7 in a row";
    case GameStatKeys.runTheTable:
      return "Run the table";
    case GameStatKeys.cueHauler:
      return "Beat cue-hauler";
    case GameStatKeys.skillShots:
      return "Skill shots";
    default:
      return "";
  }
};
