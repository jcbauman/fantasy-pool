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
