import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { mockPlayers } from "../../backend/fixtures";
import { PlayerCell } from "../playersList/components/PlayerCell";
import { PlayerDetailHeader } from "./components/PlayerDetailHeader";
import { PlayerSeasonStats } from "./components/PlayerSeasonStats";
import { PageContainer } from "../../shared-components/PageContainer";

interface PlayerParams extends Record<string, string | undefined> {
  id: string;
}

export const PlayerDetailPage: FC = () => {
  const players = mockPlayers;
  const { id } = useParams<PlayerParams>();
  const player = players.find((p) => p.id === id);
  if (!player) {
    return (
      <Stack
        direction="column"
        sx={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="overline">Player not found</Typography>
      </Stack>
    );
  }
  return (
    <PageContainer>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <PlayerDetailHeader player={player} />
        <Stack sx={{ p: 1 }}>
          <PlayerSeasonStats player={player} />
        </Stack>
      </Stack>
    </PageContainer>
  );
};
