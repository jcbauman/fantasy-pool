import { FC } from "react";
import { Game } from "../../../types";
import { Divider, Stack, Typography } from "@mui/material";
import { useAppContext } from "../../../context/AppContext";
import { getLocationLeader, getNumberOfDates } from "../hooks/utils";
import { getPlayerNameAbbreviation } from "../../players/utils/playerUtils";

export const LocationStatOverview: FC<{
  games: Game[];
}> = ({ games }) => {
  const { scoringMatrix, players } = useAppContext();
  const leaderId = getLocationLeader(games, scoringMatrix);
  const leader = players.find((p) => p.id === leaderId);
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
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Sessions
        </Typography>
        <Typography variant="body1">{getNumberOfDates(games)}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <Stack direction="column" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" color="textSecondary" noWrap>
          Current Leader
        </Typography>
        <Typography variant="body1">
          <i>{leader ? getPlayerNameAbbreviation(leader) : "None"}</i>
        </Typography>
      </Stack>
      <Divider orientation="vertical" />
    </Stack>
  );
};
