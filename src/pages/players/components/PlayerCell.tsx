import { FC } from "react";
import { Player } from "../../../types";
import { Stack, Typography } from "@mui/material";
import { getPlayerNameAbbreviation } from "../utils/playerUtils";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { useNavigate } from "react-router-dom";
import { PlayerAvatar } from "../../../shared-components/PlayerAvatar";

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
      <PlayerAvatar
        sx={{
          width: 25,
          height: 25,
        }}
        player={player}
      />
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
