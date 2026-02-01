import { Timestamp } from "firebase/firestore";

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
  firstName: string;
  lastName: string;
  nickname?: string;
  out?: boolean;
  profilePictureUrl?: string;
  defaultLocation?: string;
  joinDate?: string;
}

export interface PoolHallLocation {
  id: string;
  name: string;
  dateAdded?: Timestamp;
  discoveryPlayerIds?: string[];
  city?: string;
  state?: string;
  icon?: string;
  description?: string;
  lastEditedBy?: string;
}

export interface League {
  id: string;
  name: string;
  leagueManagerId: string;
  leagueManagerMessage?: string;
  scoringMatrix?: { [key: string]: number };
  release2024Wrapped?: boolean;
}

export interface Game {
  id: string;
  timestamp: string;
  location?: string;
  playerIds: string[];
  statsByPlayer: GameStat[];
  excludeGame?: boolean;
  authorPlayerId?: string;
  createdAt?: Timestamp;
  endedAt?: string;
  editedAt?: string;
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
  scratches = "scratches",
  skillShots = "skillShots",
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
  scratches = "SCR",
  skillShots = "SS",
}
export interface GameStat {
  playerId: string;
  [GameStatKeys.winsBy8BallSink]?: number;
  [GameStatKeys.winsByOpponentScratch]?: number;
  [GameStatKeys.lossesBy8BallSink]?: number;
  [GameStatKeys.lossesByScratch]?: number;
  [GameStatKeys.threeBallsPocketedInRow]?: number;
  [GameStatKeys.fourBallsPocketedInRow]?: number;
  [GameStatKeys.fiveBallsPocketedInRow]?: number;
  [GameStatKeys.sixBallsPocketedInRow]?: number;
  [GameStatKeys.sevenBallsPocketedInRow]?: number;
  [GameStatKeys.runTheTable]?: number;
  [GameStatKeys.scratches]?: number;
  [GameStatKeys.skillShots]?: number;
}

export interface AggregateStats {
  [playerId: string]: {
    [statName: string]: number;
  };
}

export interface FullSeasonRecordObject {
  seasonEndDate: string;
  records: SeasonRecords;
  leagueId: string;
}

export interface SeasonRecords {
  [playerId: string]: StatsForPlayerGames & { rank: number };
}

export type StatsForPlayerGames = GameStat & {
  totalGames: number;
  totalWins: number;
  totalSessions: number;
  winPercentage: number;
  fantasyScore: number;
  fantasyGameAvg: number;
};
