import { FC } from "react";
import { PoolHallLocation } from "../../../types";
import { Avatar, Stack, Typography } from "@mui/material";
import { getAbbreviation } from "../../../utils/statsUtils";
import { useNavigate } from "react-router-dom";

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
      <Avatar
        src={location.image}
        sx={{
          width: 25,
          height: 25,
        }}
        alt={location.name}
      >
        <Typography variant="caption">
          {getAbbreviation(location?.name)}
        </Typography>
      </Avatar>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {location.name}
        </Typography>
      </Stack>
    </Stack>
  );
};
