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
import { StatAbbreviations } from "../../utils/constants";
import {
  getFantasyMultiplierForStat,
  getStringFromStatKey,
} from "../../utils/statsUtils";
import { useAppContext } from "../../context/AppContext";
import { GameStatKeys } from "../../types";

export const LeagueInfoPage: FC = () => {
  const { scoringMatrix, league } = useAppContext();

  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1, mb: 2 }}
        spacing={2}
        flexShrink={0}
      >
        <Card sx={{ p: 2, overflow: "visible" }}>
          <Typography variant="overline">League Manager's Note</Typography>
          <Typography variant="body2">
            {league?.leagueManagerMessage &&
            league?.leagueManagerMessage.length > 0
              ? league?.leagueManagerMessage
              : "There has not been an LM Note posted."}
          </Typography>
        </Card>

        <Card sx={{ p: 2, overflow: "visible" }}>
          <Typography variant="overline">Abbreviations Glossary</Typography>
          {Object.keys(StatAbbreviations).map((key) => {
            return (
              <Typography key={key} variant="body2">
                <strong>{key}</strong>: {StatAbbreviations[key]}
              </Typography>
            );
          })}
        </Card>
        <Card sx={{ p: 2, overflow: "visible" }}>
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
                {Object.keys(GameStatKeys).map((key) => {
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
                      <TableCell>{getStringFromStatKey(key)}</TableCell>
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
        <Card sx={{ p: 2, overflow: "visible" }}>
          <Typography variant="overline">Format and Timeline</Typography>
          <Typography variant="body2">
            The league is set to standard 8-ball bar pool format. Regular
            seasons will last three months.
          </Typography>
        </Card>
        <Card sx={{ p: 2, overflow: "visible", mb: 2 }}>
          <Typography variant="overline">Credits</Typography>
          <Typography variant="body2">
            Fantasy Pool - © 2025 Rocko Bauman, all rights reserved
          </Typography>
        </Card>
      </Stack>
    </PageContainer>
  );
};
