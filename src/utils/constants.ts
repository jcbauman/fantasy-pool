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
  [GameStatKeys.runTheTable]: 0,
  [GameStatKeys.georgeWashingtons]: 0,
  [GameStatKeys.incredibleShots]: 0,
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
  [GameStatKeysAbbrev[GameStatKeys.runTheTable]]:
    "Runs of the table - all 8 balls in a row",
  [GameStatKeysAbbrev[GameStatKeys.georgeWashingtons]]:
    "George Washingtons - giving up the table after a win",
  [GameStatKeysAbbrev[GameStatKeys.incredibleShots]]:
    "Incredible shots - Risky yet successful shots that ellicit praise from opponent or onlooker",
};
