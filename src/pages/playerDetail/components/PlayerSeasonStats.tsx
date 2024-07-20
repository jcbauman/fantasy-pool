import { FC } from "react";
import { Player } from "../../../types";
import { Card, Stack, Typography } from "@mui/material";

export const PlayerSeasonStats: FC<{ player: Player }> = ({ player }) => {
  return (
    <Card>
      <Stack direction="column" sx={{ p: 2 }}>
        <Typography>Season Stats</Typography>
      </Stack>
    </Card>
  );
};
