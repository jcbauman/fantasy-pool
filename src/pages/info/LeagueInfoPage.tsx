import {
  Card,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { GameStatKeys } from "../../types";
import { StatAbbreviations } from "../../utils/constants";
import { getFantasyMultiplierForStat } from "../../utils/statsUtils";
import { useAppContext } from "../../context/AppContext";

export const LeagueInfoPage: FC = () => {
  const { scoringMatrix } = useAppContext();
  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Card sx={{ p: 2 }}>
          <Typography variant="overline">League Manager's Note</Typography>
          <Typography variant="body2">
            There has not been an LM Note posted.
          </Typography>
        </Card>
        <Card sx={{ p: 2 }}>
          <Typography variant="overline">Abbreviations Glossary</Typography>
          {Object.keys(StatAbbreviations).map((key) => {
            return (
              <Typography key={key} variant="body2">
                <strong>{key}</strong>: {StatAbbreviations[key]}
              </Typography>
            );
          })}
        </Card>
        <Card sx={{ p: 2 }}>
          <Typography variant="overline">Fantasy Scoring</Typography>
          <Typography variant="body2">
            League fantasy points scoring is defined by your league manager.
          </Typography>
          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", width: "100%" }}
          >
            <Table size="small" sx={{ borderColor: "white" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      Event
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline" noWrap>
                      Points
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(StatAbbreviations).map((key) => {
                  const points = getFantasyMultiplierForStat(
                    key,
                    scoringMatrix
                  );
                  return (
                    <TableRow
                      key={`${key}-scoring-row`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        borderColor: "white",
                      }}
                    >
                      <TableCell>{`${StatAbbreviations[key]} (${key})`}</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography
                          variant="body2"
                          color={points >= 0 ? "primary" : "error"}
                        >
                          <strong>{points}</strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>
    </PageContainer>
  );
};
