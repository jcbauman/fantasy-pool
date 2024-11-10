import { Game, GameStatKeys, League, Player, User } from "../types";
import { v4 as uuidv4 } from "uuid";

const userId = "e3962e0e-768f-4281-84bd-345cc7ebd270";
const playerId = "pIswTHPOxcQxlrzuQ2k7";
const player2Id = "8216f468-e5f2-4391-bb6b-fd438a91f39d";
export const mockUsers: User[] = [
  {
    fbID: uuidv4(),
    id: userId,
    email: "rocko@gmail.com",
    name: "Rocko",
    leagueId: "1",
  },
];

export const mockPlayers: Player[] = [
  {
    id: playerId,
    linkedUserId: userId,
    nickname: "Rocking",
    name: "Rocko Bauman",
    out: false,
    defaultLocation: "Bushwick Ice House",
    profilePictureUrl:
      "https://media.licdn.com/dms/image/C5603AQGkdy2JkIH64A/profile-displayphoto-shrink_400_400/0/1562954396428?e=1726704000&v=beta&t=nI8zIBy82IoU7SVffaMJt561XUO3chadrE_cjnM6zWU",
  },
  {
    id: player2Id,
    linkedUserId: userId,
    nickname: "Amungus",
    name: "Amira Wheeler",
    out: true,
    defaultLocation: "The Levee",
    profilePictureUrl:
      "https://media-photos.depop.com/b0/4395970/271644258_dpTk4fGJgb/U6.jpg",
  },
];

export const mockLeague: League = {
  id: uuidv4(),
  name: "The Other Other League",
  leagueManagerId: userId,
};

export const mockGame: Game = {
  id: uuidv4(),
  playerIds: [playerId],
  timestamp: new Date().toString(),
  location: "The Levee",
  statsByPlayer: [
    {
      playerId: playerId,
      [GameStatKeys.winsBy8BallSink]: 1,
      [GameStatKeys.winsByOpponentScratch]: 3,
      [GameStatKeys.lossesBy8BallSink]: 1,
      [GameStatKeys.lossesByScratch]: 3,
      [GameStatKeys.threeBallsPocketedInRow]: 6,
      [GameStatKeys.fourBallsPocketedInRow]: 0,
      [GameStatKeys.fiveBallsPocketedInRow]: 0,
      [GameStatKeys.sixBallsPocketedInRow]: 0,
      [GameStatKeys.sevenBallsPocketedInRow]: 0,
      [GameStatKeys.runTheTable]: 0,
      [GameStatKeys.scratches]: 2,
      [GameStatKeys.skillShots]: 1,
    },
  ],
};

export const mockScoringMatrix: { [key: string]: number } = {
  [GameStatKeys.winsBy8BallSink]: 5,
  [GameStatKeys.winsByOpponentScratch]: 4,
  [GameStatKeys.lossesBy8BallSink]: -3,
  [GameStatKeys.lossesByScratch]: -2,
  [GameStatKeys.scratches]: -0.1,
  [GameStatKeys.skillShots]: 0.5,
  [GameStatKeys.threeBallsPocketedInRow]: 0.5,
  [GameStatKeys.fourBallsPocketedInRow]: 1,
  [GameStatKeys.fiveBallsPocketedInRow]: 2,
  [GameStatKeys.sixBallsPocketedInRow]: 4,
  [GameStatKeys.sevenBallsPocketedInRow]: 8,
  [GameStatKeys.runTheTable]: 15,
};
