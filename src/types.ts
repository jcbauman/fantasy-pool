export interface User {
  id: string;
  email: string;
  pw: string;
  name: string;
  leagueId: string;
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
}

export enum GameStatKeys {
  winsBy8BallSink = "W8",
  winsByOpponentScratch = "WS",
  lossesBy8BallSink = "L8",
  lossesByScratch = "LS",
  ballsPocketedInRow = "PIR",
  georgeWashingtons = "GW",
  incredibleShots = "IS",
  fantasyPoints = "FP",
}
export interface GameStat {
  playerId: string;
  [GameStatKeys.winsBy8BallSink]: number;
  [GameStatKeys.winsByOpponentScratch]: number;
  [GameStatKeys.lossesBy8BallSink]: number;
  [GameStatKeys.lossesByScratch]: number;
  [GameStatKeys.ballsPocketedInRow]: number;
  [GameStatKeys.georgeWashingtons]: number;
  [GameStatKeys.incredibleShots]: number;
}
