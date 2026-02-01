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
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";

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
          typographyProps={{ variant: "h2" }}
        />
        <Stack direction="column" sx={{ p: 1, width: "100%" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="overline" fontWeight={500} fontSize={16}>
              {location.name}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                setOpenEditLocationDrawer(true);
                fireAnalyticsEvent("LocationDetail_Clicked_Edit");
              }}
            >
              <EditIcon />
            </IconButton>
          </Stack>
          {locationString.trim().length && (
            <Typography variant="overline">{locationString}</Typography>
          )}
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
