import { useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { getRankingByField } from "../../playersList/hooks/useGetRankingByField";
import { bucketGamesByWeek } from "./utils";

export interface RankingsByWeek {
  [weekStart: string]: Record<string, string[]>;
}

interface UseGetRankingByField {
  rankingsByWeek: RankingsByWeek;
}

export const useGetWeeklyStandings = (): UseGetRankingByField => {
  const { games, players, scoringMatrix } = useAppContext();
  const bucketedGames = useMemo(() => bucketGamesByWeek(games), [games]);
  const rankingsByWeek = Object.keys(bucketedGames).reduce(
    (acc: RankingsByWeek, weekKey: string) => {
      const { rankings } = getRankingByField(
        players,
        bucketedGames[weekKey],
        scoringMatrix
      );
      if (!acc[weekKey]) {
        acc[weekKey] = rankings;
      }

      return acc;
    },
    {}
  );
  return { rankingsByWeek };
};
