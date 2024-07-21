import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { Game, League, Player, User } from "../types";
import { mockLeague, mockPlayers, mockUsers } from "../backend/fixtures";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextType {
  users: User[];
  players: Player[];
  league: League;
  games: Game[];
  addGame: (game: Game) => void;
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

  const addGame = (game: Game) => {
    setGames((prevGames) => [...prevGames, game]);
  };
  return (
    <AppContext.Provider value={{ users, players, league, games, addGame }}>
      {children}
    </AppContext.Provider>
  );
};
