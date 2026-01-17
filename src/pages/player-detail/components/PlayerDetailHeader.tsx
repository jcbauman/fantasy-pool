import { FC } from "react";
import { Game, Player } from "../../../types";
import { Card, Stack, Typography } from "@mui/material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { StatOverview } from "../../players/components/StatOverview";
import { getMedal, toOrdinal } from "../../stats-wrapped/wrappedUtils";
import { useAppContext } from "../../../context/AppContext";
import { PlayerAvatar } from "../../../shared-components/PlayerAvatar";

export const PlayerDetailHeader: FC<{
  player: Player;
  playerGames: Game[];
}> = ({ player, playerGames }) => {
  const { records } = useAppContext();
  const playerRankLastSeason = records ? records[player.id]?.rank : 0;
  const playerPlacedLastSeason = playerRankLastSeason
    ? playerRankLastSeason < 4
    : false;
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
        <PlayerAvatar
          player={player}
          sx={{ width: 100, height: 100 }}
          typographyProps={{ variant: "h4" }}
        />
        <Stack direction="column" sx={{ p: 1 }}>
          <Typography variant="overline" fontWeight={500} fontSize={16}>
            {player.firstName + " " + player.lastName}
          </Typography>
          <Typography variant="overline">
            Nickname: "{player.nickname ?? "None"}"
          </Typography>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Typography variant="overline">
              Status: {player.out ? "Out" : "Active"}
            </Typography>
            <CircleOutlinedIcon
              color={player.out ? "error" : "success"}
              sx={{ width: 12, height: 12, ml: 0.5, mb: 0.1 }}
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
          {playerPlacedLastSeason && (
            <Typography variant="overline">
              Last season: {getMedal(playerRankLastSeason)}
              {toOrdinal(playerRankLastSeason)} place
            </Typography>
          )}
        </Stack>
      </Stack>
      <StatOverview player={player} playerGames={playerGames} />
    </Card>
  );
};
