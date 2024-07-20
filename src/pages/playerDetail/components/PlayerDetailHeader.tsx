import { FC } from "react";
import { Player } from "../../../types";
import { Avatar, Card, Stack, Typography } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

export const PlayerDetailHeader: FC<{ player: Player }> = ({ player }) => {
  return (
    <Card>
      <Stack direction="row" spacing={2} sx={{ width: "100%", p: 2 }}>
        <Avatar
          src={player.profilePictureUrl}
          sx={{ width: 100, height: 100 }}
          alt={player.name}
        />
        <Stack direction="column" sx={{ p: 2 }}>
          <Typography variant="overline" fontWeight={500} fontSize={16}>
            {player.name}
          </Typography>
          <Typography variant="overline">
            Nickname: {player.nickname ?? "None"}
          </Typography>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Typography variant="overline">
              Status: {player.out ? "Out" : "Healthy"}
            </Typography>
            <CircleOutlinedIcon
              color={player.out ? "error" : "success"}
              sx={{ width: 12, height: 12, ml: 0.5 }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
