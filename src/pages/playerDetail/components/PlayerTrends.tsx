import { FC } from "react";
import { Game, Player } from "../../../types";
import { Card, Stack, Typography } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import { getPlayerTrends } from "../../playersList/utils/playerUtils";
import { useAppContext } from "../../../context/AppContext";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import {
  getFantasyScoreForPlayerSeason,
  normalizeStat,
} from "../../../utils/statsUtils";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export const PlayerTrends: FC<{ player: Player; games: Game[] }> = ({
  player,
  games,
}) => {
  const { scoringMatrix } = useAppContext();
  const trends = getPlayerTrends(games, player.id, scoringMatrix);
  const fantasyScore = getFantasyScoreForPlayerSeason(
    games,
    player?.id,
    scoringMatrix
  );

  if (trends.fortnight.gamesCount === 0) return <></>;
  return (
    <Card elevation={5}>
      <Stack direction="column">
        <Stack
          direction="row"
          sx={{ alignItems: "center", p: 2, pb: 1 }}
          gap={1}
        >
          <TimelineIcon sx={{ width: 20, height: 20 }} />
          <Typography>Trends</Typography>
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
          <TrendNode
            period="Day"
            points={trends.day.points}
            gamesCount={trends.day.gamesCount}
          />
          <TrendNode
            period="Week"
            points={trends.week.points}
            gamesCount={trends.week.gamesCount}
          />
          <TrendNode
            period="2 Weeks"
            points={trends.fortnight.points}
            gamesCount={trends.fortnight.gamesCount}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

const TrendNode: FC<{ period: string; gamesCount: number; points: number }> = ({
  period,
  gamesCount,
  points,
}) => {
  return (
    <Stack direction="column" sx={{ alignItems: "center" }}>
      <Typography variant="overline" color="textSecondary" noWrap>
        {period}
      </Typography>
      <Typography variant="body1">
        {gamesCount > 0
          ? `${points > 0 ? "+" : ""}${normalizeStat(points)}`
          : "-"}
      </Typography>
      {<TrendIcon gamesCount={gamesCount} points={points} />}
    </Stack>
  );
};

const TrendIcon: FC<{ gamesCount: number; points: number }> = ({
  gamesCount,
  points,
}) => {
  if (gamesCount > 0 || points !== 0) {
    return points < 0 ? (
      <TrendingDownIcon htmlColor="red" />
    ) : (
      <TrendingUpIcon htmlColor="green" />
    );
  }
  return <TrendingFlatIcon />;
};
