import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AggregateStats, Game, League, Player, User } from "../types";
import {
  mockLeague,
  mockPlayers,
  mockScoringMatrix,
  mockUsers,
} from "../backend/fixtures";
import { useGetRankingByField } from "../pages/playersList/hooks/useGetRankingByField";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextType {
  users: User[];
  players: Player[];
  league: League;
  games: Game[];
  addGame: (game: Game) => void;
  rankings: Record<string, string[]>;
  allStatsByPlayers: AggregateStats;
  scoringMatrix: Record<string, number>;
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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [league, setLeague] = useState<League>(mockLeague);
  const [games, setGames] = useState<Game[]>([]);
  const [scoringMatrix, setScoringMatrix] = useState(mockScoringMatrix);
  const { rankings, allStatsByPlayers } = useGetRankingByField(players, games);

  const addGame = (game: Game) => {
    setGames((prevGames) => [...prevGames, game]);
  };
  return (
    <AppContext.Provider
      value={{
        users,
        players,
        league,
        games,
        addGame,
        rankings,
        allStatsByPlayers,
        scoringMatrix,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
