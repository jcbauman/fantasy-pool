import { FC } from "react";
import { Game, Player } from "../../../types";
import { Card, Stack, Typography } from "@mui/material";
import { normalizePercentage } from "../../../utils/statsUtils";
import { getPlayerSynergyStats } from "../../playersList/utils/playerUtils";
import { useAppContext } from "../../../context/AppContext";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";

export const PlayerSynergy: FC<{ player: Player; games: Game[] }> = ({
  player,
  games,
}) => {
  const {
    authState: { player: currentPlayer },
  } = useAppContext();
  const synergy = getPlayerSynergyStats(games, currentPlayer?.id, player.id);
  return (
    <Card elevation={10}>
      <Stack direction="column">
        <Stack direction="column" sx={{ p: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }} gap={1}>
            <ConnectWithoutContactOutlinedIcon sx={{ width: 20, height: 20 }} />
            <Typography>Your Synergy</Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          sx={{
            pb: 2,
            px: 1,
            justifyContent: "center",
          }}
        >
          {synergy.totalGames === 0 ? (
            <Typography align="center" variant="caption">
              Log more 2-player games with {player.name} to see your synergy.
            </Typography>
          ) : (
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                px: 2,
              }}
            >
              <Stack direction="column" sx={{ alignItems: "center" }}>
                <Typography variant="overline" color="textSecondary" noWrap>
                  Together
                </Typography>
                <Typography variant="body1">{synergy.totalGames}</Typography>
                <Typography variant="caption" color="textSecondary" noWrap>
                  games played
                </Typography>
              </Stack>
              <Stack direction="column" sx={{ alignItems: "center" }}>
                <Typography variant="overline" color="textSecondary" noWrap>
                  Games
                </Typography>
                <Typography variant="body1">
                  {synergy.versusGameCount}/{synergy.partnersGameCount}
                </Typography>
                <Typography variant="caption" color="textSecondary" noWrap>
                  vs/partners
                </Typography>
              </Stack>
              <Stack direction="column" sx={{ alignItems: "center" }}>
                <Typography variant="overline" color="textSecondary" noWrap>
                  You win
                </Typography>
                <Typography variant="body1">
                  {synergy.versusGameCount > 0
                    ? normalizePercentage(
                        synergy.versusGameWins / synergy.versusGameCount
                      )
                    : "-"}
                </Typography>
                <Typography variant="caption" color="textSecondary" noWrap>
                  <i>versus</i>
                </Typography>
              </Stack>
              <Stack direction="column" sx={{ alignItems: "center" }}>
                <Typography variant="overline" color="textSecondary" noWrap>
                  You win
                </Typography>
                <Typography variant="body1">
                  {synergy.partnersGameCount > 0
                    ? normalizePercentage(
                        synergy.partnersGameWins / synergy.partnersGameCount
                      )
                    : "-"}
                </Typography>
                <Typography variant="caption" color="textSecondary" noWrap>
                  <i> as partners</i>
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
