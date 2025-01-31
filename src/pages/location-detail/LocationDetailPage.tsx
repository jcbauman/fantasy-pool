import { Button, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";
import { usePlayerParams } from "../../shared-components/hooks/usePlayerParam";
import { PlayerDetailHeader } from "../playerDetail/components/PlayerDetailHeader";
import { GameLog } from "../playerDetail/components/GameLog";
import { PageContainer } from "../../shared-components/PageContainer";
import { PlayerSeasonStats } from "../playerDetail/components/PlayerSeasonStats";
import { useLocationParams } from "../../shared-components/hooks/useLocationParams";
import { LocationGameLog } from "./components/LocationGameLog";
import { LocationDetailHeader } from "./components/LocationDetailHeader";

export const LocationDetailPage: FC = () => {
  const { location, loading, locationGames } = useLocationParams();

  if (!location) {
    return (
      <PageContainer loading={loading}>
        <Stack
          direction="column"
          sx={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="overline">Location not found</Typography>
          <Button variant="contained" to="/" component={Link}>
            Back to home
          </Button>
        </Stack>
      </PageContainer>
    );
  }
  return (
    <PageContainer loading={loading}>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <LocationDetailHeader location={location} games={locationGames} />
        <Stack sx={{ p: 1, pt: 2 }} spacing={2}>
          {/* <PlayerSeasonStats player={player} games={playerGames} /> */}
          <LocationGameLog games={locationGames} />
        </Stack>
      </Stack>
    </PageContainer>
  );
};
