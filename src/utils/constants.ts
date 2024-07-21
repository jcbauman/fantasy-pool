import { GameStat, GameStatKeys } from "../types";

export const defaultGameStat: Omit<GameStat, "playerId"> = {
  [GameStatKeys.winsBy8BallSink]: 0,
  [GameStatKeys.winsByOpponentScratch]: 0,
  [GameStatKeys.lossesBy8BallSink]: 0,
  [GameStatKeys.lossesByScratch]: 0,
  [GameStatKeys.ballsPocketedInRow]: 0,
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
  [GameStatKeys.ballsPocketedInRow]: "Balls pocketed in a row",
  [GameStatKeys.georgeWashingtons]:
    "George Washingtons - giving up the table after a win",
  [GameStatKeys.incredibleShots]:
    "Incredible shots - Risky yet successful shots that ellicit praise from opponent or onlooker",
};
