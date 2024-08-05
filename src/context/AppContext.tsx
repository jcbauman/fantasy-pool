import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { AggregateStats, Game, League, Player, User } from "../types";
import { mockLeague, mockScoringMatrix } from "../backend/fixtures";
import { useGetRankingByField } from "../pages/playersList/hooks/useGetRankingByField";
import {
  fetchLeague,
  useFetchGames,
  useFetchPlayers,
  useFetchUsers,
} from "../backend/getters";
import { UseAuthState, useAuthState } from "../auth/useAuthState";

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
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextpaProvider");
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const users = useFetchUsers();
  const players = useFetchPlayers();
  const authState = useAuthState();
  const games = useFetchGames();
  const [league, setLeague] = useState<League | undefined>(mockLeague);
  useEffect(() => {
    const getLeague = async (): Promise<void> => {
      if (authState.user?.leagueId) {
        const res = await fetchLeague(authState.user?.leagueId);
        if (res) {
          setLeague(res as League);
        } else {
          setLeague(undefined);
        }
      }
    };
    getLeague();
  }, [authState.user?.leagueId]);
  const scoringMatrix = league?.scoringMatrix ?? mockScoringMatrix;
  const { rankings, allStatsByPlayers } = useGetRankingByField(players, games);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
