import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useMemo } from "react";
import { OrderByFields, Player } from "../../types";
import { PlayerCell } from "./components/PlayerCell";
import { getStatsForPlayerGames } from "./utils/playerUtils";
import { normalizePercentage, normalizeStat } from "../../utils/statsUtils";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setPlayerSortBy } from "../../redux/navSlice";

export const PlayersPage: FC = () => {
  const { players, rankings } = useAppContext();
  const { sortBy } = useSelector((state: RootState) => state.nav);
  const dispatch = useDispatch();

  const alphabeticalPlayers = useMemo(
    () => players.sort((a, b) => a.name.localeCompare(b.name)),
    [players]
  );

  const sortPlayers = (
    players: Player[],
    sortedPlayerIds: string[]
  ): Player[] => {
    return players.sort(
      (a, b) => sortedPlayerIds.indexOf(a.id) - sortedPlayerIds.indexOf(b.id)
    );
  };

  const sortedPlayers = useMemo(() => {
    switch (sortBy) {
      case OrderByFields.FantasyAvg:
        return sortPlayers(
          [...alphabeticalPlayers],
          rankings.fantasyGameAvg ?? []
        );
      case OrderByFields.Games:
        return sortPlayers([...alphabeticalPlayers], rankings.totalGames ?? []);
      case OrderByFields.WinPercentage:
        return sortPlayers(
          [...alphabeticalPlayers],
          rankings.winPercentage ?? []
        );
      case OrderByFields.Name:
      default:
        return alphabeticalPlayers;
    }
  }, [alphabeticalPlayers, rankings, sortBy]);

  const sortByProps = (field: OrderByFields) => {
    return {
      onClick: () => dispatch(setPlayerSortBy(field)),
      cursor: "pointer",
      sx: { textDecoration: sortBy === field ? "underline" : "default" },
    };
  };

  return (
    <PageContainer>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell {...sortByProps(OrderByFields.Name)}>
                <Typography variant="overline" noWrap>
                  {OrderByFields.Name}
                </Typography>
              </TableCell>
              <TableCell {...sortByProps(OrderByFields.Games)}>
                <Typography variant="overline" noWrap>
                  {OrderByFields.Games}
                </Typography>
              </TableCell>
              <TableCell {...sortByProps(OrderByFields.FantasyAvg)}>
                <Typography variant="overline" noWrap>
                  {OrderByFields.FantasyAvg}
                </Typography>
              </TableCell>
              <TableCell {...sortByProps(OrderByFields.WinPercentage)}>
                <Typography variant="overline" noWrap>
                  {OrderByFields.WinPercentage}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player) => {
              return <PlayerRow key={player.id} player={player} />;
            })}
          </TableBody>
        </Table>
      </Stack>
    </PageContainer>
  );
};

const PlayerRow: FC<{ player: Player }> = ({ player }) => {
  const { games, scoringMatrix } = useAppContext();
  const navigate = useNavigate();
  const stats = getStatsForPlayerGames(player.id, games, scoringMatrix);
  const winPercentage = normalizePercentage(stats.totalWins / stats.totalGames);
  const handleRowClick = (): void => {
    navigate("/players/" + player.id);
  };
  return (
    <TableRow onClick={handleRowClick}>
      <TableCell>
        <PlayerCell player={player} />
      </TableCell>
      <TableCell>{stats.totalGames}</TableCell>
      <TableCell>{normalizeStat(stats.fantasyGameAvg)}</TableCell>
      <TableCell>{winPercentage}</TableCell>
    </TableRow>
  );
};
