import React, { createContext, useState, ReactNode, useContext } from "react";
import { AggregateStats, Game, League, Player, User } from "../types";
import { mockLeague, mockScoringMatrix } from "../backend/fixtures";
import { useGetRankingByField } from "../pages/playersList/hooks/useGetRankingByField";
import {
  useFetchGames,
  useFetchPlayers,
  useFetchUsers,
} from "../backend/getters";
import { UseAuthState, useAuthState } from "../auth/useAuthState";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextType {
  users: User[];
  players: Player[];
  league: League;
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
  const [league, setLeague] = useState<League>(mockLeague);

  const [scoringMatrix, setScoringMatrix] = useState(mockScoringMatrix);
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
