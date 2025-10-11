import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { normalizeStat } from "../../../utils/statsUtils";
import { getPlayerNameAbbreviation } from "../../players/utils/playerUtils";
import { getPastSeasonHistoricalRecord } from "../../../backend/endpoints/records";
import { getSeasonStart, getThreeMonthsAgo } from "../../../utils/dateUtils";
import { SeasonRecords } from "../../../types";

import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";

export const RankingTable: FC = () => {
  const { records, players, authState } = useAppContext();
  const [twoSeasonsAgoRecords, setRecords] = useState<
    SeasonRecords | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLastSeasonRecords = async (): Promise<void> => {
      if (authState.user?.leagueId) {
        setLoading(true);
        const res = await getPastSeasonHistoricalRecord(
          getSeasonStart(getThreeMonthsAgo())
        );
        if (res) {
          setRecords(res);
        } else {
          setRecords(undefined);
        }
      }
      setLoading(false);
    };
    getLastSeasonRecords();
  }, [authState.user?.leagueId]);

  if (!records || !players) return <></>;
  const sortedPlayers = [...players].sort((a, b) => {
    const aRecord = records[a.id];
    const bRecord = records[b.id];
    return (bRecord?.fantasyScore || 0) - (aRecord?.fantasyScore || 0);
  });
  const filteredPlayers = sortedPlayers.filter(
    (p) =>
      records[p.id]?.fantasyScore !== undefined &&
      records[p.id]?.fantasyScore !== 0
  );
  return (
    <Card sx={{ flexShrink: 0, py: 2 }}>
      <Typography sx={{ mb: 1, ml: 2 }}>League Players</Typography>
      <TableContainer style={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Rank</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Score</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Change</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player, rank) => {
              return (
                <TableRow key={player.id}>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography>{rank + 1}</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 120,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      display: "block",
                    }}
                  >
                    <Typography noWrap>
                      {getPlayerNameAbbreviation(player)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography>
                      {normalizeStat(records[player.id]?.fantasyScore ?? 0)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      getDeltaIcon(
                        rank + 1,
                        twoSeasonsAgoRecords?.[player.id]?.rank
                      )
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

const getDeltaIcon = (rank: number, previousRank: number | undefined) => {
  if (!previousRank) {
    return <ArrowUpwardOutlinedIcon htmlColor="yellow" />;
  } else if (rank < previousRank) {
    return <ArrowUpwardOutlinedIcon htmlColor="green" />;
  } else if (rank > previousRank)
    return <ArrowDownwardOutlinedIcon htmlColor="red" />;
};
