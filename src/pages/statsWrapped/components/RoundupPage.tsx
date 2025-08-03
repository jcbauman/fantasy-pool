import {
  Badge,
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Game, Player } from "../../../types";
import { useAppContext } from "../../../context/AppContext";
import { getLocationLeader, getMedal, toOrdinal } from "../wrappedUtils";
import { PlayerCell } from "../../playersList/components/PlayerCell";
import { normalizeStat } from "../../../utils/statsUtils";
import styled from "@emotion/styled";
import { PlayerAvatar } from "../../../shared-components/PlayerAvatar";

export const RoundupPage: FC<{ player: Player; playerGames: Game[] }> = ({
  player,
  playerGames,
}) => {
  const { rankings, allStatsByPlayers, players, scoringMatrix } =
    useAppContext();
  const mainRank = rankings["fantasyScore"].indexOf(player.id);
  const medal = getMedal(mainRank);
  const playerName = player.firstName;
  const leaderboard = [
    players.find((p) => p.id === rankings["fantasyScore"][0]) ?? player,
    players.find((p) => p.id === rankings["fantasyScore"][1]) ?? player,
    players.find((p) => p.id === rankings["fantasyScore"][2]) ?? player,
  ];
  const locationLeader = getLocationLeader(
    playerGames,
    player.id,
    scoringMatrix
  );
  return (
    <Stack direction="column" sx={{ height: "100%" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", p: 2 }}>
        <Stack direction="column" sx={{ alignItems: "flex-start" }}>
          <LargeBadge
            badgeContent={medal}
            sx={{ fontSize: "60px" }}
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <PlayerAvatar
              player={player}
              sx={{ width: "100px", height: "100px" }}
            />
          </LargeBadge>
          <Typography variant="h2" fontWeight="bold">
            {toOrdinal(mainRank)}
          </Typography>
          <Typography variant="overline">Place champion</Typography>
        </Stack>
        <Stack
          direction="column"
          sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <Typography variant="overline">2024 Fantasy Pool Season</Typography>
          <Stack direction="column" sx={{ alignItems: "flex-end" }}>
            <Typography variant="h3" noWrap>
              {player.nickname ?? playerName}
            </Typography>
            <Typography
              variant="overline"
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {player.firstName + " " + player.lastName}
            </Typography>
          </Stack>
          <div />
        </Stack>
      </Stack>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              opacity: 1,
            }}
          >
            <Typography variant="h3" sx={{ mr: 2 }}>
              {normalizeStat(allStatsByPlayers[player.id].fantasyScore)}
            </Typography>
            <Typography variant="overline">Total fantasy points</Typography>
          </Stack>
        </Card>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack direction="column" sx={{ alignItems: "center" }}>
            <Typography variant="h4">
              {allStatsByPlayers[player.id].totalGames}
            </Typography>
            <Typography variant="overline">Games played</Typography>
          </Stack>
          <Stack direction="column" sx={{ alignItems: "center" }}>
            <Typography variant="h4">
              {allStatsByPlayers[player.id].totalWins}
            </Typography>
            <Typography variant="overline">Wins</Typography>
          </Stack>
          <Stack direction="column" sx={{ alignItems: "center" }}>
            <Typography variant="h4">
              {normalizeStat(
                allStatsByPlayers[player.id].fantasyScore /
                  allStatsByPlayers[player.id].totalGames
              )}
            </Typography>
            <Typography variant="overline">Fsy. Average</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <Stack direction="row" sx={{ alignItems: "center", p: 2 }}>
        <Typography variant="overline" sx={{ mr: 2, mt: 0.5 }}>
          Score leader at:
        </Typography>
        <Typography variant="h5" noWrap>
          <i>{locationLeader.name}</i>
        </Typography>
      </Stack>
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="overline">League champions</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: "right" }}>
              <Typography variant="overline">Fantasy score</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((p, idx) => (
            <TableRow>
              <TableCell>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Typography sx={{ mr: 1 }} variant="h5">
                    {getMedal(idx, true)}
                  </Typography>
                  <PlayerCell player={p} hideOut />
                </Stack>
              </TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                {normalizeStat(allStatsByPlayers[p.id].fantasyScore)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

const LargeBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: 60,
    height: 60,
    borderRadius: "50%",
    fontSize: 50,
    top: 25,
    backgroundColor: "transparent",
  },
}));
