import { FC } from "react";
import { Avatar as MUIAvatar, Typography } from "@mui/material";
import { PoolHallLocation } from "../../../types";
import { getAbbreviation } from "../../../utils/statsUtils";

export const LocationAvatar: FC<{
  location?: PoolHallLocation;
  typographyProps?: any;
  sx?: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ location, typographyProps, sx, onClick, ...rest }) => {
  if (!location) return <></>;
  return (
    <MUIAvatar
      alt={getAbbreviation(location.name)}
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
      {...rest}
    >
      <Typography variant="caption" {...typographyProps}>
        {location.icon ? location.icon : getAbbreviation(location.name)}
      </Typography>
    </MUIAvatar>
  );
};
