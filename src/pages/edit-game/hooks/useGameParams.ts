import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../../../types";
import { fetchGameById } from "../../../backend/getters";

interface GameParams extends Record<string, string | undefined> {
  id: string;
}

interface UseGameParams {
  game: Game | undefined;
  loading: boolean;
}

export const useGameParams = (): UseGameParams => {
  const [game, setGame] = useState<Game | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const { id } = useParams<GameParams>();

  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoading(true);
      const thisGame = await fetchGameById(id);
      setGame(thisGame);
      setLoading(false);
    };
    if (id) {
      fetchPlayerData(id);
    }
  }, [id]);

  return { game, loading };
};
