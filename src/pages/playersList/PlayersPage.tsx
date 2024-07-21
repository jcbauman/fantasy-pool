import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Player } from "../../types";
import { PlayerCell } from "./components/PlayerCell";
import { getStatsForPlayerGames } from "./utils/playerUtils";
import { normalizePercentage } from "../../utils/statsUtils";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

export const PlayersPage: FC = () => {
  const { players } = useAppContext();
  return (
    <PageContainer>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline" noWrap>
                  Players
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  Wins
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  Games
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" noWrap>
                  Win %
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
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
