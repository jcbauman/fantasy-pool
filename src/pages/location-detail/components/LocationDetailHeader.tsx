import { FC, useState } from "react";
import { Game, PoolHallLocation } from "../../../types";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import { LocationStatOverview } from "./LocationStatOverview";
import { LocationAvatar } from "./LocationAvatar";
import EditIcon from "@mui/icons-material/Edit";
import { EditLocationDrawer } from "./EditLocationDrawer";
import { updateLocation } from "../../../backend/endpoints/locations";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../../shared-components/toasts/notificationToasts";

export const LocationDetailHeader: FC<{
  location: PoolHallLocation;
  games: Game[];
  onRefetchLocation?: () => Promise<void>;
}> = ({ location, games, onRefetchLocation }) => {
  const [openEditLocationDrawer, setOpenEditLocationDrawer] = useState(false);
  const locationString =
    location?.city?.length && location?.state?.length
      ? `${location.city ?? "-"}, ${location.state ?? "-"}`
      : `${location.city ?? "-"}${location.state ?? "-"}`;
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
        <LocationAvatar
          location={location}
          sx={{ width: 100, height: 100 }}
          typographyProps={{ variant: "h4" }}
        />
        <Stack direction="column" sx={{ p: 1 }}>
          <Typography variant="overline" fontWeight={500} fontSize={16}>
            {location.name}
          </Typography>
          {locationString.trim().length && (
            <Typography variant="overline">{locationString}</Typography>
          )}
          <IconButton
            onClick={() => {
              setOpenEditLocationDrawer(true);
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      </Stack>
      <LocationStatOverview games={games} />
      <EditLocationDrawer
        open={openEditLocationDrawer}
        onClose={() => setOpenEditLocationDrawer(false)}
        onSave={async (data: PoolHallLocation) => {
          await updateLocation(
            data,
            location.id,
            async () => {
              sendSuccessNotification(
                "Thanks for contributing to this location!"
              );
              await onRefetchLocation?.();
            },
            () =>
              sendErrorNotification(
                "An error occurred, please try updating location later."
              )
          );
        }}
        location={location}
      />
    </Card>
  );
};
