import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import { Player } from "../../types";
import { PlayerCell } from "./components/PlayerCell";
import { getStatsForPlayerGames } from "./utils/playerUtils";
import { normalizePercentage } from "../../utils/statsUtils";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

enum OrderByFields {
  Name = "Name",
  Wins = "Wins",
  Games = "Games",
  WinPercentage = "Win %",
}
export const PlayersPage: FC = () => {
  const { players } = useAppContext();

  const alphabeticalPlayers = useMemo(
    () => players.sort((a, b) => a.name.localeCompare(b.name)),
    [players]
  );
  return (
    <PageContainer>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline" noWrap>
                  {OrderByFields.Name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  {OrderByFields.Wins}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  {OrderByFields.Games}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  {OrderByFields.WinPercentage}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alphabeticalPlayers.map((player) => (
              <PlayerRow key={player.id} player={player} />
            ))}
          </TableBody>
        </Table>
      </Stack>
    </PageContainer>
  );
};

const PlayerRow: FC<{ player: Player }> = ({ player }) => {
  const { games } = useAppContext();
  const navigate = useNavigate();
  const stats = getStatsForPlayerGames(player.id, games);
  const winPercentage = normalizePercentage(stats.totalWins / stats.totalGames);
  const handleRowClick = (): void => {
    navigate("/players/" + player.id);
  };
  return (
    <TableRow onClick={handleRowClick}>
      <TableCell>
        <PlayerCell player={player} />
      </TableCell>
      <TableCell>{stats.totalWins}</TableCell>
      <TableCell>{stats.totalGames}</TableCell>
      <TableCell>{winPercentage}</TableCell>
    </TableRow>
  );
};
