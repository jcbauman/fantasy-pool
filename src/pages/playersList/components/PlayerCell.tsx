import { FC } from "react";
import { Player } from "../../../types";
import { Avatar, Stack, Typography } from "@mui/material";
import { getPlayerNameAbbreviation } from "../utils/playerUtils";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { useNavigate } from "react-router-dom";

export const PlayerCell: FC<{
  player: Player;
  linkToPlayer?: boolean;
  hideOut?: boolean;
}> = ({ player, linkToPlayer, hideOut }) => {
  const displayName = getPlayerNameAbbreviation(player);
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
        if (linkToPlayer) navigate(`/players/${player.id}`);
      }}
    >
      <Avatar
        src={player.profilePictureUrl}
        sx={{
          width: 25,
          height: 25,
        }}
        alt={player.firstName}
      >
        <Typography variant="caption">
          {getPlayerNameAbbreviation(player)}
        </Typography>
      </Avatar>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {displayName}
        </Typography>
        {player.out && !hideOut && (
          <CircleOutlinedIcon
            color="error"
            sx={{ width: 12, height: 12, ml: 1 }}
          />
        )}
      </Stack>
    </Stack>
  );
};
