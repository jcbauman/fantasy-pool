import { GameStat, GameStatKeys } from "../types";

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
  [GameStatKeys.winsBy8BallSink]: "Wins by sinking the 8-ball",
  [GameStatKeys.winsByOpponentScratch]:
    "Wins by opponent scratch or mis-calling 8-ball",
  [GameStatKeys.lossesBy8BallSink]: "Loss from opponent sinking the 8-ball",
  [GameStatKeys.lossesByScratch]:
    "Loss by scratching or mis-calling the 8-ball",
  [GameStatKeys.threeBallsPocketedInRow]:
    "3 balls pocketed in a row before missing",
  [GameStatKeys.fourBallsPocketedInRow]:
    "4 balls pocketed in a row before missing",
  [GameStatKeys.fiveBallsPocketedInRow]:
    "5 balls pocketed in a row before missing",
  [GameStatKeys.sixBallsPocketedInRow]:
    "6 balls pocketed in a row before missing",
  [GameStatKeys.sevenBallsPocketedInRow]:
    "7 balls pocketed in a row before missing",
  [GameStatKeys.runTheTable]: "Runs of the table - all 8 balls in a row",
  [GameStatKeys.georgeWashingtons]:
    "George Washingtons - giving up the table after a win",
  [GameStatKeys.incredibleShots]:
    "Incredible shots - Risky yet successful shots that ellicit praise from opponent or onlooker",
};
