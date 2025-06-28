import { FC, useState } from "react";
import { Game, Player } from "../../../types";
import {
  Card,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { getPlayerTrends } from "../../playersList/utils/playerUtils";
import { useAppContext } from "../../../context/AppContext";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import {
  getFantasyScoreForPlayerSeason,
  normalizeStat,
} from "../../../utils/statsUtils";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";

export const PlayerTrends: FC<{ player: Player; games: Game[] }> = ({
  player,
  games,
}) => {
  const [trendType, setTrendType] = useState(0);
  const { scoringMatrix } = useAppContext();
  const trends = getPlayerTrends(games, player.id, scoringMatrix);
  const fantasyScore = getFantasyScoreForPlayerSeason(
    games,
    player?.id,
    scoringMatrix
  );
  const fullSeasonFantasyAverage = fantasyScore / (games.length || 1);

  if (trends[2].gamesCount === 0) return <></>;
  return (
    <Card elevation={5}>
      <Stack direction="column">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            p: 2,
            pb: 1,
            justifyContent: "space-between",
          }}
          gap={1}
        >
          <Stack direction="row" sx={{ alignItems: "center" }} gap={1}>
            <EventAvailableOutlinedIcon sx={{ width: 20, height: 20 }} />
            <Typography>Trends</Typography>
          </Stack>
          <ToggleButtonGroup
            exclusive
            value={trendType}
            size="small"
            onChange={(_e, newVal) => {
              fireAnalyticsEvent("PlayerDetail_Clicked_TrendTypeChange", {
                newVal,
              });
              setTrendType(newVal);
            }}
          >
            <ToggleButton value={0}>Pts</ToggleButton>
            <ToggleButton value={1}>Avg</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack
          direction="row"
          sx={{
            pb: 2,
            px: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {trends.map((trend) => {
            return (
              <TrendNode
                key={trend.period}
                period={trend.period}
                points={trend.points}
                gamesCount={trend.gamesCount}
                useAvg={trendType === 1}
                fullSeasonAvg={fullSeasonFantasyAverage}
              />
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

const TrendNode: FC<{
  period: string;
  gamesCount: number;
  points: number;
  fullSeasonAvg: number;
  useAvg?: boolean;
}> = ({ period, gamesCount, points, fullSeasonAvg, useAvg }) => {
  const value = useAvg ? points / (gamesCount || 1) : points;
  const avgImproving = value - fullSeasonAvg;
  return (
    <Stack direction="column" sx={{ alignItems: "center" }}>
      <Typography variant="overline" color="textSecondary" noWrap>
        {period}
      </Typography>
      <Typography variant="body1">
        {gamesCount > 0
          ? `${value > 0 && !useAvg ? "+" : ""}${normalizeStat(value)}`
          : "-"}
      </Typography>
      {
        <TrendIcon
          gamesCount={gamesCount}
          points={useAvg ? avgImproving : value}
        />
      }
    </Stack>
  );
};

const TrendIcon: FC<{ gamesCount: number; points: number }> = ({
  gamesCount,
  points,
}) => {
  if (gamesCount > 0) {
    if (points === 0) return <TrendingFlatIcon />;
    return points < 0 ? (
      <TrendingDownIcon htmlColor="red" />
    ) : (
      <TrendingUpIcon htmlColor="green" />
    );
  }
  return <TrendingFlatIcon />;
};
