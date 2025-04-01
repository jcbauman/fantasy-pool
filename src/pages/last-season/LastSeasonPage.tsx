import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { RunningAverageGraph } from "./components/RunningAverageGraph";
import { useAppContext } from "../../context/AppContext";
import { getGamesForPlayerAfterDate } from "../../backend/getters";
import { Game } from "../../types";

export const LastSeasonPage: FC = () => {
  const {
    players,
    authState: { player },
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>(
    player?.id
  );
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  useEffect(() => {
    const fetchPlayerData = async (id: string) => {
      setLoading(true);
      const thisPlayerGames = await getGamesForPlayerAfterDate(id);
      setPlayerGames(thisPlayerGames || []);
      setLoading(false);
    };
    if (selectedPlayerId) {
      fetchPlayerData(selectedPlayerId);
    }
  }, [selectedPlayerId]);
  return (
    <PageContainer loading={loading}>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Select
          placeholder="Select a player"
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          {players.map((player) => (
            <MenuItem value={player.id}>{player.name}</MenuItem>
          ))}
        </Select>
        <Typography align="center" variant="h6">
          Average over time
        </Typography>
        {selectedPlayerId && (
          <RunningAverageGraph
            playerId={selectedPlayerId}
            playerGames={playerGames}
          />
        )}
      </Stack>
    </PageContainer>
  );
};
