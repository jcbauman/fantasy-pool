import { Button, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../../shared-components/PageContainer";
import { useLocationParams } from "../../shared-components/hooks/useLocationParams";
import { LocationDetailHeader } from "./components/LocationDetailHeader";
import { LocationGameLog } from "./components/LocationGameLog";
import { PlayerSeasonStats } from "../player-detail/components/PlayerSeasonStats";
import { useAppContext } from "../../context/AppContext";

export const LocationDetailPage: FC = () => {
  const { location, loading, locationGames, refetchLocation } =
    useLocationParams();
  const {
    authState: { player },
  } = useAppContext();

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
        <LocationDetailHeader
          location={location}
          games={locationGames}
          onRefetchLocation={refetchLocation}
        />
        <Stack sx={{ p: 1, pt: 2 }} spacing={2}>
          {player && (
            <PlayerSeasonStats
              player={player}
              games={locationGames}
              title="Your season stats"
            />
          )}
          <LocationGameLog games={locationGames} />
        </Stack>
      </Stack>
    </PageContainer>
  );
};
