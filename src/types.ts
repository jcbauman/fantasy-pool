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

export interface GameStat {
  winsBy8BallSink: number;
  winsByOpponentScratch: number;
  scratches: number;
  lossesBy8BallSink: number;
  lossesByScratch: number;
  ballsPocketedInRow: number;
  georgeWashingtons: number;
  incredibleShots: number;
}
