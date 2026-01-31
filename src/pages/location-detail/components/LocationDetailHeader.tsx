import { FC } from "react";
import { Game, PoolHallLocation } from "../../../types";
import { Avatar, Card, Stack, Typography } from "@mui/material";
import { LocationStatOverview } from "./LocationStatOverview";

export const LocationDetailHeader: FC<{
  location: PoolHallLocation;
  games: Game[];
}> = ({ location, games }) => {
  console.log("games");
  return (
    <Card
      data-testid="player-detail-header"
      sx={{ height: "auto", flexShrink: 0 }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ width: "100%", p: 1, alignItems: "center" }}
      >
        <Avatar
          src={location.image}
          sx={{ width: 100, height: 100 }}
          alt={location.name}
        />
        <Stack direction="column" sx={{ p: 1 }}>
          <Typography variant="overline" fontWeight={500} fontSize={16}>
            {location.name}
          </Typography>
          <Typography variant="overline">
            {`${location.city ?? "-"}, ${location.state ?? "-"}`}
          </Typography>
        </Stack>
      </Stack>
      <LocationStatOverview games={games} />
    </Card>
  );
};
