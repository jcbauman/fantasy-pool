import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Game, PoolHallLocation } from "../../types";
import { fetchLocationById } from "../../backend/endpoints/locations";
import { useAppContext } from "../../context/AppContext";

interface LocationParams extends Record<string, string | undefined> {
  id: string;
}

interface UseLocationParams {
  location: PoolHallLocation | undefined;
  locationGames: Game[];
  loading: boolean;
  refetchLocation: () => Promise<void>;
}

export const useLocationParams = (): UseLocationParams => {
  const [location, setLocation] = useState<PoolHallLocation | undefined>(
    undefined
  );
  const [locationGames, setLocationGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<LocationParams>();
  const { games } = useAppContext();

  const fetchLocationData = useCallback(
    async (locationId: string) => {
      setLoading(true);
      const thisLocation = await fetchLocationById(locationId);
      const thisLocationGames: Game[] = games.filter(
        (g) => g.location === thisLocation?.name
      );
      setLocation(thisLocation);
      setLocationGames(thisLocationGames || []);
      setLoading(false);
    },
    [games]
  );

  useEffect(() => {
    if (id) {
      fetchLocationData(id);
    }
  }, [id, fetchLocationData]);

  const refetchLocation = async () => {
    if (id) {
      await fetchLocationData(id);
    }
  };

  return { location, locationGames, loading, refetchLocation };
};
