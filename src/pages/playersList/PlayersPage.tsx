import {
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useMemo } from "react";
import { Player } from "../../types";
import { PlayerCell } from "./components/PlayerCell";
import {
  getPlayerFullName,
  getStatsForPlayerGames,
  StatsForPlayerGames,
} from "./utils/playerUtils";
import { normalizePercentage, normalizeStat } from "../../utils/statsUtils";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setPlayerSortBy } from "../../redux/navSlice";
import { setHideInactivePlayers } from "../../redux/settingsSlice";

const SortableStatsOrder = [
  { label: "Name", value: "name" },
  { label: "Avg", value: "fantasyGameAvg" },
  { label: "Win %", value: "winPercentage" },
  { label: "Games", value: "totalGames" },
  { label: "Wins", value: "totalWins" },
  { label: "SS", value: "skillShots" },
  { label: "3PR", value: "threeBallsPocketedInRow" },
  { label: "4PR", value: "fourBallsPocketedInRow" },
  { label: "5PR", value: "fiveBallsPocketedInRow" },
  { label: "6PR", value: "sixBallsPocketedInRow" },
  { label: "7PR", value: "sevenBallsPocketedInRow" },
  { label: "8PR", value: "runTheTable" },
  { label: "SCR", value: "scratches" },
];

export const PlayersPage: FC = () => {
  const { players, rankings } = useAppContext();
  const { sortBy } = useSelector((state: RootState) => state.nav);
  const { hideInactivePlayers } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch = useDispatch();

  const alphabeticalPlayers = useMemo(
    () =>
      players.sort((a, b) =>
        getPlayerFullName(a).localeCompare(getPlayerFullName(b))
      ),
    [players]
  );

  const isKeyOfRankings = (
    key: string,
    obj: Record<string, string[]>
  ): key is keyof Record<string, string[]> => {
    return key in obj;
  };

  const sortPlayers = (
    players: Player[],
    sortedPlayerIds: string[]
  ): Player[] => {
    return players.sort(
      (a, b) => sortedPlayerIds.indexOf(a.id) - sortedPlayerIds.indexOf(b.id)
    );
  };

  const sortedPlayers = useMemo(() => {
    if (sortBy === "name") {
      return alphabeticalPlayers;
    } else if (isKeyOfRankings(sortBy, rankings)) {
      return sortPlayers([...alphabeticalPlayers], rankings[sortBy] ?? []);
    } else {
      return alphabeticalPlayers;
    }
  }, [alphabeticalPlayers, rankings, sortBy]);

  const sortByProps = (field: string) => {
    return {
      onClick: () => dispatch(setPlayerSortBy(field)),
      cursor: "pointer",
      sx: {
        cursor: "pointer",
        textAlign: field === "name" ? "left" : "center",
        textDecoration: sortBy === field ? "underline" : "default",
      },
    };
  };

  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", overflowX: "auto" }}
      >
        <Table sx={{ width: "100%" }} stickyHeader>
          <TableHead>
            <TableRow>
              {SortableStatsOrder.map((f) => {
                return (
                  <TableCell
                    style={
                      f.value === "name"
                        ? {
                            position: "sticky",
                            left: 0,
                            zIndex: 10,
                            backgroundColor: "#303030",
                          }
                        : { position: "sticky" }
                    }
                    {...sortByProps(f.value)}
                    key={`${f.label}-cell"`}
                  >
                    <Typography variant="overline" noWrap>
                      {f.label}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player) => {
              return (
                <PlayerRow
                  key={player.id}
                  rowKey={player.id}
                  player={player}
                  hideInactivePlayers={hideInactivePlayers}
                />
              );
            })}
          </TableBody>
        </Table>

        <Stack
          direction="row"
          sx={{ pt: 1, pl: 2, mb: 2, alignItems: "center" }}
        >
          <Typography variant="caption">
            {hideInactivePlayers
              ? "Inactive players hidden"
              : "Showing all players"}
          </Typography>
          <Link
            color="secondary"
            sx={{
              ml: 1,
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() =>
              dispatch(setHideInactivePlayers(!hideInactivePlayers))
            }
          >
            <Typography variant="caption">
              {hideInactivePlayers ? "Show all" : "Hide inactive"}
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </PageContainer>
  );
};

const PlayerRow: FC<{
  player: Player;
  rowKey: string;
  hideInactivePlayers: boolean;
}> = ({ player, rowKey, hideInactivePlayers }) => {
  const { games, scoringMatrix } = useAppContext();
  const navigate = useNavigate();
  const stats = getStatsForPlayerGames(player.id, games, scoringMatrix);
  const winPercentage = normalizePercentage(stats.totalWins / stats.totalGames);
  const handleRowClick = (): void => {
    navigate("/players/" + player.id);
  };

  const isKeyOfStats = (
    key: string,
    obj: StatsForPlayerGames
  ): key is keyof StatsForPlayerGames => {
    return key in obj;
  };
  if (hideInactivePlayers && stats.totalGames === 0) return null;

  return (
    <TableRow onClick={handleRowClick} key={rowKey}>
      {SortableStatsOrder.map((f) => {
        if (f.value === "name")
          return (
            <TableCell
              style={{
                position: "sticky",
                left: 0,
                zIndex: 1,
                backgroundColor: "#303030",
              }}
            >
              <PlayerCell player={player} />
            </TableCell>
          );
        else if (f.value === "winPercentage")
          return (
            <TableCell sx={{ textAlign: "center" }}>{winPercentage}</TableCell>
          );
        else if (f.value === "fantasyGameAvg")
          return (
            <TableCell sx={{ textAlign: "center" }}>
              {normalizeStat(stats.fantasyGameAvg)}
            </TableCell>
          );
        else
          return (
            <TableCell sx={{ textAlign: "center" }}>
              {isKeyOfStats(f.value, stats) ? stats[f.value] : "yee"}
            </TableCell>
          );
      })}
    </TableRow>
  );
};
