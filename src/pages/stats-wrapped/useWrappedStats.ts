import { useAppContext } from "../../context/AppContext";
import { Game, Player } from "../../types";
import {
  countLocations,
  determineLeadersOfWeirdStats,
  getGoodAndBadDays,
  getLocationLeader,
  getMedal,
  getPercentageBanter,
} from "./wrappedUtils";

export interface UseWrappedStats {
  mainRank: number;
  statLeaderString: string;
  locationsInfo: {
    rankedLocations: [string, { games: number; totalScore: number }][];
    rankedPointsLocations: [string, { games: number; totalScore: number }][];
  };
  locationLeader: { name: string; score: number };
  worstDay: string | undefined;
  worstDayPoints: number;
  bestDay: string | undefined;
  bestDayPoints: number;
  percentBanter: string[];
  badDayCount: number;
  goodDayCount: number;
  medal: string;
  playerName: string;
}

export const useWrappedStats = (
  player: Player | undefined,
  playerGames: Game[]
): UseWrappedStats => {
  const { rankings, allStatsByPlayers, scoringMatrix } = useAppContext();
  const playerName = player?.firstName ?? "";
  const statLeaderString = determineLeadersOfWeirdStats(
    rankings,
    player?.id,
    allStatsByPlayers
  );
  const locationsInfo = countLocations(playerGames, player?.id, scoringMatrix);
  const locationLeader = getLocationLeader(
    playerGames,
    player?.id ?? "",
    scoringMatrix
  );
  const {
    worstDay,
    worstDayPoints,
    bestDay,
    bestDayPoints,
    badDayCount,
    goodDayCount,
  } = getGoodAndBadDays(playerGames, player?.id ?? "", scoringMatrix);
  const percentBanter = getPercentageBanter(
    rankings,
    allStatsByPlayers,
    player?.id ?? ""
  );
  const mainRank = rankings["fantasyScore"]?.indexOf(player?.id ?? "") ?? 10;
  const medal = getMedal(mainRank);
  return {
    mainRank,
    statLeaderString,
    locationsInfo,
    locationLeader,
    worstDay,
    worstDayPoints,
    bestDay,
    bestDayPoints,
    percentBanter,
    badDayCount,
    goodDayCount,
    medal,
    playerName,
  };
};
