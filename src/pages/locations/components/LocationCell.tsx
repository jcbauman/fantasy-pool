import { FC } from "react";
import { PoolHallLocation } from "../../../types";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocationAvatar } from "../../location-detail/components/LocationAvatar";

export const LocationCell: FC<{
  location: PoolHallLocation;
  linkToLocation?: boolean;
}> = ({ location, linkToLocation }) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        "& a": {
          textDecoration: "none",
        },
      }}
      onClick={() => {
        if (linkToLocation) navigate(`/locations/${location.id}`);
      }}
    >
      <LocationAvatar location={location} sx={{ width: 25, height: 25 }} />
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {location.name}
        </Typography>
      </Stack>
    </Stack>
  );
};
