import { useEffect, useState } from "react";
import { fetchGamesBeforeTimestamp } from "../../backend/getters";
import { AggregateStats, Game, GameStat, Player } from "../../types";
import { useGetRankingByField } from "../playersList/hooks/useGetRankingByField";
import { useAppContext } from "../../context/AppContext";
import { mockScoringMatrix } from "../../backend/fixtures";
import { Timestamp } from "firebase/firestore";
import { HISTORICAL_RECORD_KEY } from "../../backend/constants";
import { getStartOfMonth } from "./adminUtils";
import { useDispatch } from "react-redux";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../redux/notificationSlice";
import { updateHistoricalRecords } from "../../backend/setters";

interface UseUpdateHistoricalRecords {
  historicalGame: Game | undefined;
  saveHistoricalRecord: () => Promise<void>;
}

export const useUpdateHistoricalRecords = (): UseUpdateHistoricalRecords => {
  const { players, league } = useAppContext();
  const dispatch = useDispatch();
  const scoringMatrix = league?.scoringMatrix ?? mockScoringMatrix;
  const [gamesBeforeThisMonth, setGamesBeforeThisMonth] = useState<Game[]>([]);
  const [historicalGame, setHistoricalGame] = useState<Game | undefined>(
    undefined
  );

  // fetch the games before the start of the month
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

  //calculate a new historical record
  useEffect(() => {
    if (gamesBeforeThisMonth.length > 0 && allStatsByPlayers) {
      const res = convertStatsToGame(allStatsByPlayers, players);
      if (res) setHistoricalGame(res);
    }
  }, [gamesBeforeThisMonth, allStatsByPlayers, players]);

  const saveHistoricalRecord = async (): Promise<void> => {
    if (!historicalGame) return;
    await updateHistoricalRecords(
      historicalGame,
      () => dispatch(sendSuccessNotification("Historical records updated")),
      () =>
        dispatch(sendErrorNotification("Could not update historical records"))
    );
  };
  return { historicalGame, saveHistoricalRecord };
};

export const convertStatsToGame = (
  stats: AggregateStats,
  players: Player[]
) => {
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
  return game;
};
