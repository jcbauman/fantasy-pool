import { useEffect, useState } from "react";
import {
  fetchGamesAfterTimestamp,
  fetchGamesBeforeTimestamp,
} from "../../backend/getters";
import { AggregateStats, Game, GameStat, Player } from "../../types";
import { useGetRankingByField } from "../playersList/hooks/useGetRankingByField";
import { useAppContext } from "../../context/AppContext";
import { mockScoringMatrix } from "../../backend/fixtures";
import { Timestamp } from "firebase/firestore";
import { HISTORICAL_RECORD_KEY } from "../../backend/constants";

const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

export const useUpdateHistoricalRecords = () => {
  const { players, league } = useAppContext();
  const scoringMatrix = league?.scoringMatrix ?? mockScoringMatrix;
  const [gamesBeforeThisMonth, setGamesBeforeThisMonth] = useState<Game[]>([]);
  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      const startOfMonth = getStartOfMonth(new Date());
      const gamesBeforeThisMonth = await fetchGamesBeforeTimestamp(
        startOfMonth
      );
      setGamesBeforeThisMonth(gamesBeforeThisMonth);
    };
    fetchStats();
  }, []);
  const { allStatsByPlayers } = useGetRankingByField(
    players,
    gamesBeforeThisMonth,
    scoringMatrix
  );
  useEffect(() => {
    if (gamesBeforeThisMonth.length > 0 && allStatsByPlayers) {
      console.log(allStatsByPlayers, "bruh");
      const res = convertStatsToGame(allStatsByPlayers, players);
      //to do complete flow
    }
  }, [gamesBeforeThisMonth, allStatsByPlayers, players]);
  console.log(allStatsByPlayers, "bruh");
};

const convertStatsToGame = (stats: AggregateStats, players: Player[]) => {
  const timestamp = new Date();
  let game: Game = {
    id: HISTORICAL_RECORD_KEY,
    timestamp: timestamp.toString(),
    createdAt: Timestamp.fromDate(timestamp),
    statsByPlayer: [],
    playerIds: players.map((p) => p.id),
  };
  Object.keys(stats).forEach((id) => {
    const playerAgg = stats[id];
    const playerStat: GameStat = {
      playerId: id,
      ...(playerAgg as Omit<GameStat, "playerId">),
    };
    game = { ...game, statsByPlayer: [...game.statsByPlayer, playerStat] };
  });
  console.log(game, "bruh");
  return game;
};
