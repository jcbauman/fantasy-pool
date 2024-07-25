export interface User {
  fbID: string;
  id: string;
  email: string;
  name?: string;
  leagueId?: string;
  isAppAdmin?: boolean;
}

export interface Player {
  id: string;
  linkedUserId: string;
  name: string;
  nickname?: string;
  out?: boolean;
  profilePictureUrl?: string;
  defaultLocation?: string;
}

export interface League {
  id: string;
  name: string;
  userIds: string[];
  leagueManagerId: string;
}

export interface Game {
  id: string;
  timestamp: string;
  location?: string;
  playerIds: string[];
  statsByPlayer: GameStat[];
  excludeGame?: boolean;
}

export enum GameStatKeys {
  winsBy8BallSink = "winsBy8BallSink",
  winsByOpponentScratch = "winsByOpponentScratch",
  lossesBy8BallSink = "lossesBy8BallSink",
  lossesByScratch = "lossesByScratch",
  threeBallsPocketedInRow = "threeBallsPocketedInRow",
  fourBallsPocketedInRow = "fourBallsPocketedInRow",
  fiveBallsPocketedInRow = "fiveBallsPocketedInRow",
  sixBallsPocketedInRow = "sixBallsPocketedInRow",
  sevenBallsPocketedInRow = "sevenBallsPocketedInRow",
  runTheTable = "runTheTable",
  georgeWashingtons = "georgeWashingtons",
  incredibleShots = "incredibleShots",
}

export enum GameStatKeysAbbrev {
  winsBy8BallSink = "W8",
  winsByOpponentScratch = "WS",
  lossesBy8BallSink = "L8",
  lossesByScratch = "LS",
  threeBallsPocketedInRow = "3PR",
  fourBallsPocketedInRow = "4PR",
  fiveBallsPocketedInRow = "5PR",
  sixBallsPocketedInRow = "6PR",
  sevenBallsPocketedInRow = "7PR",
  runTheTable = "8PR",
  georgeWashingtons = "GW",
  incredibleShots = "IS",
}
export interface GameStat {
  playerId: string;
  [GameStatKeys.winsBy8BallSink]: number;
  [GameStatKeys.winsByOpponentScratch]: number;
  [GameStatKeys.lossesBy8BallSink]: number;
  [GameStatKeys.lossesByScratch]: number;
  [GameStatKeys.threeBallsPocketedInRow]: number;
  [GameStatKeys.fourBallsPocketedInRow]: number;
  [GameStatKeys.fiveBallsPocketedInRow]: number;
  [GameStatKeys.sixBallsPocketedInRow]: number;
  [GameStatKeys.sevenBallsPocketedInRow]: number;
  [GameStatKeys.runTheTable]: number;
  [GameStatKeys.georgeWashingtons]: number;
  [GameStatKeys.incredibleShots]: number;
}

export interface AggregateStats {
  [playerId: string]: {
    [statName: string]: number;
  };
}
