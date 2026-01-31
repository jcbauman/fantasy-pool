import { FC } from "react";
import { Game } from "../../../types";
import { Divider, Stack, Typography } from "@mui/material";

export const LocationStatOverview: FC<{
  games: Game[];
}> = ({ games }) => {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", width: "100%" }}
    >
      <Divider />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Season games
        </Typography>
        <Typography variant="body1">{games.length}</Typography>
      </Stack>
      <Divider orientation="vertical" />
    </Stack>
  );
};
