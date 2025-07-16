import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPlayerById,
  getGamesForPlayerAfterDate,
} from "../../backend/getters";
import { Game, Player } from "../../types";

interface PlayerParams extends Record<string, string | undefined> {
  id: string;
}

interface UsePlayerParams {
  player: Player | undefined;
  playerGames: Game[];
  loading: boolean;
}

export const usePlayerParams = (ignoreGames?: boolean): UsePlayerParams => {
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);

  const [loading, setLoading] = useState(false);
  const { id } = useParams<PlayerParams>();

  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoading(true);
      const thisPlayer = await fetchPlayerById(id);
      setPlayer(thisPlayer);
      if (!ignoreGames) {
        const thisPlayerGames = await getGamesForPlayerAfterDate(id);
        setPlayerGames(thisPlayerGames || []);
      }
      setLoading(false);
    };
    if (id) {
      fetchPlayerData(id);
    }
  }, [id, ignoreGames]);

  return { player, playerGames, loading };
};
