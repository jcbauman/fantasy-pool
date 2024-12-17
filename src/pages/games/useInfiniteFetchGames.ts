import { useCallback, useEffect, useState } from "react";
import { Game } from "../../types";
import { sendErrorNotification } from "../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import { paginatedFetchGames } from "../../backend/fetchers/games";

const PAGE_SIZE = 10;

interface UseInfiniteFetchGames {
  games: Game[];
  hasMore: boolean;
  loading: boolean;
  loadGames: () => Promise<void>;
}

export const useInfiniteFetchGames = (): UseInfiniteFetchGames => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();

  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      const { games: newGames, lastVisible } = await paginatedFetchGames(
        lastDoc,
        PAGE_SIZE
      );

      if (newGames.length === 0) {
        setHasMore(false);
        return;
      }

      setGames((prev) => [...prev, ...newGames]);
      setLastDoc(lastVisible);

      if (newGames.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      dispatch(sendErrorNotification("Unable to load games, please try again"));
      console.error("Failed to load games:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, dispatch]);

  useEffect(() => {
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    games,
    hasMore,
    loading,
    loadGames,
  };
};
