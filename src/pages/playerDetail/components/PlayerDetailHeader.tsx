import { FC } from "react";
import { Game, Player } from "../../../types";
import { Avatar, Card, Stack, Typography } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { StatOverview } from "../../playersList/components/StatOverview";
import { LAST_SEASON_TOP_THREE_PLAYER_IDS } from "../../../backend/fixtures";
import { getMedal, toOrdinal } from "../../statsWrapped/wrappedUtils";

export const PlayerDetailHeader: FC<{
  player: Player;
  playerGames: Game[];
}> = ({ player, playerGames }) => {
  const playerPlacedLastSeason = LAST_SEASON_TOP_THREE_PLAYER_IDS.indexOf(
    player.id
  );
  return (
    <Card
      data-testid="player-detail-header"
      sx={{ height: "auto", flexShrink: 0 }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ width: "100%", p: 1, alignItems: "center" }}
      >
        <Avatar
          src={player.profilePictureUrl}
          sx={{ width: 100, height: 100 }}
          alt={player.name}
        />
        <Stack direction="column" sx={{ p: 1 }}>
          <Typography variant="overline" fontWeight={500} fontSize={16}>
            {player.name}
          </Typography>
          <Typography variant="overline">
            Nickname: "{player.nickname ?? "None"}"
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
          {player.defaultLocation && (
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
              <Typography variant="overline" noWrap>
                Default location:
              </Typography>
              <Typography variant="caption" noWrap>
                {player.defaultLocation}
              </Typography>
            </Stack>
          )}
          {playerPlacedLastSeason !== -1 && (
            <Typography variant="overline">
              Last season: {getMedal(playerPlacedLastSeason)}
              {toOrdinal(playerPlacedLastSeason)} place
            </Typography>
          )}
        </Stack>
      </Stack>
      <StatOverview player={player} playerGames={playerGames} />
    </Card>
  );
};
