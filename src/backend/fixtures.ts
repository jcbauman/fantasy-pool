import { Game, League, Player, User } from "../types";
import { v4 as uuidv4 } from "uuid";

const userId = "e3962e0e-768f-4281-84bd-345cc7ebd270";
const playerId = "5d64d0a0-e5ea-44b5-9e1d-b13daa78d944";
const player2Id = "8216f468-e5f2-4391-bb6b-fd438a91f39d";
export const mockUsers: User[] = [
  {
    id: userId,
    email: "rocko@gmail.com",
    pw: "1234",
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
  name: "Rocko's League",
  userIds: [userId],
  leagueManagerId: userId,
};

export const mockGame: Game = {
  id: uuidv4(),
  playerIds: [playerId],
  timestamp: new Date().toString(),
  location: "The Levee",
  statsByPlayer: [
    {
      winsBy8BallSink: 1,
      winsByOpponentScratch: 3,
      scratches: 2,
      lossesBy8BallSink: 1,
      lossesByScratch: 3,
      ballsPocketedInRow: 6,
      georgeWashingtons: 2,
      incredibleShots: 1,
    },
  ],
};
