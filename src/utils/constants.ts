import { GameStat, GameStatKeys, GameStatKeysAbbrev } from "../types";

export const defaultGameStat: Omit<GameStat, "playerId"> = {
  [GameStatKeys.winsBy8BallSink]: 0,
  [GameStatKeys.winsByOpponentScratch]: 0,
  [GameStatKeys.lossesBy8BallSink]: 0,
  [GameStatKeys.lossesByScratch]: 0,
  [GameStatKeys.threeBallsPocketedInRow]: 0,
  [GameStatKeys.fourBallsPocketedInRow]: 0,
  [GameStatKeys.fiveBallsPocketedInRow]: 0,
  [GameStatKeys.sixBallsPocketedInRow]: 0,
  [GameStatKeys.sevenBallsPocketedInRow]: 0,
  [GameStatKeys.eightBallsPocketedInRow]: 0,
  [GameStatKeys.runTheTable]: 0,
  [GameStatKeys.scratches]: 0,
  [GameStatKeys.skillShots]: 0,
};

export const StatAbbreviations: { [key: string]: string } = {
  [GameStatKeysAbbrev[GameStatKeys.winsBy8BallSink]]:
    "Wins by sinking the 8-ball",
  [GameStatKeysAbbrev[GameStatKeys.winsByOpponentScratch]]:
    "Wins by opponent scratch or mis-calling 8-ball",
  [GameStatKeysAbbrev[GameStatKeys.lossesBy8BallSink]]:
    "Loss from opponent sinking the 8-ball",
  [GameStatKeysAbbrev[GameStatKeys.lossesByScratch]]:
    "Loss by scratching or mis-calling the 8-ball",
  [GameStatKeysAbbrev[GameStatKeys.threeBallsPocketedInRow]]:
    "3 balls pocketed in a row before missing",
  [GameStatKeysAbbrev[GameStatKeys.fourBallsPocketedInRow]]:
    "4 balls pocketed in a row before missing",
  [GameStatKeysAbbrev[GameStatKeys.fiveBallsPocketedInRow]]:
    "5 balls pocketed in a row before missing",
  [GameStatKeysAbbrev[GameStatKeys.sixBallsPocketedInRow]]:
    "6 balls pocketed in a row before missing",
  [GameStatKeysAbbrev[GameStatKeys.sevenBallsPocketedInRow]]:
    "7 balls pocketed in a row before missing",
  [GameStatKeysAbbrev[GameStatKeys.eightBallsPocketedInRow]]:
    "8 balls pocketed in a row, not off the break",
  [GameStatKeysAbbrev[GameStatKeys.runTheTable]]:
    "Runs of the table - all 8 balls in a row off the break",
  [GameStatKeysAbbrev[GameStatKeys.skillShots]]:
    "Skill shots - successful called bank-shots, combos, or caroms",
  [GameStatKeysAbbrev[GameStatKeys.scratches]]:
    "Scratches - scratched (not including game-losing scratches)",
};

export const SimpleStatAbbreviations: { [key: string]: string } = {
  [GameStatKeys.winsBy8BallSink]: "Win by 8-ball",
  [GameStatKeys.winsByOpponentScratch]: "Win by opponent scratch",
  [GameStatKeys.lossesBy8BallSink]: "Loss by 8-ball",
  [GameStatKeys.lossesByScratch]: "Loss by scratch",
  [GameStatKeys.threeBallsPocketedInRow]: "3 balls in a row",
  [GameStatKeys.fourBallsPocketedInRow]: "4 balls in a row",
  [GameStatKeys.fiveBallsPocketedInRow]: "5 balls in a row",
  [GameStatKeys.sixBallsPocketedInRow]: "6 balls in a row",
  [GameStatKeys.sevenBallsPocketedInRow]: "7 balls in a row",
  [GameStatKeys.eightBallsPocketedInRow]: "8 balls in a row",
  [GameStatKeys.runTheTable]: "Run of the table",
  [GameStatKeys.skillShots]: "Skill shot",
  [GameStatKeys.scratches]: "Scratch",
};

export const INVITE_PW = "oyoyoy";

export const LAST_SEASON_CUTOFF_DATE = "2024-12-31T23:59:59Z";
