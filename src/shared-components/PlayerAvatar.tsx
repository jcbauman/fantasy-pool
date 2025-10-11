import { FC } from "react";
import { Player } from "../types";
import { Avatar as MUIAvatar, Typography } from "@mui/material";
import { getAbbreviation } from "../utils/statsUtils";
import {
  getPlayerFullName,
  getPlayerNameAbbreviation,
} from "../pages/players/utils/playerUtils";

export const PlayerAvatar: FC<{
  player?: Player;
  typographyProps?: any;
  sx?: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ player, typographyProps, sx, onClick, ...rest }) => {
  if (!player) return <></>;
  return (
    <MUIAvatar
      alt={getPlayerFullName(player)}
      src={player.profilePictureUrl}
      sx={sx}
      onClick={onClick}
      {...rest}
    >
      <Typography variant="caption" {...typographyProps}>
        {getAbbreviation(getPlayerNameAbbreviation(player))}
      </Typography>
    </MUIAvatar>
  );
};
