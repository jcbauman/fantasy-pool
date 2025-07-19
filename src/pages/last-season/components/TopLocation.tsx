import { FC } from "react";
import { Game, Player } from "../../../types";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useAppContext } from "../../../context/AppContext";
import { getBestAndWorstLocation } from "../hooks/utils";
import { normalizeStat } from "../../../utils/statsUtils";

export const TopLocation: FC<{ games: Game[]; player: Player | undefined }> = ({
  games,
  player,
}) => {
  const { scoringMatrix } = useAppContext();
  const locationCalculations = getBestAndWorstLocation(
    games,
    player?.id,
    scoringMatrix
  );
  return (
    <Card sx={{ flexShrink: 0, p: 2 }}>
      <Typography sx={{ mb: 1 }}>Performance By Location</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Typography variant="overline">Location</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Total PTS</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="caption">Best</Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap>
                  <i>{locationCalculations.best.name}</i>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {normalizeStat(locationCalculations.best.totalPoints)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="caption">Worst</Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap>
                  <i>{locationCalculations.worst.name}</i>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {normalizeStat(locationCalculations.worst.totalPoints)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="caption">Total</Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap># of Locations</Typography>
              </TableCell>
              <TableCell>
                <Typography>{locationCalculations.locationsCount}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
