import {
  Avatar,
  Badge,
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
import { Player } from "../../../types";
import { useAppContext } from "../../../context/AppContext";
import { getMedal, toOrdinal } from "../wrappedUtils";
import { PlayerCell } from "../../playersList/components/PlayerCell";
import { normalizeStat } from "../../../utils/statsUtils";
import styled from "@emotion/styled";

export const RoundupPage: FC<{ player: Player }> = ({ player }) => {
  const { rankings, allStatsByPlayers, players } = useAppContext();
  const mainRank = rankings["fantasyScore"].indexOf(player.id);
  const medal = getMedal(mainRank);
  const playerName = player.name.split(" ")[0];
  const leaderboard = [
    players.find((p) => p.id === rankings["fantasyScore"][0]) ?? player,
    players.find((p) => p.id === rankings["fantasyScore"][1]) ?? player,
    players.find((p) => p.id === rankings["fantasyScore"][2]) ?? player,
    players.find((p) => p.id === rankings["fantasyScore"][3]) ?? player,
  ];
  return (
    <Stack direction="column">
      <Stack direction="row" sx={{ justifyContent: "space-between", p: 2 }}>
        <Stack direction="column" sx={{ alignItems: "flex-start" }}>
          <LargeBadge
            badgeContent={medal}
            sx={{ fontSize: "60px" }}
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Avatar
              src={player.profilePictureUrl}
              alt={player.name}
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
          sx={{ alignItems: "flex-end", justifyContent: "space-around" }}
        >
          <Typography variant="overline">2024 Fantasy Pool Season</Typography>
          <Typography variant="h3" noWrap>
            {player.nickname ?? playerName}
          </Typography>
          <Typography
            variant="overline"
            sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            {player.name}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <Stack>
          <Typography variant="h4">
            {normalizeStat(allStatsByPlayers[player.id].fantasyScore)}
          </Typography>
          <Typography variant="overline">
            Total fantasy points scored
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack>
            <Typography variant="h4">
              {allStatsByPlayers[player.id].totalWins}
            </Typography>
            <Typography variant="overline">Wins</Typography>
          </Stack>
          <Stack>
            <Typography variant="h4">
              {allStatsByPlayers[player.id].totalGames}
            </Typography>
            <Typography variant="overline">Games played</Typography>
          </Stack>
        </Stack>
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
