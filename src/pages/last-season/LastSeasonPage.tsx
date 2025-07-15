import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { RunningAverageGraph } from "./components/RunningAverageGraph";
import { useAppContext } from "../../context/AppContext";
import {
  getAllGamesForLastSeason,
  getGamesForPlayerAfterDate,
  getPlayerGamesForLastSeason,
} from "../../backend/getters";
import { Game } from "../../types";
import { RankingTable } from "./components/RankingTable";
import { YourPosition } from "./components/YourPosition";

export const LastSeasonPage: FC = () => {
  const {
    players,
    records,
    authState: { player },
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>(
    player?.id
  );
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  // useEffect(() => {
  //   const fetchPlayerData = async (id: string) => {
  //     setLoading(true);
  //     const thisPlayerGames = await getPlayerGamesForLastSeason(id);
  //     setPlayerGames(thisPlayerGames || []);
  //     setLoading(false);
  //   };
  //   if (selectedPlayerId) {
  //     fetchPlayerData(selectedPlayerId);
  //   }
  // }, [selectedPlayerId]);
  const alphabeticalPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <PageContainer loading={loading}>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <YourPosition />
        <RankingTable />
        {/* <Select
          placeholder="Select a player"
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          {alphabeticalPlayers.map((player) => (
            <MenuItem key={player.id} value={player.id}>
              {player.name}
            </MenuItem>
          ))}
        </Select>
        <Typography align="center" variant="h6">
          Average over time
        </Typography> */}
        {/* {selectedPlayerId && (
          <RunningAverageGraph
            playerId={selectedPlayerId}
            playerGames={playerGames}
          />
        )} */}
      </Stack>
    </PageContainer>
  );
};
