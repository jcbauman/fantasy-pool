import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { AggregateStats, Game, League, Player, User } from "../types";
import { mockScoringMatrix } from "../backend/fixtures";
import { useGetRankingByField } from "../pages/players/hooks/useGetRankingByField";
import {
  fetchLeague,
  getPastSeasonHistoricalRecord,
  useFetchGamesAfterDate,
  useFetchPlayers,
  useFetchUsers,
} from "../backend/getters";
import { UseAuthState, useAuthState } from "../auth/useAuthState";
import {
  NotificationBadgesState,
  useNotificationBadges,
} from "../shared-components/hooks/useNotificationBadges";
import { checkPlayerInactivity } from "../pages/players/utils/inactivityUtils";
import { SeasonRecords } from "../pages/players/utils/playerUtils";
import { sendErrorNotification } from "../shared-components/toasts/notificationToasts";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextType {
  users: User[];
  players: Player[];
  league: League | undefined;
  games: Game[];
  rankings: Record<string, string[]>;
  allStatsByPlayers: AggregateStats;
  scoringMatrix: Record<string, number>;
  authState: UseAuthState;
  notificationBadgesState: NotificationBadgesState;
  records: SeasonRecords | undefined;
  initialLoading: boolean;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContext Provider");
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [league, setLeague] = useState<League | undefined>(undefined);
  const [records, setRecords] = useState<SeasonRecords | undefined>(undefined);
  const [loadingLeague, setLoadingLeague] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const users = useFetchUsers();
  const players = useFetchPlayers();
  const authState = useAuthState();
  const games = useFetchGamesAfterDate();
  const notificationBadgesState = useNotificationBadges(games, league);

  useEffect(() => {
    if (authState?.user?.isAppAdmin) {
      players.forEach((player) => {
        checkPlayerInactivity(player, games);
      });
    }
  }, [players, games, authState?.user?.isAppAdmin]);

  useEffect(() => {
    const getLeague = async (): Promise<void> => {
      setLoadingLeague(true);
      if (authState.user?.leagueId) {
        const res = await fetchLeague(authState.user?.leagueId);
        if (res) {
          setLeague(res as League);
        } else {
          setLeague(undefined);
        }
        setLoadingLeague(false);
      } else {
        setLoadingLeague(false);
      }
    };
    getLeague();
  }, [authState.user?.leagueId]);

  useEffect(() => {
    const getLastSeasonRecords = async (): Promise<void> => {
      setLoadingRecords(true);
      if (authState.user?.leagueId) {
        const res = await getPastSeasonHistoricalRecord();
        if (res) {
          setRecords(res);
        } else {
          setRecords(undefined);
          sendErrorNotification("Could not fetch records");
        }
      }
      setLoadingRecords(false);
    };
    getLastSeasonRecords();
  }, [authState.user?.leagueId]);

  const scoringMatrix = league?.scoringMatrix ?? mockScoringMatrix;
  const { rankings, allStatsByPlayers } = useGetRankingByField(
    players,
    games,
    scoringMatrix
  );

  return (
    <AppContext.Provider
      value={{
        users,
        players,
        league,
        games,
        rankings,
        allStatsByPlayers,
        scoringMatrix,
        authState,
        notificationBadgesState,
        records,
        initialLoading: loadingLeague || loadingRecords || !league,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
